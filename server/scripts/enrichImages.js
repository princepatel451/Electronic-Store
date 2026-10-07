const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Fetch authentic Amazon product image for a keyword
function fetchAmazonImage(keyword) {
  return new Promise((resolve) => {
    // Clean up keywords to optimize Amazon search ranking
    const cleanKeyword = keyword
      .replace(/\(.*?\)/g, "")
      .replace(/Flagship|Compact|2-in-1|Convertible|OLED Gaming Laptop/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const q = encodeURIComponent(cleanKeyword);
    const url = `https://www.amazon.in/s?k=${q}`;
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    };

    const req = https.get(url, options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        // Match product image IDs from Amazon search result cards
        const matches = [...data.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/([a-zA-Z0-9%_-]+)\._AC_[a-zA-Z0-9_,]+\.jpg/g)];
        if (matches && matches.length > 0) {
          const id = matches[0][1];
          const highRes = `https://m.media-amazon.com/images/I/${id}._SL1500_.jpg`;
          return resolve(highRes);
        }

        // Secondary fallback pattern for Amazon images
        const fallbackMatches = [...data.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/([a-zA-Z0-9%_-]{10,14})\.jpg/g)];
        if (fallbackMatches && fallbackMatches.length > 0) {
          const id = fallbackMatches[0][1];
          const highRes = `https://m.media-amazon.com/images/I/${id}._SL1500_.jpg`;
          return resolve(highRes);
        }

        resolve(null);
      });
    });

    req.on("error", () => resolve(null));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

// Verify URL returns HTTP 200
function verifyUrl(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function enrichAllProductImages() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/electronics";
  console.log("Connecting to MongoDB at:", mongoUri);
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB successfully!");

  const productsCollection = mongoose.connection.db.collection("products");
  const products = await productsCollection.find({}).sort({ brand: 1, name: 1 }).toArray();
  console.log(`Found ${products.length} products to enrich with authentic Amazon / brand images.\n`);

  let updatedCount = 0;
  let fallbackCount = 0;
  const imageMap = {};

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const currentImg = prod.images && prod.images[0];

    console.log(`[${i + 1}/${products.length}] Processing: "${prod.name}" (${prod.brand})`);

    // Clean query: avoid "Apple Apple iPhone 16"
    const searchName = prod.name.toLowerCase().startsWith(prod.brand.toLowerCase())
      ? prod.name
      : `${prod.brand} ${prod.name}`;

    let targetImg = null;

    // Try fetching authentic Amazon image
    const amazonImg = await fetchAmazonImage(searchName);
    if (amazonImg) {
      const isValid = await verifyUrl(amazonImg);
      if (isValid) {
        targetImg = amazonImg;
        console.log(`   -> Found Amazon Image (200 OK): ${amazonImg}`);
      }
    }

    // Fallback: If search with full name failed, try simpler search
    if (!targetImg) {
      const simplified = prod.name.split(" ").slice(0, 4).join(" ");
      const fallbackImg = await fetchAmazonImage(simplified);
      if (fallbackImg && (await verifyUrl(fallbackImg))) {
        targetImg = fallbackImg;
        console.log(`   -> Fallback Amazon Image (200 OK): ${fallbackImg}`);
      }
    }

    // Fallback: check if existing image is valid (and not unsplash)
    if (!targetImg && currentImg && !currentImg.includes("unsplash.com")) {
      const isCurrentValid = await verifyUrl(currentImg);
      if (isCurrentValid) {
        targetImg = currentImg;
        console.log(`   -> Retaining verified brand image: ${currentImg}`);
      }
    }

    if (targetImg) {
      await productsCollection.updateOne(
        { _id: prod._id },
        { $set: { images: [targetImg] } }
      );
      imageMap[prod.name] = targetImg;
      updatedCount++;
    } else {
      console.log(`   -> Warning: Could not find valid image for "${prod.name}"`);
      fallbackCount++;
    }

    // Gentle pacing to avoid Amazon rate limits
    await sleep(200);
  }

  console.log("\n==========================================");
  console.log("Image Enrichment Complete!");
  console.log(`- Successfully updated: ${updatedCount} products`);
  console.log(`- Fallbacks / Misses: ${fallbackCount}`);
  console.log("==========================================\n");

  // Now update seedProducts.js with the verified images
  const seedFilePath = path.join(__dirname, "seedProducts.js");
  if (fs.existsSync(seedFilePath)) {
    console.log("Updating seedProducts.js with verified Amazon & brand image URLs...");
    let seedContent = fs.readFileSync(seedFilePath, "utf8");

    for (const [name, imgUrl] of Object.entries(imageMap)) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(name:\\s*"${escapedName}",[\\s\\S]*?images:\\s*\\[)[^\\]]+(\\])`, "g");
      seedContent = seedContent.replace(regex, `$1"${imgUrl}"$2`);
    }

    fs.writeFileSync(seedFilePath, seedContent, "utf8");
    console.log("seedProducts.js successfully updated with authentic image URLs!");
  }

  await mongoose.disconnect();
  console.log("Done!");
}

enrichAllProductImages().catch((err) => {
  console.error("Enrichment error:", err);
  process.exit(1);
});
