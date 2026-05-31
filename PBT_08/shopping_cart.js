// ============================================================
// shopping_cart.js — Bài B2: Giỏ hàng dùng Closure
// Chạy: node shopping_cart.js
// ============================================================

function createCart() {
    // Private data — bên ngoài KHÔNG thể truy cập trực tiếp
    let items = [];
    let discountAmount = 0;

    // Helper: format tiền VND
    const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

    return {
        // Thêm sản phẩm — nếu đã có thì tăng quantity
        addItem(product, quantity = 1) {
            const existing = items.find(i => i.id === product.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                items.push({ ...product, quantity });
            }
            console.log(`✅ Đã thêm: ${product.name} x${quantity}`);
        },

        // Xóa sản phẩm theo id
        removeItem(productId) {
            const before = items.length;
            items = items.filter(i => i.id !== productId);
            if (items.length < before) {
                console.log(`🗑️  Đã xóa sản phẩm id=${productId}`);
            } else {
                console.log(`⚠️  Không tìm thấy sản phẩm id=${productId}`);
            }
        },

        // Cập nhật số lượng
        updateQuantity(productId, newQuantity) {
            const item = items.find(i => i.id === productId);
            if (!item) {
                console.log(`⚠️  Không tìm thấy sản phẩm id=${productId}`);
                return;
            }
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                console.log(`📝 Cập nhật ${item.name}: số lượng = ${newQuantity}`);
            }
        },

        // Tổng tiền TRƯỚC giảm giá
        getSubtotal() {
            return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        },

        // Tổng tiền SAU giảm giá
        getTotal() {
            return this.getSubtotal() - discountAmount;
        },

        // Áp dụng mã giảm giá
        applyDiscount(code) {
            const subtotal = this.getSubtotal();
            const codes = {
                "SALE10":   subtotal * 0.1,
                "SALE20":   subtotal * 0.2,
                "FREESHIP": 30000
            };
            if (codes[code] !== undefined) {
                discountAmount = Math.round(codes[code]);
                console.log(`🎉 Áp dụng mã "${code}" — giảm ${fmt(discountAmount)}`);
            } else {
                console.log(`❌ Mã "${code}" không hợp lệ`);
            }
        },

        // In giỏ hàng dạng bảng
        printCart() {
            if (items.length === 0) {
                console.log("🛒 Giỏ hàng trống!");
                return;
            }

            const W = 60;
            const line  = "─".repeat(W);
            const dline = "═".repeat(W);

            console.log("┌" + dline + "┐");
            console.log("│" + "           🛒 GIỎ HÀNG".padEnd(W) + "│");
            console.log("├" + dline + "┤");
            console.log("│" + " #  Sản phẩm            SL  Đơn giá        Tổng    │".padEnd(W) + "│");
            console.log("├" + line + "┤");

            items.forEach((item, idx) => {
                const rowTotal = item.price * item.quantity;
                const num    = String(idx + 1).padEnd(2);
                const name   = item.name.padEnd(18).slice(0, 18);
                const qty    = String(item.quantity).padStart(3);
                const unit   = item.price.toLocaleString("vi-VN").padStart(11);
                const total  = rowTotal.toLocaleString("vi-VN").padStart(12);
                console.log(`│ ${num}  ${name}  ${qty}  ${unit}  ${total} │`);
            });

            console.log("├" + line + "┤");

            const subtotal = this.getSubtotal();
            console.log("│" + `  Tổng cộng:${subtotal.toLocaleString("vi-VN").padStart(W - 14)}đ` + "│");

            if (discountAmount > 0) {
                console.log("│" + `  Giảm giá: -${discountAmount.toLocaleString("vi-VN").padStart(W - 15)}đ` + "│");
            }

            console.log("├" + dline + "┤");
            const total = this.getTotal();
            console.log("│" + `  THANH TOÁN:${total.toLocaleString("vi-VN").padStart(W - 14)}đ` + "│");
            console.log("└" + dline + "┘");
            console.log();
        },

        // Tổng số lượng sản phẩm
        getItemCount() {
            return items.reduce((sum, i) => sum + i.quantity, 0);
        },

        // Xóa toàn bộ giỏ
        clearCart() {
            items = [];
            discountAmount = 0;
            console.log("🧹 Đã xóa toàn bộ giỏ hàng");
        }
    };
}

// ============================================================
// TEST
// ============================================================
const cart = createCart();

console.log("===== THÊM SẢN PHẨM =====");
cart.addItem({ id: 1, name: "iPhone 16",  price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16",  price: 25990000 }, 1); // Tăng lên 2

console.log("\n===== GIỎ HÀNG BAN ĐẦU =====");
cart.printCart();

console.log("===== ÁP MÃ SALE10 =====");
cart.applyDiscount("SALE10");
cart.printCart();

console.log("===== ÁP MÃ SAI =====");
cart.applyDiscount("HELLO");

console.log("\n===== SỐ LƯỢNG SẢN PHẨM =====");
console.log("Số SP trong giỏ:", cart.getItemCount());

console.log("\n===== XÓA AIRPODS (id=3) =====");
cart.removeItem(3);
console.log("Sau khi xóa:", cart.getItemCount(), "sản phẩm");
cart.printCart();

console.log("===== CẬP NHẬT SỐ LƯỢNG IPHONE → 3 =====");
cart.updateQuantity(1, 3);
cart.printCart();

console.log("===== THÊM MACBOOK =====");
cart.addItem({ id: 2, name: "MacBook Pro", price: 45990000 }, 1);
cart.applyDiscount("SALE20");
cart.printCart();
