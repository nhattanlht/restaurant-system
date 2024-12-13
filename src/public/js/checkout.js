document.getElementById("checkout-button").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const totalAmount = parseInt(document.getElementById("total-amount").textContent.replace(/,/g, ''), 10);

    const items = [];
    document.querySelectorAll(".cart-item").forEach(item => {
        const itemId = item.querySelector(".item-id")?.textContent || "";
        const itemName = item.querySelector(".item-name")?.textContent || "";
        const itemPriceText = item.querySelector(".item-price")?.textContent.replace(/[^\d]/g, '');
        const itemPrice = parseInt(itemPriceText, 10);
        const itemQuantity = parseInt(item.querySelector(".item-quantity")?.textContent.replace('Số lượng: ', '')) || 0;

        items.push({id:itemId, name: itemName, price: itemPrice, quantity: itemQuantity });
    });

    try {
        const response = await fetch("/checkout/insert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, totalAmount, items }),
        });

        const result = await response.json(); // Nhận dữ liệu trả về từ server

        if (response.ok) {
            console.log("Thanh toán thành công");
            // Chuyển đến trang thank-you
            window.location.href = `/thank-you?order_id=${result.order_id}&name=${name}&phone=${phone}&email=${email}&totalAmount=${totalAmount}`;
        } else {
            console.log(result.message || "Có lỗi xảy ra trong quá trình thanh toán.");
        }

    } catch (err) {
        console.error("Error during checkout:", err);
        console.log("Có lỗi xảy ra trong quá trình thanh toán.");
    }
});
