// ============================================================
// product_manager.js — Bài B1: Quản lý sản phẩm E-Commerce
// Chạy: node product_manager.js
// ============================================================

const products = [
    { id: 1,  name: "iPhone 16",   price: 25990000, category: "phone",     stock: 15, rating: 4.5 },
    { id: 2,  name: "MacBook Pro",  price: 45990000, category: "laptop",    stock: 8,  rating: 4.8 },
    { id: 3,  name: "AirPods Pro",  price: 6990000,  category: "accessory", stock: 50, rating: 4.3 },
    { id: 4,  name: "iPad Air",     price: 16990000, category: "tablet",    stock: 0,  rating: 4.6 },
    { id: 5,  name: "Samsung S24",  price: 22990000, category: "phone",     stock: 20, rating: 4.4 },
    { id: 6,  name: "Dell XPS 15",  price: 35990000, category: "laptop",    stock: 5,  rating: 4.7 },
    { id: 7,  name: "Galaxy Buds",  price: 3490000,  category: "accessory", stock: 100,rating: 4.1 },
    { id: 8,  name: "Xiaomi Pad 6", price: 7990000,  category: "tablet",    stock: 25, rating: 4.2 },
    { id: 9,  name: "Pixel 9",      price: 19990000, category: "phone",     stock: 12, rating: 4.6 },
    { id: 10, name: "ThinkPad X1",  price: 32990000, category: "laptop",    stock: 3,  rating: 4.5 },
];

// ============================================================
// 1. Lọc sản phẩm còn hàng (stock > 0)
// ============================================================
function getInStock(products) {
    return products.filter(p => p.stock > 0);
}

// ============================================================
// 2. Lọc theo category VÀ khoảng giá
// ============================================================
function filterProducts(products, category, minPrice, maxPrice) {
    return products.filter(p =>
        p.category === category &&
        p.price >= minPrice &&
        p.price <= maxPrice
    );
}

// ============================================================
// 3. Sắp xếp theo giá (tăng/giảm) — không mutate gốc
// ============================================================
function sortByPrice(products, order = "asc") {
    return [...products].sort((a, b) =>
        order === "asc" ? a.price - b.price : b.price - a.price
    );
}

// ============================================================
// 4. Tìm sản phẩm rẻ nhất mỗi category
// ============================================================
function cheapestByCategory(products) {
    return products.reduce((acc, p) => {
        // Nếu category chưa có, hoặc sản phẩm hiện tại rẻ hơn → cập nhật
        if (!acc[p.category] || p.price < acc[p.category].price) {
            acc[p.category] = p;
        }
        return acc;
    }, {});
}

// ============================================================
// 5. Tổng giá trị kho (price × stock)
// ============================================================
function totalInventoryValue(products) {
    return products.reduce((sum, p) => sum + p.price * p.stock, 0);
}

// ============================================================
// 6. Tạo mảng { name, formattedPrice }
// ============================================================
function formatProductList(products) {
    return products.map(p => ({
        name: p.name,
        formattedPrice: p.price.toLocaleString("vi-VN") + "đ"
    }));
}

// ============================================================
// 7. Rating trung bình toàn bộ
// ============================================================
function averageRating(products) {
    const total = products.reduce((sum, p) => sum + p.rating, 0);
    return (total / products.length).toFixed(2);
}

// ============================================================
// 8. Tìm sản phẩm theo keyword (case-insensitive)
// ============================================================
function searchProducts(products, keyword) {
    const kw = keyword.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(kw));
}

// ============================================================
// TEST
// ============================================================
console.log("=== 1. SẢN PHẨM CÒN HÀNG ===");
getInStock(products).forEach(p =>
    console.log(`  ${p.name} (còn ${p.stock})`)
);

console.log("\n=== 2. ĐIỆN THOẠI 15-25 TRIỆU ===");
filterProducts(products, "phone", 15000000, 25000000).forEach(p =>
    console.log(`  ${p.name} — ${p.price.toLocaleString()}đ`)
);

console.log("\n=== 3. SẮP XẾP GIÁ TĂNG DẦN ===");
sortByPrice(products, "asc").forEach(p =>
    console.log(`  ${p.name.padEnd(14)} ${p.price.toLocaleString()}đ`)
);

console.log("\n=== 4. RẺ NHẤT THEO CATEGORY ===");
const cheapest = cheapestByCategory(products);
for (const [cat, p] of Object.entries(cheapest)) {
    console.log(`  ${cat.padEnd(12)}: ${p.name} — ${p.price.toLocaleString()}đ`);
}

console.log("\n=== 5. TỔNG GIÁ TRỊ KHO ===");
console.log("  " + totalInventoryValue(products).toLocaleString("vi-VN") + "đ");

console.log("\n=== 6. DANH SÁCH CÓ ĐỊNH DẠNG GIÁ ===");
formatProductList(products).forEach(p =>
    console.log(`  ${p.name.padEnd(14)} ${p.formattedPrice}`)
);

console.log("\n=== 7. RATING TRUNG BÌNH ===");
console.log("  " + averageRating(products));

console.log("\n=== 8. TÌM KIẾM 'pad' ===");
searchProducts(products, "pad").forEach(p =>
    console.log(`  ${p.name}`)
);
