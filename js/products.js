// Product data for Lumora Store
// Real best sellers from Flipkart, Amazon, and Meesho
const PRODUCTS = [
    // ===== PHONE CASES =====
    {
        id: "pc-001",
        name: "Shockproof Armor Back Case (Universal)",
        category: "Phone Cases",
        price: 299,
        marketplace: "meesho",
        orderUrl: "https://www.meesho.com/mobile-cases-and-covers/pl/68m0",
        image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop",
        description: "Rugged shockproof TPU case with armor design. Universal fit for all smartphones. Anti-drop protection with raised camera lip.",
        compatible: ["All iPhone models", "All Samsung models", "All OnePlus models", "All Redmi models"]
    },
    {
        id: "pc-002",
        name: "Transparent Eagle Cover (Universal)",
        category: "Phone Cases",
        price: 249,
        marketplace: "meesho",
        orderUrl: "https://www.meesho.com/moto-g86-g86-power-5g-transparent-eagle-cover-shockproof-armor-back-case-rugged-mobile-cover-for-men-women-phone-cover-mobile-cover-best-stylish-mobile-back-cover-cover/p/9zew6u",
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=400&fit=crop",
        description: "Clear transparent case with eagle design. Shockproof armor back, rugged mobile cover for men & women. Shows off your phone color.",
        compatible: ["All iPhone models", "All Samsung models", "All Vivo models", "All Oppo models"]
    },
    {
        id: "pc-003",
        name: "Slim Shockproof Back Cover (Universal)",
        category: "Phone Cases",
        price: 199,
        marketplace: "flipkart",
        orderUrl: "https://www.flipkart.com/mobile-accessories/cases-and-covers/pr?sid=tyy,4mr,q2u",
        image: "https://images.unsplash.com/photo-1541877944-ac82a091518a?w=400&h=400&fit=crop",
        description: "Ultra-slim shockproof back cover. Lightweight TPU material with camera lens protection. Matte finish, anti-fingerprint.",
        compatible: ["iPhone 13-16", "Samsung S21-S24", "OnePlus 8-12", "Redmi Note 10-13"]
    },

    // ===== STICKERS =====
    {
        id: "st-001",
        name: "PRINTHUA Vinyl Stickers Pack of 51",
        category: "Stickers",
        price: 199,
        marketplace: "flipkart",
        orderUrl: "https://www.flipkart.com/printhua-vinyl-sticker-pack-51-residue-free-water-proof-reusable-laptop-skin-compatible-15-5-inch/p/itme27b7482cc350",
        image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=400&fit=crop",
        description: "Pack of 51 premium vinyl stickers. Waterproof, residue-free, reusable. Perfect for laptops, tablets, phones, bikes. Theme: Illustrations.",
        designs: ["Illustrations", "Signs & Symbols", "Cartoon", "Vintage", "Retro", "Anime", "Gaming", "Tech", "Nature", "Space"]
    },
    {
        id: "st-002",
        name: "TYUSO Avengers Logo Vinyl Wrap",
        category: "Stickers",
        price: 249,
        marketplace: "flipkart",
        orderUrl: "https://www.flipkart.com/tyuso-avengers-logo-vinyl-wrap-premium-matte-finish-scratch-resistant-waterproof-laptop-skin-compatible-15-6-inch/p/itm7a9990f1d7dda",
        image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop",
        description: "Premium matte finish vinyl wrap with Avengers logo. Scratch resistant & waterproof. Compatible with 15.6 inch laptops. Reusable.",
        designs: ["Avengers Logo", "Marvel Heroes", "Comic Style", "Matte Finish", "Scratch Resistant", "Waterproof", "Reusable", "Premium Vinyl"]
    },
    {
        id: "st-003",
        name: "Random Vinyl Stickers Pack of 52",
        category: "Stickers",
        price: 149,
        marketplace: "meesho",
        orderUrl: "https://www.meesho.com/pack-of-52-random-vinyl-stickers-for-laptop-journal-guitar-mobile-phone-waterproof-residue-free-stickers/p/6kc6wp",
        image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=400&fit=crop",
        description: "Pack of 52 random vinyl stickers. Waterproof, residue-free. For laptops, journals, guitars, mobile phones. Assorted designs.",
        designs: ["Random Mix", "Waterproof", "Residue Free", "Assorted", "Vinyl", "Durable", "Colorful", "Trendy"]
    },

    // ===== LED LIGHTS =====
    {
        id: "led-001",
        name: "Gesto 5 Meter Smart LED Strip (Music Sync + Alexa)",
        category: "LED Lights",
        price: 899,
        marketplace: "flipkart",
        orderUrl: "https://www.flipkart.com/gesto-5-meter-smart-led-strip-music-sync-alexa-google-app-remote-controlled-light/p/itm9e0887924133f",
        image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&h=400&fit=crop",
        description: "5 meter smart LED strip with music sync. Works with Alexa & Google Home. App + remote controlled. 16M colors, waterproof, cuttable.",
        specs: ["5 meters", "16M colors", "Music sync", "Alexa & Google Home", "App + Remote control", "Waterproof IP65", "Cuttable", "AC adapter included"]
    },
    {
        id: "led-002",
        name: "One94Store Smart LED Strip 5M (App + Remote)",
        category: "LED Lights",
        price: 649,
        marketplace: "amazon",
        orderUrl: "https://www.amazon.in/dp/B0GV7G2SVL",
        image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&h=400&fit=crop",
        description: "5M RGB LED strip with app & remote control. Music sync, 16 million colors. Perfect for gaming room, bedroom, TV backlight, home decor.",
        specs: ["5 meters", "16M colors", "App + Remote control", "Music sync", "Flexible SMD rope", "TV backlight", "Gaming room", "Party decoration"]
    },
    {
        id: "led-003",
        name: "Forus 5M Smart RGB Neon LED Strip",
        category: "LED Lights",
        price: 799,
        marketplace: "amazon",
        orderUrl: "https://www.amazon.in/dp/B0EXAMPLE",
        image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&h=400&fit=crop",
        description: "5M smart RGB neon LED strip with app & remote. Music sync rope light, 16M+ colors. For room, gaming, TV backlight, party, home decoration.",
        specs: ["5 meters", "16M+ colors", "App + Remote", "Music sync", "RGB IC strip", "3M warranty", "Room lighting", "Gaming setup"]
    },

    // ===== DESK ACCESSORIES =====
    {
        id: "dk-001",
        name: "MMTX XXL Gaming Mouse Mat 80x40",
        category: "Desk Accessories",
        price: 399,
        marketplace: "flipkart",
        orderUrl: "https://www.flipkart.com/mmtx-xxl-gaming-mouse-mat-extended-extra-large-pad-80-40-map-black-non-slip-base-dual-sided-mousepad/p/itmf367b8f6127b9",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        description: "XXL gaming mouse mat 80x40cm. Non-slip base, dual sided. Waterproof surface, stitched edges. Perfect for gaming & office work.",
        specs: ["80x40cm", "XXL size", "Non-slip rubber base", "Dual sided", "Waterproof", "Stitched edges", "Gaming + Office", "Smooth surface"]
    },
    {
        id: "dk-002",
        name: "Ambrane Twistand Mobile Holder",
        category: "Desk Accessories",
        price: 249,
        marketplace: "flipkart",
        orderUrl: "https://www.flipkart.com/ambrane-twistand-mobile-holder/p/itm428c3934a9a2a",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
        description: "Foldable mobile holder with twist design. Adjustable angle & height. Universal desk stand for smartphones. Anti-skid, lightweight.",
        specs: ["Foldable design", "Adjustable angle", "Universal fit", "Anti-skid", "Lightweight", "Video calling", "Browsing", "Watching videos"]
    },
    {
        id: "dk-003",
        name: "Portronics MODESK Universal Mobile Stand",
        category: "Desk Accessories",
        price: 349,
        marketplace: "amazon",
        orderUrl: "https://www.amazon.in/dp/B0EXAMPLE",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
        description: "Universal mobile holder stand with metal body. Anti-skid design, lightweight. For all smartphones, tablets, Kindle, iPad. Best seller on Amazon.",
        specs: ["Metal body", "Anti-skid design", "Universal fit", "Lightweight", "All smartphones", "Tablets", "Kindle", "iPad compatible"]
    },
    {
        id: "dk-004",
        name: "Kreo Terra XXL Deskmat 90x40",
        category: "Desk Accessories",
        price: 899,
        marketplace: "flipkart",
        orderUrl: "https://www.flipkart.com/kreo-terra-xxl-deskmat-premium-ultra-smooth-surface-4mm-cushioned-base-900400mm-non-slip-mousepad/p/itmd9691aa821db7",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        description: "Premium XXL deskmat 90x40cm. Ultra smooth surface, 4mm cushioned base. Non-slip, stitched edges. Perfect for gaming & professional work.",
        specs: ["90x40cm", "XXL size", "4mm cushioned", "Ultra smooth", "Non-slip base", "Stitched edges", "Gaming + Professional", "Premium quality"]
    }
];

// ===== CONFIGURATION =====
const FAMPAY_UPI = "7796517826@fam";

const TELEGRAM_BOT_TOKEN = "8544045055:AAEohLIInF8YuBRPlU7ePlvVBa5QFr1m9O4";
const TELEGRAM_CHAT_ID = "8956891290";

// Backend webhook URL - paste your Apps Script web app URL here after deployment
const BACKEND_URL = "";

// Marketplace info
const MARKETPLACES = {
    meesho: { name: "Meesho", color: "#f43397", icon: "M" },
    amazon: { name: "Amazon", color: "#ff9900", icon: "A" },
    flipkart: { name: "Flipkart", color: "#2874f0", icon: "F" }
};
