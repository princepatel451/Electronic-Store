const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })

const { Product } = require("../models/Product")
const { Category } = require("../models/Category")

const categoriesData = [
  { name: "Smartphones", description: "Flagship and premium mobile phones from world-class brands", image: "https://m.media-amazon.com/images/I/71R8VsJ07nL._SL1500_.jpg" },
  { name: "Laptops", description: "Performance ultrabooks, creator workstations, and gaming laptops", image: "https://m.media-amazon.com/images/I/61Ten0JgxQL._SL1500_.jpg" },
  { name: "Tablets", description: "Versatile tablets for productivity, digital drawing, and entertainment", image: "https://m.media-amazon.com/images/I/71kqkb77SjL._SL1500_.jpg" },
  { name: "Smartwatches", description: "Fitness trackers and luxury connected timepieces", image: "https://m.media-amazon.com/images/I/81V3wgQBeuL._SL1500_.jpg" },
  { name: "Audio & Headphones", description: "Noise-cancelling headphones, audiophile monitors, and wireless earbuds", image: "https://m.media-amazon.com/images/I/71ncxKR-6OL._SL1500_.jpg" },
  { name: "Gaming & Consoles", description: "Next-gen consoles, handheld gaming PCs, and gaming gear", image: "https://m.media-amazon.com/images/I/71TucbUXCHL._SL1500_.jpg" },
  { name: "Smart TVs", description: "4K OLED, QLED, and Mini-LED cinema displays", image: "https://m.media-amazon.com/images/I/81udrKi0c3L._SL1500_.jpg" }
]

const rawProducts = [
  // --- APPLE (12 Products) ---
  {
    name: "Apple iPhone 16 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    price: 144900,
    stock: 25,
    rating: 4.9,
    numReviews: 320,
    images: ["https://m.media-amazon.com/images/I/71R8VsJ07nL._SL1500_.jpg"],
    description: "iPhone 16 Pro Max features a Grade 5 Titanium design with the A18 Pro chip, 48MP Fusion camera with 5x optical telephoto, and Camera Control."
  },
  {
    name: "Apple iPhone 16",
    brand: "Apple",
    category: "Smartphones",
    price: 79900,
    stock: 30,
    rating: 4.7,
    numReviews: 240,
    images: ["https://m.media-amazon.com/images/I/712SuRmHG4L._SL1500_.jpg"],
    description: "Built for Apple Intelligence with the all-new A18 chip, Camera Control, 48MP Fusion camera, and 5 vibrant color-infused back glass finishes."
  },
  {
    name: "Apple iPhone 15",
    brand: "Apple",
    category: "Smartphones",
    price: 65900,
    stock: 35,
    rating: 4.8,
    numReviews: 480,
    images: ["https://m.media-amazon.com/images/I/712SuRmHG4L._SL1500_.jpg"],
    description: "Dynamic Island, 48MP Main camera with 2x Telephoto, durable color-infused glass and aluminum design with USB-C."
  },
  {
    name: "Apple MacBook Pro 16\" M3 Max",
    brand: "Apple",
    category: "Laptops",
    price: 349900,
    stock: 12,
    rating: 4.9,
    numReviews: 110,
    images: ["https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90"],
    description: "M3 Max chip with up to 16-core CPU and 40-core GPU, Liquid Retina XDR display, up to 128GB unified memory, and 22-hour battery life."
  },
  {
    name: "Apple MacBook Air 13\" M3",
    brand: "Apple",
    category: "Laptops",
    price: 114900,
    stock: 28,
    rating: 4.8,
    numReviews: 290,
    images: ["https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90"],
    description: "Supercharged by the M3 chip. Incredibly thin design, Liquid Retina display, MagSafe charging, and fanless silent architecture."
  },
  {
    name: "Apple iPad Pro 13\" M4 OLED",
    brand: "Apple",
    category: "Tablets",
    price: 129900,
    stock: 18,
    rating: 4.9,
    numReviews: 95,
    images: ["https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-spaceblack-wifi?wid=940&hei=1112&fmt=png-alpha&qlt=80"],
    description: "Breakthrough Ultra Retina XDR Tandem OLED display powered by the next-generation Apple M4 chip. Thinnest Apple product ever made."
  },
  {
    name: "Apple iPad Air 11\" M2",
    brand: "Apple",
    category: "Tablets",
    price: 59900,
    stock: 22,
    rating: 4.7,
    numReviews: 140,
    images: ["https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-finish-select-202405-11inch-blue-wifi?wid=940&hei=1112&fmt=png-alpha&qlt=80"],
    description: "Redesigned iPad Air powered by the blazing-fast Apple M2 chip, 11-inch Liquid Retina display, and landscape stereo speakers."
  },
  {
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "Smartwatches",
    price: 89900,
    stock: 15,
    rating: 4.9,
    numReviews: 180,
    images: ["https://m.media-amazon.com/images/I/81V3wgQBeuL._SL1500_.jpg"],
    description: "Rugged 49mm aerospace titanium case, brightest 3000-nit display, precision dual-frequency GPS, and up to 72 hours of battery life."
  },
  {
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "Smartwatches",
    price: 46900,
    stock: 30,
    rating: 4.8,
    numReviews: 210,
    images: ["https://m.media-amazon.com/images/I/61jsStDo4CL._SL1500_.jpg"],
    description: "Thinnest Apple Watch ever with the largest, most advanced wide-angle OLED display, sleep apnea notifications, and fast charging."
  },
  {
    name: "Apple AirPods Pro (2nd Gen) USB-C",
    brand: "Apple",
    category: "Audio & Headphones",
    price: 24900,
    stock: 45,
    rating: 4.8,
    numReviews: 460,
    images: ["https://m.media-amazon.com/images/I/710T1sZiT7L._SL1500_.jpg"],
    description: "Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and MagSafe charging case with USB-C and speaker."
  },
  {
    name: "Apple AirPods Max",
    brand: "Apple",
    category: "Audio & Headphones",
    price: 59900,
    stock: 14,
    rating: 4.7,
    numReviews: 130,
    images: ["https://m.media-amazon.com/images/I/71ncxKR-6OL._SL1500_.jpg"],
    description: "High-fidelity audio with custom dynamic driver, Active Noise Cancellation with Transparency mode, and knit-mesh canopy headband."
  },
  {
    name: "Apple Mac Mini M2",
    brand: "Apple",
    category: "Laptops",
    price: 59900,
    stock: 20,
    rating: 4.8,
    numReviews: 85,
    images: ["https://m.media-amazon.com/images/I/51NBurcRq2L._SL1500_.jpg"],
    description: "Desktop power in a compact 7.7-inch square enclosure. Powered by M2 with up to 24GB unified memory and dual Thunderbolt 4 ports."
  },

  // --- SAMSUNG (12 Products) ---
  {
    name: "Samsung Galaxy S24 Ultra 5G",
    brand: "Samsung",
    category: "Smartphones",
    price: 129999,
    stock: 28,
    rating: 4.9,
    numReviews: 410,
    images: ["https://m.media-amazon.com/images/I/71HReMsMPrL._SL1500_.jpg"],
    description: "Galaxy AI is here. Titanium frame, 200MP camera system, built-in S Pen, and Snapdragon 8 Gen 3 for Galaxy processor."
  },
  {
    name: "Samsung Galaxy S24+",
    brand: "Samsung",
    category: "Smartphones",
    price: 99999,
    stock: 22,
    rating: 4.7,
    numReviews: 190,
    images: ["https://m.media-amazon.com/images/I/7114RlvzXnL._SL1500_.jpg"],
    description: "6.7-inch QHD+ Dynamic AMOLED 2X display with Circle to Search, Live Translate, Armor Aluminum frame, and 4900mAh battery."
  },
  {
    name: "Samsung Galaxy Z Fold6",
    brand: "Samsung",
    category: "Smartphones",
    price: 164999,
    stock: 14,
    rating: 4.8,
    numReviews: 88,
    images: ["https://m.media-amazon.com/images/I/619Z1QHCy-L._SL1500_.jpg"],
    description: "Ultra-slim foldable with symmetrical bezels, dual AMOLED screens, S Pen fold edition support, and Galaxy AI multi-window multitasking."
  },
  {
    name: "Samsung Galaxy Z Flip6",
    brand: "Samsung",
    category: "Smartphones",
    price: 109999,
    stock: 19,
    rating: 4.6,
    numReviews: 145,
    images: ["https://m.media-amazon.com/images/I/619Z1QHCy-L._SL1500_.jpg"],
    description: "Compact clamshell folding phone with 3.4-inch FlexWindow, 50MP upgraded camera, vapor chamber cooling, and FlexCam hands-free framing."
  },
  {
    name: "Samsung Galaxy S23 FE 5G",
    brand: "Samsung",
    category: "Smartphones",
    price: 37999,
    stock: 40,
    rating: 4.5,
    numReviews: 310,
    images: ["https://m.media-amazon.com/images/I/71qGismu6NL._SL1500_.jpg"],
    description: "Flagship-grade 50MP camera, 120Hz Dynamic AMOLED display, water & dust resistance, and premium Gorilla Glass 5 finish."
  },
  {
    name: "Samsung Galaxy Book4 Pro 360",
    brand: "Samsung",
    category: "Laptops",
    price: 163990,
    stock: 10,
    rating: 4.8,
    numReviews: 70,
    images: ["https://m.media-amazon.com/images/I/714WVl1GG8L._SL1500_.jpg"],
    description: "2-in-1 touchscreen laptop powered by Intel Core Ultra 7 processor, Dynamic AMOLED 2X 120Hz screen, and bundled S Pen."
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    brand: "Samsung",
    category: "Tablets",
    price: 108999,
    stock: 15,
    rating: 4.9,
    numReviews: 95,
    images: ["https://m.media-amazon.com/images/I/71XsGusqSWL._SL1500_.jpg"],
    description: "Massive 14.6-inch Dynamic AMOLED 2X display, IP68 water resistance, Snapdragon 8 Gen 2 for Galaxy, and low-latency S Pen included."
  },
  {
    name: "Samsung Galaxy Watch Ultra",
    brand: "Samsung",
    category: "Smartwatches",
    price: 59999,
    stock: 16,
    rating: 4.7,
    numReviews: 80,
    images: ["https://m.media-amazon.com/images/I/81oGeBcCglL._SL1500_.jpg"],
    description: "Cushion titanium design, dual-frequency GPS, multi-sport tracking, emergency siren, and 100-hour battery saver mode."
  },
  {
    name: "Samsung Galaxy Watch7",
    brand: "Samsung",
    category: "Smartwatches",
    price: 29999,
    stock: 25,
    rating: 4.6,
    numReviews: 120,
    images: ["https://m.media-amazon.com/images/I/619tP9hJ1sL._SL1500_.jpg"],
    description: "Powered by a 3nm processor, Energy Score, Sleep Apnea detection, dual-frequency GPS, and BioActive sensor monitoring."
  },
  {
    name: "Samsung Galaxy Buds3 Pro",
    brand: "Samsung",
    category: "Audio & Headphones",
    price: 19999,
    stock: 35,
    rating: 4.6,
    numReviews: 160,
    images: ["https://m.media-amazon.com/images/I/51uxqujOBKL._SL1500_.jpg"],
    description: "Blade lights design, 24-bit Hi-Fi audio, enhanced dual-way speakers with planar tweeters, and Adaptive Noise Control with Galaxy AI."
  },
  {
    name: "Samsung 65\" Neo QLED 4K Smart TV",
    brand: "Samsung",
    category: "Smart TVs",
    price: 139990,
    stock: 8,
    rating: 4.8,
    numReviews: 75,
    images: ["https://images.samsung.com/is/image/samsung/p6pim/in/qa65qn85dbkxxl/gallery/in-neo-qled-4k-qn85d-qa65qn85dbkxxl-thumb-541170792?$216_216_PNG$"],
    description: "Quantum Matrix Technology with Mini LEDs, NQ4 AI Gen2 Processor, Dolby Atmos, and 120Hz Motion Xcelerator for gaming."
  },
  {
    name: "Samsung Odyssey OLED G9 49\" Gaming Monitor",
    brand: "Samsung",
    category: "Gaming & Consoles",
    price: 129999,
    stock: 7,
    rating: 4.9,
    numReviews: 50,
    images: ["https://images.samsung.com/is/image/samsung/p6pim/in/ls49cg954swxxl/gallery/in-odyssey-oled-g9-g95sc-464875-ls49cg954swxxl-thumb-537446597?$216_216_PNG$"],
    description: "Curved 49-inch Dual QHD OLED panel, 240Hz refresh rate, 0.03ms response time, Neo Quantum Processor Pro, and CoreSync lighting."
  },

  // --- ONEPLUS (10 Products) ---
  {
    name: "OnePlus 12 5G",
    brand: "OnePlus",
    category: "Smartphones",
    price: 64999,
    stock: 24,
    rating: 4.8,
    numReviews: 290,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera for Mobile, 2K 120Hz ProXDR display, and 5400mAh battery with 100W SUPERVOOC charging."
  },
  {
    name: "OnePlus 12R 5G",
    brand: "OnePlus",
    category: "Smartphones",
    price: 39999,
    stock: 35,
    rating: 4.7,
    numReviews: 380,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Snapdragon 8 Gen 2, 4th Gen 1.5K 120Hz LTPO display, massive 5500mAh battery with 100W fast charge, and dual vapor chamber cooling."
  },
  {
    name: "OnePlus Open Foldable",
    brand: "OnePlus",
    category: "Smartphones",
    price: 139999,
    stock: 12,
    rating: 4.9,
    numReviews: 105,
    images: ["https://m.media-amazon.com/images/I/61f5ZCuSD6L._SL1500_.jpg"],
    description: "Ultra-lightweight aerospace foldable, Sony LYT-T808 Pixel Stacked sensor with Hasselblad optics, and Open Canvas multitasking."
  },
  {
    name: "OnePlus Nord 4 5G",
    brand: "OnePlus",
    category: "Smartphones",
    price: 29999,
    stock: 40,
    rating: 4.6,
    numReviews: 210,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "All-metal unibody smartphone with Snapdragon 7+ Gen 3, 5500mAh battery, 100W fast charging, and 4 years of OS updates."
  },
  {
    name: "OnePlus Pad 2",
    brand: "OnePlus",
    category: "Tablets",
    price: 39999,
    stock: 20,
    rating: 4.7,
    numReviews: 90,
    images: ["https://m.media-amazon.com/images/I/61hqS5gsaBL._SL1500_.jpg"],
    description: "12.1-inch 3K 144Hz display, Snapdragon 8 Gen 3 flagship chipset, 6-speaker surround sound, and stylus support."
  },
  {
    name: "OnePlus Watch 2",
    brand: "OnePlus",
    category: "Smartwatches",
    price: 24999,
    stock: 25,
    rating: 4.7,
    numReviews: 130,
    images: ["https://m.media-amazon.com/images/I/61dywKQasaL._SL1500_.jpg"],
    description: "Dual-engine architecture with Snapdragon W5 and BES2700, Wear OS by Google, sapphire crystal glass, and 100-hour battery life."
  },
  {
    name: "OnePlus Watch 2R",
    brand: "OnePlus",
    category: "Smartwatches",
    price: 17999,
    stock: 30,
    rating: 4.5,
    numReviews: 110,
    images: ["https://m.media-amazon.com/images/I/61dywKQasaL._SL1500_.jpg"],
    description: "Lightweight aluminum body, Wear OS by Google, dual-frequency GPS, health metrics tracking, and 100 hours of battery life."
  },
  {
    name: "OnePlus Buds Pro 3",
    brand: "OnePlus",
    category: "Audio & Headphones",
    price: 11999,
    stock: 45,
    rating: 4.8,
    numReviews: 175,
    images: ["https://m.media-amazon.com/images/I/61SuuPF108L._SL1500_.jpg"],
    description: "Co-created with Dynaudio. Dual drivers, 50dB adaptive noise cancellation, dual DACs, and up to 43 hours of playback."
  },
  {
    name: "OnePlus Nord Buds 3 Pro",
    brand: "OnePlus",
    category: "Audio & Headphones",
    price: 3299,
    stock: 50,
    rating: 4.4,
    numReviews: 240,
    images: ["https://m.media-amazon.com/images/I/61SuuPF108L._SL1500_.jpg"],
    description: "Hybrid active noise cancellation up to 49dB, 12.4mm titanized diaphragm drivers, BassWave 2.0, and 44-hour battery life."
  },
  {
    name: "OnePlus Supervooc 100W Dual Port Power Adapter",
    brand: "OnePlus",
    category: "Gaming & Accessories",
    price: 2999,
    stock: 60,
    rating: 4.8,
    numReviews: 150,
    images: ["https://m.media-amazon.com/images/I/61tyyc8hesL._SL1500_.jpg"],
    description: "Dual ports (Type-C & Type-A) with 100W maximum output, PD fast charging protocol support, and smart thermal protection."
  },

  // --- OPPO (8 Products) ---
  {
    name: "Oppo Find X7 Ultra",
    brand: "Oppo",
    category: "Smartphones",
    price: 84999,
    stock: 15,
    rating: 4.9,
    numReviews: 120,
    images: ["https://m.media-amazon.com/images/I/81DnIkF7FsL._SL1500_.jpg"],
    description: "World's first quad main camera with dual periscope telephotos, 1-inch Sony LYT-900 sensor, Hasselblad portrait system, and Snapdragon 8 Gen 3."
  },
  {
    name: "Oppo Reno 12 Pro 5G",
    brand: "Oppo",
    category: "Smartphones",
    price: 36999,
    stock: 28,
    rating: 4.6,
    numReviews: 195,
    images: ["https://m.media-amazon.com/images/I/61XS3YRaPsL._SL1500_.jpg"],
    description: "Quad-curved Infinite View screen with AI Eraser 2.0, 50MP Sony flagship selfie camera, Dimensity 7300-Energy, and 80W SUPERVOOC."
  },
  {
    name: "Oppo Reno 12 5G",
    brand: "Oppo",
    category: "Smartphones",
    price: 32999,
    stock: 30,
    rating: 4.5,
    numReviews: 140,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Sleek aerodynamic design, Splash Touch display, AI Best Face for group selfies, and ultra-durable High-Strength Alloy Frame."
  },
  {
    name: "Oppo Find N3 Flip",
    brand: "Oppo",
    category: "Smartphones",
    price: 74999,
    stock: 12,
    rating: 4.7,
    numReviews: 85,
    images: ["https://m.media-amazon.com/images/I/517h1ScmuQL._SL1500_.jpg"],
    description: "Triple Hasselblad camera system on a flip phone with telephoto lens, intuitive vertical cover screen, and Flexion hinge."
  },
  {
    name: "Oppo F27 Pro+ 5G",
    brand: "Oppo",
    category: "Smartphones",
    price: 27999,
    stock: 35,
    rating: 4.6,
    numReviews: 220,
    images: ["https://m.media-amazon.com/images/I/71qxIwmnLsL._SL1500_.jpg"],
    description: "India's first IP69 waterproof smartphone with 360-degree Armour Body, 3D Curved AMOLED screen, and vegan leather back."
  },
  {
    name: "Oppo Pad 2",
    brand: "Oppo",
    category: "Tablets",
    price: 42999,
    stock: 18,
    rating: 4.7,
    numReviews: 70,
    images: ["https://m.media-amazon.com/images/I/71XsGusqSWL._SL1500_.jpg"],
    description: "7:5 ReadFit display aspect ratio, 144Hz ultra-high refresh rate, MediaTek Dimensity 9000, and Dolby Vision with quad speakers."
  },
  {
    name: "Oppo Enco X2 Wireless Earbuds",
    brand: "Oppo",
    category: "Audio & Headphones",
    price: 10999,
    stock: 30,
    rating: 4.7,
    numReviews: 160,
    images: ["https://m.media-amazon.com/images/I/51uxqujOBKL._SL1500_.jpg"],
    description: "Co-developed with Dynaudio. SuperDBEE coaxial dual drivers, LHDC 4.0 Hi-Res audio, and 45dB deep active noise cancellation."
  },
  {
    name: "Oppo Watch X",
    brand: "Oppo",
    category: "Smartwatches",
    price: 26999,
    stock: 16,
    rating: 4.6,
    numReviews: 80,
    images: ["https://m.media-amazon.com/images/I/61dywKQasaL._SL1500_.jpg"],
    description: "Stainless steel chassis, sapphire crystal display, Wear OS by Google, professional badminton mode, and 100-hour battery life."
  },

  // --- VIVO (8 Products) ---
  {
    name: "Vivo X100 Pro 5G",
    brand: "Vivo",
    category: "Smartphones",
    price: 89999,
    stock: 18,
    rating: 4.9,
    numReviews: 210,
    images: ["https://m.media-amazon.com/images/I/61XS3YRaPsL._SL1500_.jpg"],
    description: "Zeiss 1-inch main camera with APO floating telephoto, Vivo V3 imaging chip, Dimensity 9300 SoC, and 100W FlashCharge."
  },
  {
    name: "Vivo X Fold3 Pro",
    brand: "Vivo",
    category: "Smartphones",
    price: 159999,
    stock: 10,
    rating: 4.9,
    numReviews: 65,
    images: ["https://m.media-amazon.com/images/I/7114RlvzXnL._SL1500_.jpg"],
    description: "India's slimmest & lightest foldable with IPX8 waterproofing, Snapdragon 8 Gen 3, Zeiss optics, and dual ultrasonic fingerprint scanners."
  },
  {
    name: "Vivo V40 Pro 5G",
    brand: "Vivo",
    category: "Smartphones",
    price: 49999,
    stock: 25,
    rating: 4.7,
    numReviews: 180,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Zeiss Multifocal Portrait camera with 50MP Sony sensors on all cameras, 5500mAh BlueVolt battery, and IP68 dust & water resistance."
  },
  {
    name: "Vivo V40 5G",
    brand: "Vivo",
    category: "Smartphones",
    price: 34999,
    stock: 30,
    rating: 4.6,
    numReviews: 215,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Super slim 7.58mm 3D curved body with 5500mAh battery, Zeiss Aura Light portrait system, and Snapdragon 7 Gen 3."
  },
  {
    name: "Vivo T3 Ultra 5G",
    brand: "Vivo",
    category: "Smartphones",
    price: 31999,
    stock: 32,
    rating: 4.7,
    numReviews: 160,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Dimensity 9200+ flagship processor, 1.5K 120Hz 3D curved AMOLED screen, 50MP Sony IMX921 sensor with OIS, and 80W charging."
  },
  {
    name: "Vivo T3 Pro 5G",
    brand: "Vivo",
    category: "Smartphones",
    price: 24999,
    stock: 40,
    rating: 4.6,
    numReviews: 290,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Segment's brightest 4500 nits curved display, 5500mAh battery, Snapdragon 7 Gen 3, and vegan leather finish."
  },
  {
    name: "Vivo TWS 3e Earbuds",
    brand: "Vivo",
    category: "Audio & Headphones",
    price: 2499,
    stock: 50,
    rating: 4.3,
    numReviews: 180,
    images: ["https://m.media-amazon.com/images/I/710T1sZiT7L._SL1500_.jpg"],
    description: "Intelligent active noise cancellation, 11mm high-res sound unit, DeepX 3.0 stereo sound effects, and 42-hour total playback."
  },
  {
    name: "Vivo Pad Air",
    brand: "Vivo",
    category: "Tablets",
    price: 28999,
    stock: 20,
    rating: 4.5,
    numReviews: 60,
    images: ["https://m.media-amazon.com/images/I/71kqkb77SjL._SL1500_.jpg"],
    description: "11.5-inch 2.8K 144Hz high-refresh rate screen, Snapdragon 870 processor, quad-speaker super audio system, and 8500mAh battery."
  },

  // --- IQOO (6 Products) ---
  {
    name: "iQOO 12 5G Flagship",
    brand: "iQOO",
    category: "Smartphones",
    price: 52999,
    stock: 25,
    rating: 4.8,
    numReviews: 320,
    images: ["https://m.media-amazon.com/images/I/61o9FFbUEJL._SL1500_.jpg"],
    description: "India's first Snapdragon 8 Gen 3 smartphone. Supercomputing Chip Q1, 50MP periscope telephoto with 100x zoom, and 120W FlashCharge."
  },
  {
    name: "iQOO Neo 9 Pro 5G",
    brand: "iQOO",
    category: "Smartphones",
    price: 36999,
    stock: 35,
    rating: 4.8,
    numReviews: 410,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Dual chip powerhouse with Snapdragon 8 Gen 2 and Supercomputing Q1 chip, Sony IMX920 50MP camera, and 144Hz LTPO AMOLED."
  },
  {
    name: "iQOO Z9s Pro 5G",
    brand: "iQOO",
    category: "Smartphones",
    price: 24999,
    stock: 45,
    rating: 4.7,
    numReviews: 280,
    images: ["https://m.media-amazon.com/images/I/618IOq-RikL._SL1500_.jpg"],
    description: "Snapdragon 7 Gen 3, 5500mAh battery with 80W charging, 50MP Sony IMX882 camera with OIS, and 3D curved 120Hz display."
  },
  {
    name: "iQOO Z9 5G",
    brand: "iQOO",
    category: "Smartphones",
    price: 19999,
    stock: 50,
    rating: 4.6,
    numReviews: 350,
    images: ["https://m.media-amazon.com/images/I/618IOq-RikL._SL1500_.jpg"],
    description: "MediaTek Dimensity 7200 processor, 5000mAh battery with 44W charging, Sony OIS camera, and ultra-bright 1800-nit AMOLED."
  },
  {
    name: "iQOO TWS 1e Wireless Earbuds",
    brand: "iQOO",
    category: "Audio & Headphones",
    price: 2999,
    stock: 40,
    rating: 4.4,
    numReviews: 125,
    images: ["https://m.media-amazon.com/images/I/51uxqujOBKL._SL1500_.jpg"],
    description: "Active Noise Cancellation up to 30dB, 44 hours of total battery life, 55ms low latency gaming mode, and Monster Sound tuning."
  },
  {
    name: "iQOO Cooling Back Clip Pro",
    brand: "iQOO",
    category: "Gaming & Accessories",
    price: 2499,
    stock: 30,
    rating: 4.6,
    numReviews: 90,
    images: ["https://m.media-amazon.com/images/I/61Go0xLXaDL._SL1500_.jpg"],
    description: "Semiconductor mobile phone cooler with dual peltier chips, RGB lighting, and rapid temperature drop of up to 15 degrees."
  },

  // --- HP (8 Products) ---
  {
    name: "HP Spectre x360 14 OLED 2-in-1",
    brand: "HP",
    category: "Laptops",
    price: 154990,
    stock: 12,
    rating: 4.9,
    numReviews: 110,
    images: ["https://m.media-amazon.com/images/I/71Fz6SvBTRL._SL1500_.jpg"],
    description: "Intel Core Ultra 7 155H with Intel Arc graphics, 2.8K 120Hz OLED touchscreen, 9MP AI camera with night mode, and rechargeable stylus."
  },
  {
    name: "HP OMEN Transcend 14 Gaming Laptop",
    brand: "HP",
    category: "Laptops",
    price: 174990,
    stock: 10,
    rating: 4.8,
    numReviews: 75,
    images: ["https://m.media-amazon.com/images/I/81tmCrtiRgL._SL1500_.jpg"],
    description: "World's lightest 14-inch gaming laptop. Intel Core Ultra 9, NVIDIA GeForce RTX 4070 8GB, 2.8K 120Hz OLED, and HyperX audio tuning."
  },
  {
    name: "HP Envy x360 15 Convertible",
    brand: "HP",
    category: "Laptops",
    price: 89990,
    stock: 20,
    rating: 4.6,
    numReviews: 185,
    images: ["https://m.media-amazon.com/images/I/313p9ZcJvHL._SL1500_.jpg"],
    description: "Intel Core i7 13th Gen, 15.6-inch FHD touch display, IMAX Enhanced certified audio, and 5MP IR webcam with privacy shutter."
  },
  {
    name: "HP Pavilion Plus 14 OLED",
    brand: "HP",
    category: "Laptops",
    price: 76990,
    stock: 25,
    rating: 4.7,
    numReviews: 210,
    images: ["https://m.media-amazon.com/images/I/31MrCemFpjL._SL1500_.jpg"],
    description: "Lightweight aluminum chassis, AMD Ryzen 7 7840U, 2.8K 120Hz OLED screen with 500 nits HDR, and B&O tuned speakers."
  },
  {
    name: "HP Victus 16 Gaming Laptop",
    brand: "HP",
    category: "Laptops",
    price: 68990,
    stock: 30,
    rating: 4.5,
    numReviews: 320,
    images: ["https://m.media-amazon.com/images/I/81tmCrtiRgL._SL1500_.jpg"],
    description: "AMD Ryzen 5 7640HS, NVIDIA GeForce RTX 4050 6GB graphics, 144Hz IPS display, OMEN Gaming Hub, and upgraded thermal pipes."
  },
  {
    name: "HP Smart Tank 580 Wireless All-in-One Printer",
    brand: "HP",
    category: "Gaming & Accessories",
    price: 13999,
    stock: 25,
    rating: 4.5,
    numReviews: 290,
    images: ["https://m.media-amazon.com/images/I/51cqNSh6F0L._SL1500_.jpg"],
    description: "High-capacity ink tank printer with Wi-Fi, self-healing smart connection, up to 12,000 black and 6,000 color pages in box."
  },
  {
    name: "HP Omen 27k 4K 144Hz Gaming Monitor",
    brand: "HP",
    category: "Gaming & Accessories",
    price: 49999,
    stock: 12,
    rating: 4.8,
    numReviews: 65,
    images: ["https://m.media-amazon.com/images/I/81L4FC5jQoL._SL1500_.jpg"],
    description: "27-inch 4K UHD IPS panel, 144Hz refresh rate with 1ms response, HDMI 2.1, KVM switch, and custom ARGB rear glow."
  },
  {
    name: "HyperX Cloud III Wireless Headset (HP)",
    brand: "HP",
    category: "Audio & Headphones",
    price: 14990,
    stock: 35,
    rating: 4.8,
    numReviews: 180,
    images: ["https://m.media-amazon.com/images/I/71B76Dp0iSL._SL1500_.jpg"],
    description: "Up to 120 hours of battery life, angled 53mm dynamic drivers, DTS Headphone:X Spatial Audio, and ultra-clear 10mm microphone."
  },

  // --- DELL (8 Products) ---
  {
    name: "Dell XPS 16 9640 Core Ultra 7",
    brand: "Dell",
    category: "Laptops",
    price: 249990,
    stock: 10,
    rating: 4.9,
    numReviews: 90,
    images: ["https://m.media-amazon.com/images/I/71gVfCMgVUL._SL1500_.jpg"],
    description: "Seamless glass touchpad, capacitive touch function row, 16.3-inch 4K+ OLED InfinityEdge display, RTX 4060, and CNC aluminum."
  },
  {
    name: "Dell XPS 13 9340 Core Ultra 5",
    brand: "Dell",
    category: "Laptops",
    price: 139990,
    stock: 15,
    rating: 4.8,
    numReviews: 140,
    images: ["https://m.media-amazon.com/images/I/81ChAod8d6L._SL1500_.jpg"],
    description: "Ultra-portable 1.19kg chassis, Intel Core Ultra 5 125H with NPU for AI, 13.4-inch FHD+ 120Hz display, and 18-hour battery."
  },
  {
    name: "Dell Alienware m16 R2 Gaming Laptop",
    brand: "Dell",
    category: "Laptops",
    price: 189990,
    stock: 12,
    rating: 4.8,
    numReviews: 85,
    images: ["https://m.media-amazon.com/images/I/81tmCrtiRgL._SL1500_.jpg"],
    description: "Intel Core Ultra 9 185H, NVIDIA GeForce RTX 4070 8GB, 240Hz QHD+ display, Cryo-tech cooling, and stealth mode button."
  },
  {
    name: "Dell Inspiron 16 Plus",
    brand: "Dell",
    category: "Laptops",
    price: 89990,
    stock: 22,
    rating: 4.6,
    numReviews: 165,
    images: ["https://m.media-amazon.com/images/I/313p9ZcJvHL._SL1500_.jpg"],
    description: "16-inch 2.5K 16:10 display, Intel Core i7 13th Gen, 16GB DDR5, 1TB SSD, quad speakers with Waves MaxxAudio Pro."
  },
  {
    name: "Dell G15 5530 Gaming Laptop",
    brand: "Dell",
    category: "Laptops",
    price: 72990,
    stock: 28,
    rating: 4.5,
    numReviews: 280,
    images: ["https://m.media-amazon.com/images/I/81tmCrtiRgL._SL1500_.jpg"],
    description: "Retro color aesthetic, Intel Core i5 13th Gen, NVIDIA GeForce RTX 3050 6GB, 120Hz FHD panel, and Game Shift thermal boost."
  },
  {
    name: "Dell UltraSharp 32\" 4K USB-C Hub Monitor (U3223QE)",
    brand: "Dell",
    category: "Gaming & Accessories",
    price: 78990,
    stock: 14,
    rating: 4.9,
    numReviews: 95,
    images: ["https://m.media-amazon.com/images/I/71j03BJizxL._SL1500_.jpg"],
    description: "World's first 31.5-inch 4K monitor with IPS Black technology (2000:1 contrast ratio), 90W USB-C PD, RJ45 Ethernet, and built-in KVM."
  },
  {
    name: "Dell Premier Wireless ANC Headset (WL7024)",
    brand: "Dell",
    category: "Audio & Headphones",
    price: 26990,
    stock: 18,
    rating: 4.6,
    numReviews: 50,
    images: ["https://m.media-amazon.com/images/I/61FpBOJiWHL._SL1500_.jpg"],
    description: "AI-based active noise cancellation microphone, smart headband sensor, multi-point Bluetooth 5.3, and up to 78 hours battery."
  },
  {
    name: "Dell Alienware Pro Wireless Gaming Mouse",
    brand: "Dell",
    category: "Gaming & Accessories",
    price: 11990,
    stock: 30,
    rating: 4.7,
    numReviews: 85,
    images: ["https://m.media-amazon.com/images/I/61FmZfG48BL._SL1500_.jpg"],
    description: "4K wireless and 8K wired polling rate, 26,000 DPI optical sensor, optical switches, ultra-lightweight 60g symmetrical build."
  },

  // --- ASUS (8 Products) ---
  {
    name: "Asus ROG Zephyrus G16 OLED Gaming Laptop",
    brand: "Asus",
    category: "Laptops",
    price: 219990,
    stock: 10,
    rating: 4.9,
    numReviews: 120,
    images: ["https://m.media-amazon.com/images/I/81E3dq-M3ML._SL1500_.jpg"],
    description: "CNC aluminum chassis with Slash Lighting. Intel Core Ultra 9, NVIDIA RTX 4080, 2.5K 240Hz ROG Nebula OLED display."
  },
  {
    name: "Asus ROG Ally X Handheld Gaming PC",
    brand: "Asus",
    category: "Gaming & Consoles",
    price: 89999,
    stock: 20,
    rating: 4.8,
    numReviews: 190,
    images: ["https://m.media-amazon.com/images/I/61f8Co8YS2L._SL1500_.jpg"],
    description: "AMD Ryzen Z1 Extreme, upgraded 80Wh battery, 24GB LPDDR5X RAM, 1TB SSD, 7-inch 120Hz VRR display, and dual USB-C ports."
  },
  {
    name: "Asus Zenbook 14 OLED (UX3405)",
    brand: "Asus",
    category: "Laptops",
    price: 99990,
    stock: 22,
    rating: 4.7,
    numReviews: 170,
    images: ["https://m.media-amazon.com/images/I/81IMnbIglGL._SL1500_.jpg"],
    description: "Sleek 1.2kg ultrabook with Intel Core Ultra 7 155H, 3K 120Hz Lumina OLED display, 75Wh battery, and Harman Kardon Dolby Atmos sound."
  },
  {
    name: "Asus TUF Gaming F15 (2024)",
    brand: "Asus",
    category: "Laptops",
    price: 74990,
    stock: 35,
    rating: 4.6,
    numReviews: 340,
    images: ["https://m.media-amazon.com/images/I/81fyeRNwpKL._SL1500_.jpg"],
    description: "Military-grade durability, Intel Core i7 13th Gen, NVIDIA GeForce RTX 4050 6GB, 144Hz IPS display, and 90Wh battery."
  },
  {
    name: "Asus Vivobook S 15 OLED (Snapdragon X Elite)",
    brand: "Asus",
    category: "Laptops",
    price: 104990,
    stock: 18,
    rating: 4.7,
    numReviews: 95,
    images: ["https://m.media-amazon.com/images/I/713RoW0SJcL._SL1500_.jpg"],
    description: "Copilot+ PC powered by Qualcomm Snapdragon X Elite with 45 TOPS NPU, 3K 120Hz OLED screen, and over 18 hours of real-world battery."
  },
  {
    name: "Asus ROG Swift OLED PG32UCDM 32\" 4K 240Hz",
    brand: "Asus",
    category: "Gaming & Accessories",
    price: 139999,
    stock: 8,
    rating: 4.9,
    numReviews: 60,
    images: ["https://m.media-amazon.com/images/I/61rpZTslNtL._SL1500_.jpg"],
    description: "32-inch 4K QD-OLED panel, blazing 240Hz refresh rate, 0.03ms response time, custom heatsink with graphene film, and Type-C 90W PD."
  },
  {
    name: "Asus ROG Azoth Wireless 75% Mechanical Keyboard",
    brand: "Asus",
    category: "Gaming & Accessories",
    price: 24999,
    stock: 20,
    rating: 4.8,
    numReviews: 110,
    images: ["https://m.media-amazon.com/images/I/71Gg832c7QL._SL1500_.jpg"],
    description: "Gasket mount with silicon foam dampening, hot-swappable ROG NX switches, OLED display screen with 3-way control knob."
  },
  {
    name: "Asus ROG Cetra True Wireless SpeedNova",
    brand: "Asus",
    category: "Audio & Headphones",
    price: 17999,
    stock: 25,
    rating: 4.6,
    numReviews: 85,
    images: ["https://m.media-amazon.com/images/I/71B76Dp0iSL._SL1500_.jpg"],
    description: "Dual-mode 2.4 GHz ultra-low latency & Bluetooth, Dirac Opteo audio optimization, bone-conduction AI mics, and hybrid ANC."
  },

  // --- LENOVO (8 Products) ---
  {
    name: "Lenovo Legion Pro 7i Gen 9 Gaming Laptop",
    brand: "Lenovo",
    category: "Laptops",
    price: 279990,
    stock: 8,
    rating: 4.9,
    numReviews: 80,
    images: ["https://m.media-amazon.com/images/I/81tmCrtiRgL._SL1500_.jpg"],
    description: "Intel Core i9 14900HX, NVIDIA GeForce RTX 4090 16GB, 16-inch WQXGA 240Hz PureSight Gaming display, and Legion ColdFront vapor cooling."
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    brand: "Lenovo",
    category: "Laptops",
    price: 198990,
    stock: 12,
    rating: 4.9,
    numReviews: 115,
    images: ["https://m.media-amazon.com/images/I/31MrCemFpjL._SL1500_.jpg"],
    description: "Legendary business executive laptop. Carbon-fiber reinforced chassis, Intel Core Ultra 7, Communications Bar with 8MP webcam, and TrackPoint."
  },
  {
    name: "Lenovo Yoga Slim 7x (Snapdragon X Elite)",
    brand: "Lenovo",
    category: "Laptops",
    price: 129990,
    stock: 15,
    rating: 4.8,
    numReviews: 90,
    images: ["https://m.media-amazon.com/images/I/81ChAod8d6L._SL1500_.jpg"],
    description: "Copilot+ PC, 14.5-inch 3K 90Hz PureSight OLED touch display, Snapdragon X Elite with 45 TOPS NPU, and ultra-slim 12.9mm design."
  },
  {
    name: "Lenovo LOQ 15 Gaming Laptop",
    brand: "Lenovo",
    category: "Laptops",
    price: 68990,
    stock: 32,
    rating: 4.5,
    numReviews: 290,
    images: ["https://m.media-amazon.com/images/I/81ChAod8d6L._SL1500_.jpg"],
    description: "Intel Core i5 13th Gen, NVIDIA GeForce RTX 3050 6GB, 15.6-inch 144Hz FHD G-SYNC display, and Lenovo LA1 AI chip."
  },
  {
    name: "Lenovo Tab P12 with Stylus Pen",
    brand: "Lenovo",
    category: "Tablets",
    price: 24999,
    stock: 25,
    rating: 4.6,
    numReviews: 170,
    images: ["https://m.media-amazon.com/images/I/71XsGusqSWL._SL1500_.jpg"],
    description: "12.7-inch 3K display, quad JBL speakers with Dolby Atmos, MediaTek Dimensity 7050, 10200mAh battery, and bundled Lenovo Tab Pen Plus."
  },
  {
    name: "Lenovo Legion Go Handheld PC",
    brand: "Lenovo",
    category: "Gaming & Consoles",
    price: 69990,
    stock: 14,
    rating: 4.7,
    numReviews: 110,
    images: ["https://m.media-amazon.com/images/I/51CbTgXPNRL._SL1500_.jpg"],
    description: "8.8-inch QHD+ 144Hz PureSight gaming display, AMD Ryzen Z1 Extreme, detachable TrueStrike controllers with FPS mouse mode."
  },
  {
    name: "Lenovo ThinkVision 27\" 4K USB-C Monitor (P27u-20)",
    brand: "Lenovo",
    category: "Gaming & Accessories",
    price: 49990,
    stock: 16,
    rating: 4.7,
    numReviews: 70,
    images: ["https://m.media-amazon.com/images/I/81L4FC5jQoL._SL1500_.jpg"],
    description: "Thunderbolt 4 monitor with 99.1% DCI-P3 and 99.5% Adobe RGB color gamut, factory calibration, daisy-chaining, and KVM switch."
  },
  {
    name: "Lenovo Legion M600s Wireless Gaming Mouse",
    brand: "Lenovo",
    category: "Gaming & Accessories",
    price: 5499,
    stock: 35,
    rating: 4.5,
    numReviews: 130,
    images: ["https://m.media-amazon.com/images/I/61FmZfG48BL._SL1500_.jpg"],
    description: "Ultra-lightweight 69g design, Pixart 3370 19,000 DPI sensor, optical micro-switches rated for 80M clicks, and 2.4GHz + BT 5.0."
  },

  // --- REDMI / XIAOMI (8 Products) ---
  {
    name: "Xiaomi 14 Ultra 5G (Leica Optics)",
    brand: "Redmi",
    category: "Smartphones",
    price: 99999,
    stock: 15,
    rating: 4.9,
    numReviews: 190,
    images: ["https://m.media-amazon.com/images/I/815IEApVGvL._SL1500_.jpg"],
    description: "Quad 50MP Leica Summilux lens camera with stepless variable aperture on 1-inch LYT-900 sensor, WQHD+ 120Hz LTPO AMOLED, and Snapdragon 8 Gen 3."
  },
  {
    name: "Xiaomi 14 5G Compact Flagship",
    brand: "Redmi",
    category: "Smartphones",
    price: 59999,
    stock: 22,
    rating: 4.8,
    numReviews: 230,
    images: ["https://m.media-amazon.com/images/I/815IEApVGvL._SL1500_.jpg"],
    description: "Compact 6.36-inch 120Hz LTPO display, Leica professional triple camera, Snapdragon 8 Gen 3, and 90W HyperCharge with 50W wireless."
  },
  {
    name: "Redmi Note 13 Pro+ 5G",
    brand: "Redmi",
    category: "Smartphones",
    price: 29999,
    stock: 45,
    rating: 4.7,
    numReviews: 480,
    images: ["https://m.media-amazon.com/images/I/718NxFsqHOL._SL1500_.jpg"],
    description: "200MP OIS camera, 3D Curved 1.5K AMOLED 120Hz display, IP68 water resistance, MediaTek Dimensity 7200 Ultra, and 120W HyperCharge."
  },
  {
    name: "Redmi Note 13 5G",
    brand: "Redmi",
    category: "Smartphones",
    price: 16999,
    stock: 50,
    rating: 4.5,
    numReviews: 520,
    images: ["https://m.media-amazon.com/images/I/718NxFsqHOL._SL1500_.jpg"],
    description: "Super-slim 7.6mm body, 108MP pro camera, 120Hz AMOLED bezel-less screen, and MediaTek Dimensity 6080 5G chipset."
  },
  {
    name: "Xiaomi Pad 6 (Snapdragon 870)",
    brand: "Redmi",
    category: "Tablets",
    price: 23999,
    stock: 30,
    rating: 4.8,
    numReviews: 310,
    images: ["https://m.media-amazon.com/images/I/71kqkb77SjL._SL1500_.jpg"],
    description: "11-inch 2.8K 144Hz display, all-metal unibody design, quad speakers with Dolby Atmos, 8840mAh battery, and stylus support."
  },
  {
    name: "Redmi Watch 4",
    brand: "Redmi",
    category: "Smartwatches",
    price: 6999,
    stock: 35,
    rating: 4.5,
    numReviews: 240,
    images: ["https://m.media-amazon.com/images/I/61dywKQasaL._SL1500_.jpg"],
    description: "1.97-inch AMOLED 60Hz display, aluminum alloy middle frame, rotating stainless steel crown, built-in multi-system GPS, and 20 days battery."
  },
  {
    name: "Redmi Buds 5 Pro Wireless Earbuds",
    brand: "Redmi",
    category: "Audio & Headphones",
    price: 4999,
    stock: 40,
    rating: 4.6,
    numReviews: 190,
    images: ["https://m.media-amazon.com/images/I/51uxqujOBKL._SL1500_.jpg"],
    description: "52dB active noise cancellation with 4kHz ultra-wide frequency band, coaxial dual drivers, LDAC certified Hi-Res audio, and 38-hour battery."
  },
  {
    name: "Xiaomi 55\" X Pro 4K QLED Smart Google TV",
    brand: "Redmi",
    category: "Smart TVs",
    price: 44999,
    stock: 12,
    rating: 4.7,
    numReviews: 140,
    images: ["https://m.media-amazon.com/images/I/81O3Otf3bPL._SL1500_.jpg"],
    description: "4K Quantum Dot display with Dolby Vision IQ, 30W speaker system with Dolby Audio, Google TV operating system, and metallic bezel-less frame."
  },

  // --- SONY (8 Products) ---
  {
    name: "Sony PlayStation 5 Slim Console",
    brand: "Sony",
    category: "Gaming & Consoles",
    price: 54990,
    stock: 20,
    rating: 4.9,
    numReviews: 650,
    images: ["https://m.media-amazon.com/images/I/71TucbUXCHL._SL1500_.jpg"],
    description: "Slim design with 1TB SSD storage, ray tracing, 4K-TV gaming at up to 120fps, Tempest 3D AudioTech, and DualSense haptic feedback."
  },
  {
    name: "Sony DualSense Edge Wireless Controller",
    brand: "Sony",
    category: "Gaming & Consoles",
    price: 18990,
    stock: 25,
    rating: 4.8,
    numReviews: 110,
    images: ["https://m.media-amazon.com/images/I/516ZUBrUYEL._SL1500_.jpg"],
    description: "High-performance customizable controller for PS5. Changeable stick caps, remappable back buttons, and adjustable trigger stops."
  },
  {
    name: "Sony WH-1000XM5 Wireless ANC Headphones",
    brand: "Sony",
    category: "Audio & Headphones",
    price: 29990,
    stock: 30,
    rating: 4.9,
    numReviews: 540,
    images: ["https://m.media-amazon.com/images/I/61O3iMlnJIL._SL1500_.jpg"],
    description: "Industry-leading noise cancellation with dual processors and 8 microphones, 30-hour battery life, speak-to-chat, and crystal-clear hands-free calls."
  },
  {
    name: "Sony WF-1000XM5 Wireless Earbuds",
    brand: "Sony",
    category: "Audio & Headphones",
    price: 23990,
    stock: 35,
    rating: 4.8,
    numReviews: 320,
    images: ["https://m.media-amazon.com/images/I/61GJAFdM9pL._SL1500_.jpg"],
    description: "Dynamic Driver X for rich vocals and deep bass, Integrated Processor V2 with HD Noise Cancelling Processor QN2e, and bone conduction mics."
  },
  {
    name: "Sony BRAVIA 65\" 4K HDR OLED TV (XR-65A80L)",
    brand: "Sony",
    category: "Smart TVs",
    price: 219990,
    stock: 6,
    rating: 4.9,
    numReviews: 85,
    images: ["https://m.media-amazon.com/images/I/81udrKi0c3L._SL1500_.jpg"],
    description: "Cognitive Processor XR, pure OLED contrast with XR OLED Contrast Pro, Acoustic Surface Audio+, Google TV, and perfect for PS5."
  },
  {
    name: "Sony INZONE H9 Wireless Gaming Headset",
    brand: "Sony",
    category: "Audio & Headphones",
    price: 21990,
    stock: 18,
    rating: 4.7,
    numReviews: 95,
    images: ["https://m.media-amazon.com/images/I/41x4-FBtJZL._SL1500_.jpg"],
    description: "360 Spatial Sound for gaming, Dual Noise Sensor ANC with Ambient Sound mode, soft leatherette ear pads, and Discord-certified mic."
  },
  {
    name: "Sony Xperia 1 VI Flagship 5G",
    brand: "Sony",
    category: "Smartphones",
    price: 119999,
    stock: 10,
    rating: 4.7,
    numReviews: 60,
    images: ["https://m.media-amazon.com/images/I/7126jVP-TsL._SL1500_.jpg"],
    description: "Exmor T for mobile sensor, continuous optical telephoto 85-170mm zoom, Bravia tuned OLED display, and dedicated two-stage shutter button."
  },
  {
    name: "Sony SRS-XG300 Portable Bluetooth Boombox",
    brand: "Sony",
    category: "Audio & Headphones",
    price: 24990,
    stock: 20,
    rating: 4.8,
    numReviews: 110,
    images: ["https://m.media-amazon.com/images/I/81ONMqT6kDL._SL1500_.jpg"],
    description: "X-Balanced speaker units, MEGA BASS with live sound mode, IP67 water and dust resistance, retractable handle, and ambient ring lighting."
  },

  // --- NOTHING (5 Products) ---
  {
    name: "Nothing Phone (2) 5G (Glyph Interface)",
    brand: "Nothing",
    category: "Smartphones",
    price: 36999,
    stock: 30,
    rating: 4.7,
    numReviews: 310,
    images: ["https://m.media-amazon.com/images/I/71K0aSeGDBL._SL1500_.jpg"],
    description: "Iconic Glyph Interface with customized LED light patterns, Snapdragon 8+ Gen 1, 6.7-inch 120Hz LTPO OLED, and Nothing OS 2.5."
  },
  {
    name: "Nothing Phone (2a) Plus 5G",
    brand: "Nothing",
    category: "Smartphones",
    price: 27999,
    stock: 35,
    rating: 4.6,
    numReviews: 240,
    images: ["https://m.media-amazon.com/images/I/61XS3YRaPsL._SL1500_.jpg"],
    description: "Exclusive MediaTek Dimensity 7350 Pro 5G processor, metallic finish design, dual 50MP rear cameras with 50MP selfie, and 50W fast charge."
  },
  {
    name: "CMF Phone 1 by Nothing",
    brand: "Nothing",
    category: "Smartphones",
    price: 15999,
    stock: 50,
    rating: 4.5,
    numReviews: 380,
    images: ["https://m.media-amazon.com/images/I/61K37GFEP8L._SL1500_.jpg"],
    description: "Interchangeable back case with custom accessory mounting point, 6.67-inch 120Hz Super AMOLED, Dimensity 7300 5G, and 50MP Sony camera."
  },
  {
    name: "Nothing Ear (a) Wireless Earbuds",
    brand: "Nothing",
    category: "Audio & Headphones",
    price: 7999,
    stock: 40,
    rating: 4.7,
    numReviews: 190,
    images: ["https://m.media-amazon.com/images/I/51uxqujOBKL._SL1500_.jpg"],
    description: "Bold bubble transparent case design, 45dB Smart Active Noise Cancellation, custom 11mm dynamic driver with Hi-Res Audio, and 42.5 hours battery."
  },
  {
    name: "CMF Watch Pro 2 by Nothing",
    brand: "Nothing",
    category: "Smartwatches",
    price: 4999,
    stock: 45,
    rating: 4.5,
    numReviews: 210,
    images: ["https://m.media-amazon.com/images/I/61dywKQasaL._SL1500_.jpg"],
    description: "Interchangeable bezel design, 1.32-inch AMOLED display with auto-brightness, functional crown, built-in multi-system GPS, and Bluetooth calls."
  },

  // --- BOSE (4 Products) ---
  {
    name: "Bose QuietComfort Ultra Headphones",
    brand: "Bose",
    category: "Audio & Headphones",
    price: 35900,
    stock: 18,
    rating: 4.9,
    numReviews: 240,
    images: ["https://m.media-amazon.com/images/I/41s015PPoVL._SL1500_.jpg"],
    description: "World-class active noise cancellation, revolutionary Bose Immersive Audio, CustomTune technology that personalizes sound to your ear, and 24 hours battery."
  },
  {
    name: "Bose QuietComfort Ultra Earbuds",
    brand: "Bose",
    category: "Audio & Headphones",
    price: 25900,
    stock: 22,
    rating: 4.8,
    numReviews: 180,
    images: ["https://m.media-amazon.com/images/I/41s015PPoVL._SL1500_.jpg"],
    description: "Spatial audio with Bose Immersive Sound, world-class noise cancellation, 9 ear tip combinations for comfortable fit, and IPX4 sweat resistance."
  },
  {
    name: "Bose SoundLink Max Bluetooth Speaker",
    brand: "Bose",
    category: "Audio & Headphones",
    price: 39900,
    stock: 14,
    rating: 4.9,
    numReviews: 75,
    images: ["https://m.media-amazon.com/images/I/71EO8a4NofL._SL1500_.jpg"],
    description: "Deep, room-shaking stereo sound, built-in soft rope handle, IP67 dust and waterproof build, and up to 20 hours of continuous battery life."
  },
  {
    name: "Bose Smart Soundbar 600 with Dolby Atmos",
    brand: "Bose",
    category: "Audio & Headphones",
    price: 55900,
    stock: 10,
    rating: 4.8,
    numReviews: 90,
    images: ["https://m.media-amazon.com/images/I/51K1eC2y7RL._SL1500_.jpg"],
    description: "Dolby Atmos with proprietary TrueSpace technology, upward-firing transducers for immersive ceiling-reflected height channels, and Wi-Fi streaming."
  },

  // --- ADDITIONAL PREMIUM PRODUCTS (To exceed 100 total) ---
  {
    name: "Apple iPad Mini (7th Gen) A17 Pro",
    brand: "Apple",
    category: "Tablets",
    price: 49900,
    stock: 24,
    rating: 4.8,
    numReviews: 120,
    images: ["https://m.media-amazon.com/images/I/61Tix2-t7iL._SL1500_.jpg"],
    description: "Compact 8.3-inch Liquid Retina display powered by the A17 Pro chip with Apple Intelligence, Apple Pencil Pro support, and Wi-Fi 6E."
  },
  {
    name: "Samsung Galaxy Tab S9 FE+",
    brand: "Samsung",
    category: "Tablets",
    price: 46999,
    stock: 28,
    rating: 4.6,
    numReviews: 150,
    images: ["https://m.media-amazon.com/images/I/71XsGusqSWL._SL1500_.jpg"],
    description: "12.4-inch immersive 90Hz screen, IP68 water resistance, dual AKG speakers, 10090mAh battery, and bundled water-resistant S Pen."
  },
  {
    name: "Samsung Smart Monitor M8 32\" 4K with SlimFit Camera",
    brand: "Samsung",
    category: "Gaming & Accessories",
    price: 53999,
    stock: 14,
    rating: 4.7,
    numReviews: 80,
    images: ["https://images.samsung.com/is/image/samsung/p6pim/in/ls32cm801uwxxl/gallery/in-smart-monitor-m8-32m80c-457317-ls32cm801uwxxl-thumb-536507421?$216_216_PNG$"],
    description: "All-in-one Smart TV and 4K PC monitor with SmartThings IoT hub, detachable magnetic 4K webcam, HDR10+, and built-in streaming apps."
  },
  {
    name: "OnePlus 80W Car Charger",
    brand: "OnePlus",
    category: "Gaming & Accessories",
    price: 3999,
    stock: 45,
    rating: 4.7,
    numReviews: 130,
    images: ["https://m.media-amazon.com/images/I/61UCFe0Tv3L._SL1500_.jpg"],
    description: "Fast charging on the road. Dual ports with USB-A and USB-C output, intelligent power distribution, and multi-layer thermal protection."
  },
  {
    name: "Sony Alpha 7 IV Full-Frame Mirrorless Camera",
    brand: "Sony",
    category: "Gaming & Accessories",
    price: 219990,
    stock: 6,
    rating: 4.9,
    numReviews: 140,
    images: ["https://m.media-amazon.com/images/I/71s0d7ImwFL._SL1500_.jpg"],
    description: "33MP back-illuminated Exmor R CMOS sensor, 4K 60p 10-bit 4:2:2 video, real-time eye AF for humans/animals/birds, and 5-axis in-body stabilization."
  },
  {
    name: "Asus ROG Falchion RX Low Profile 65% Wireless Keyboard",
    brand: "Asus",
    category: "Gaming & Accessories",
    price: 18999,
    stock: 18,
    rating: 4.8,
    numReviews: 65,
    images: ["https://m.media-amazon.com/images/I/613lNFyR5ZL._SL1500_.jpg"],
    description: "Pre-lubed ROG RX Low-Profile Optical Switches, interactive touch panel, 2.4 GHz SpeedNova wireless, and protective travel cover."
  },
  {
    name: "Dell Pro Webcam 2K QHD (WB5023)",
    brand: "Dell",
    category: "Gaming & Accessories",
    price: 9990,
    stock: 35,
    rating: 4.6,
    numReviews: 110,
    images: ["https://m.media-amazon.com/images/I/51IpsJmhInL._SL1500_.jpg"],
    description: "Sony STARVIS sensor for exceptional low-light clarity, 2K QHD 30fps / 1080p 60fps, AI auto-framing, and noise reduction microphone."
  },
  {
    name: "HP Wireless Ergonomic Mouse 930 Creator",
    brand: "HP",
    category: "Gaming & Accessories",
    price: 6990,
    stock: 40,
    rating: 4.5,
    numReviews: 95,
    images: ["https://m.media-amazon.com/images/I/51XD9xBDB8L._SL1500_.jpg"],
    description: "Connect up to 3 devices with seamless cursor flow, 7 programmable buttons, hyper-fast scroll wheel, and up to 12 weeks of battery."
  },
  {
    name: "Lenovo Legion Gaming Backpack GB700",
    brand: "Lenovo",
    category: "Gaming & Accessories",
    price: 4999,
    stock: 50,
    rating: 4.7,
    numReviews: 160,
    images: ["https://m.media-amazon.com/images/I/313p9ZcJvHL._SL1500_.jpg"],
    description: "Water-repellent armored exterior, fidlock magnetic buckle, fits up to 17-inch gaming laptops, with multiple organized tech compartments."
  },
  {
    name: "Bose SoundLink Revolve+ II 360 Bluetooth Speaker",
    brand: "Bose",
    category: "Audio & Headphones",
    price: 29400,
    stock: 16,
    rating: 4.8,
    numReviews: 210,
    images: ["https://m.media-amazon.com/images/I/81stTfpLJyL._SL1500_.jpg"],
    description: "True 360-degree deep acoustic coverage, flexible fabric handle, IP55 water and dust resistance, and 17 hours of battery life."
  }
]

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/electronics"
    console.log("Connecting to MongoDB at:", mongoUri)
    await mongoose.connect(mongoUri)
    console.log("MongoDB connected successfully!")

    // 1. Ensure Categories exist and map by name
    const categoryMap = {}
    for (const cat of categoriesData) {
      let existing = await Category.findOne({ name: cat.name })
      if (!existing) {
        existing = await Category.create(cat)
        console.log(`Created category: ${cat.name}`)
      }
      categoryMap[cat.name] = existing._id
    }

    // Default category fallback
    const defaultCategoryId = categoryMap["Smartphones"] || Object.values(categoryMap)[0]

    console.log("\nSeeding products...")
    let insertedCount = 0
    let updatedCount = 0

    for (const prod of rawProducts) {
      const catId = categoryMap[prod.category] || defaultCategoryId

      const productPayload = {
        name: prod.name,
        brand: prod.brand,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        category: catId,
        images: prod.images,
        rating: prod.rating,
        numReviews: prod.numReviews,
        supplier: {
          source: prod.brand.toUpperCase() === "SAMSUNG" ? "SAMSUNG" : "OFFICIAL",
          originalUrl: "",
          originalPrice: prod.price,
          lastSyncedAt: new Date()
        }
      }

      const existing = await Product.findOne({ name: prod.name })
      if (existing) {
        await Product.findByIdAndUpdate(existing._id, productPayload)
        updatedCount++
      } else {
        await Product.create(productPayload)
        insertedCount++
      }
    }

    const totalInDb = await Product.countDocuments()
    console.log(`\n========================================`)
    console.log(`Seeding complete!`)
    console.log(`- New products inserted: ${insertedCount}`)
    console.log(`- Existing products updated: ${updatedCount}`)
    console.log(`- Total products in database: ${totalInDb}`)
    console.log(`========================================`)

    process.exit(0)
  } catch (err) {
    console.error("Seeding error:", err)
    process.exit(1)
  }
}

seedDatabase()
