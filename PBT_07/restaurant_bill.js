// ============================================================
// restaurant_bill.js — Câu C2: Tính hóa đơn nhà hàng
// Chạy: node restaurant_bill.js
// ============================================================

// ============================================================
// Hàm tính và in hóa đơn
// Tham số:
//   items   = [{ name, price, qty }]
//   withTip = true/false (có tính tip không)
// ============================================================
function printBill(items, withTip = false) {
    const WIDTH = 42;

    function line(content) {
        return `║ ${content.padEnd(WIDTH - 4)} ║`;
    }

    function separator() {
        return `╠${"═".repeat(WIDTH - 2)}╣`;
    }

    // Tính tổng cộng
    let subtotal = 0;
    for (const item of items) {
        subtotal += item.price * item.qty;
    }

    // Xác định % giảm giá theo tổng
    let discountRate = 0;
    if (subtotal > 1_000_000) discountRate = 15;
    else if (subtotal > 500_000) discountRate = 10;

    // Thứ 3 giảm thêm 5%
    const today = new Date();
    const isWednesday = today.getDay() === 3;
    if (isWednesday) discountRate += 5;

    const discountAmount = Math.round(subtotal * discountRate / 100);
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = Math.round(afterDiscount * 0.08);
    const tipAmount = withTip ? Math.round(afterDiscount * 0.05) : 0;
    const total = afterDiscount + vatAmount + tipAmount;

    function formatMoney(n) {
        return n.toLocaleString("vi-VN") + "đ";
    }

    // In hóa đơn
    const top    = `╔${"═".repeat(WIDTH - 2)}╗`;
    const bottom = `╚${"═".repeat(WIDTH - 2)}╝`;

    const lines = [top];
    lines.push(line("       HÓA ĐƠN NHÀ HÀNG"));
    lines.push(separator());

    // Danh sách món
    items.forEach((item, i) => {
        const rowSubtotal = item.price * item.qty;
        const itemLine = `${i + 1}. ${item.name.padEnd(12)} x${item.qty}  @${formatMoney(item.price).padStart(8)}`;
        const priceStr = `= ${formatMoney(rowSubtotal)}`;
        const content = `${itemLine.padEnd(WIDTH - 8 - priceStr.length)}${priceStr}`;
        lines.push(line(content));
    });

    lines.push(separator());

    // Các dòng tổng
    const rows = [
        ["Tổng cộng:", formatMoney(subtotal)],
        [`Giảm giá (${discountRate}%):`, discountRate > 0 ? `-${formatMoney(discountAmount)}` : "0đ"],
        ["VAT (8%):", `+${formatMoney(vatAmount)}`],
    ];
    if (withTip) rows.push(["Tip (5%):", `+${formatMoney(tipAmount)}`]);

    for (const [label, val] of rows) {
        const content = `${label.padEnd(WIDTH - 4 - val.length - 2)}${val}`;
        lines.push(line(content));
    }

    lines.push(separator());
    const totalStr = formatMoney(total);
    const totalLine = `THANH TOÁN:${" ".repeat(WIDTH - 16 - totalStr.length)}${totalStr}`;
    lines.push(line(totalLine));
    lines.push(bottom);

    if (isWednesday) {
        console.log("🎉 Hôm nay thứ 4 — giảm thêm 5%!\n");
    }

    console.log(lines.join("\n"));
}

// ============================================================
// Test
// ============================================================
console.log("===== VÍ DỤ 1: Hóa đơn nhỏ (không giảm giá) =====\n");
printBill([
    { name: "Phở bò",  price: 65_000, qty: 2 },
    { name: "Trà đá",  price:  5_000, qty: 3 },
    { name: "Bún chả", price: 55_000, qty: 1 },
], false);

console.log("\n===== VÍ DỤ 2: Hóa đơn > 500k (giảm 10%) + có tip =====\n");
printBill([
    { name: "Bít tết",    price: 250_000, qty: 2 },
    { name: "Pasta",      price: 180_000, qty: 1 },
    { name: "Nước ép",    price:  45_000, qty: 3 },
], true);

console.log("\n===== VÍ DỤ 3: Hóa đơn > 1 triệu (giảm 15%) =====\n");
printBill([
    { name: "Hải sản",   price: 450_000, qty: 2 },
    { name: "Rượu vang", price: 350_000, qty: 1 },
    { name: "Tráng miệng", price: 85_000, qty: 2 },
], false);
