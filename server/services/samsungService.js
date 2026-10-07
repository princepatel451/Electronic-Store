const axios = require("axios")
const cheerio = require("cheerio")

// User-agent to avoid simple scraping blocks
const BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
}

/**
 * Scrapes product data from a Samsung website URL.
 * Extracts title, price, description, images, and model codes via JSON-LD or meta tags.
 */
async function scrapeSamsungProduct(url) {
    if (!url || typeof url !== "string") {
        throw new Error("A valid Samsung product URL is required")
    }

    const cleanUrl = url.trim()
    if (!cleanUrl.includes("samsung.com")) {
        throw new Error("URL must be from the official samsung.com domain")
    }

    try {
        const response = await axios.get(cleanUrl, {
            headers: BROWSER_HEADERS,
            timeout: 12000
        })

        const html = response.data
        const $ = cheerio.load(html)

        let name = ""
        let description = ""
        let price = 0
        let images = []
        let modelCode = ""

        // 1. Attempt to extract from JSON-LD Schema
        $('script[type="application/ld+json"]').each((_, elem) => {
            try {
                const jsonText = $(elem).html()
                if (!jsonText) return
                const data = JSON.parse(jsonText)

                const productItem = Array.isArray(data)
                    ? data.find(d => d["@type"] === "Product")
                    : data["@type"] === "Product"
                        ? data
                        : data["@graph"]?.find(d => d["@type"] === "Product")

                if (productItem) {
                    if (productItem.name && !name) name = productItem.name
                    if (productItem.description && !description) description = productItem.description
                    if (productItem.mpn || productItem.sku) modelCode = productItem.mpn || productItem.sku

                    // Extract price from offers
                    if (productItem.offers) {
                        const offer = Array.isArray(productItem.offers) ? productItem.offers[0] : productItem.offers
                        if (offer?.price) {
                            price = parseFloat(offer.price) || 0
                        }
                    }

                    // Extract images
                    if (productItem.image) {
                        if (Array.isArray(productItem.image)) {
                            images.push(...productItem.image.filter(Boolean))
                        } else if (typeof productItem.image === "string") {
                            images.push(productItem.image)
                        } else if (productItem.image?.url) {
                            images.push(productItem.image.url)
                        }
                    }
                }
            } catch (err) {
                // Ignore parse errors on secondary script tags
            }
        })

        // 2. Fallbacks using OpenGraph & Meta tags
        if (!name) {
            name = $('meta[property="og:title"]').attr("content") ||
                $('meta[name="twitter:title"]').attr("content") ||
                $('h1').first().text().trim()
        }

        // Clean up common suffix in Samsung title
        if (name) {
            name = name.replace(/\s*\|\s*Samsung\s*(India|US|UK|Global)?/gi, "").trim()
        }

        if (!description) {
            description = $('meta[property="og:description"]').attr("content") ||
                $('meta[name="description"]').attr("content") ||
                $('p.product-details__desc').text().trim() ||
                `${name} - Official Samsung product`
        }

        const ogImage = $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content")
        if (ogImage && !images.includes(ogImage)) {
            images.unshift(ogImage)
        }

        // Extract gallery images from Samsung DOM if available
        $('img[src*="images.samsung.com"]').each((_, imgTag) => {
            const src = $(imgTag).attr("src") || $(imgTag).attr("data-src")
            if (src && !images.includes(src) && !src.includes("icon") && !src.includes("logo")) {
                images.push(src)
            }
        })

        // Fallback price extraction from meta or text
        if (!price) {
            const metaPrice = $('meta[property="product:price:amount"]').attr("content") ||
                $('[data-modelcode-price]').attr("data-modelcode-price") ||
                $('.cost-box__price-now, .pd-info__price, .price-main').first().text().trim()

            if (metaPrice) {
                const numeric = String(metaPrice).replace(/[^0-9.]/g, "")
                price = parseFloat(numeric) || 0
            }
        }

        // Extract model code from URL if missing (e.g., SM-S928B...)
        if (!modelCode) {
            const modelMatch = cleanUrl.match(/([A-Z]{2,3}-[A-Z0-9]+)/i)
            if (modelMatch) {
                modelCode = modelMatch[1].toUpperCase()
            }
        }

        // Normalize images (deduplicate & filter)
        images = Array.from(new Set(images.filter(img => typeof img === "string" && img.startsWith("http")))).slice(0, 6)

        return {
            name: name || "Samsung Product",
            brand: "Samsung",
            description: description || "Authentic Samsung device.",
            price: price || 0,
            images,
            modelCode: modelCode || "",
            originalUrl: cleanUrl,
            stock: 10
        }
    } catch (error) {
        throw new Error(`Failed to fetch Samsung product from URL: ${error.message}`)
    }
}

/**
 * Creates a 1-Click Semi-Automated Fulfillment package for an order containing Samsung products.
 * Provides pre-formatted recipient info, clipboard payload, and quick-buy launch links.
 */
function createSamsungFulfillmentPackage(order) {
    const shipping = order.shippingAddress || {}
    const items = order.items || []

    const formattedAddress = [
        shipping.fullName,
        shipping.phone ? `Phone: ${shipping.phone}` : "",
        shipping.addressLine,
        `${shipping.city}, ${shipping.state} - ${shipping.pincode}`,
        "India"
    ].filter(Boolean).join("\n")

    const itemDetails = items.map((item, index) => {
        const prod = item.product || {}
        const supplierInfo = prod.supplier || {}
        const directUrl = supplierInfo.originalUrl || `https://www.samsung.com/in/search/?searchvalue=${encodeURIComponent(item.name)}`

        return {
            index: index + 1,
            productId: item.product?._id || item.product,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            modelCode: supplierInfo.modelCode || "N/A",
            directUrl
        }
    })

    const clipboardText = `
=== SAMSUNG 1-CLICK FULFILLMENT ===
Order ID: #${order._id.toString().slice(-8)}
Total to Charge Customer: ₹${order.totalAmount}

--- SHIPPING RECIPIENT ---
Name: ${shipping.fullName}
Phone: ${shipping.phone}
Address: ${shipping.addressLine}
City: ${shipping.city}
State: ${shipping.state}
Pincode: ${shipping.pincode}

--- ITEMS TO ORDER ON SAMSUNG.COM ---
${itemDetails.map(i => `${i.index}. ${i.name} (Qty: ${i.quantity}) - Model: ${i.modelCode}\n   Direct Link: ${i.directUrl}`).join("\n")}
===================================
`.trim()

    return {
        orderId: order._id,
        recipient: {
            fullName: shipping.fullName,
            phone: shipping.phone,
            addressLine: shipping.addressLine,
            city: shipping.city,
            state: shipping.state,
            pincode: shipping.pincode,
            formattedAddress
        },
        items: itemDetails,
        clipboardText,
        fulfillmentStatus: order.fulfillment?.status || "UNFULFILLED",
        supplierOrderId: order.fulfillment?.supplierOrderId || "",
        trackingNumber: order.fulfillment?.trackingNumber || ""
    }
}

module.exports = {
    scrapeSamsungProduct,
    createSamsungFulfillmentPackage
}
