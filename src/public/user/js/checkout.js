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

        items.push({ id: itemId, name: itemName, price: itemPrice, quantity: itemQuantity });
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


document.getElementById('apply-discount').addEventListener('click', async () => {
    const code = document.getElementById('discount-code').value;

    // Get shipping fee value (raw number) from hidden input
    const shippingFeeInput = document.getElementById('shipping-fee');
    const shippingFee = parseInt(shippingFeeInput.value, 10);

    // Parse initial amount (raw number)
    const initialAmount = parseInt(
        document.getElementById('initial-amount').textContent.replace(/,/g, ''),
        10
    );

    // Fetch discount data
    const response = await fetch('/apply-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, shippingFee, initialAmount }),
    });

    const data = await response.json();
    const discountMessage = document.getElementById('discount-message');
    const discountValue = document.getElementById('discount-value');
    const totalAmount = document.getElementById('total-amount');
    const formattedShippingFee = document.getElementById('formatted-shipping-fee');

    if (response.ok) {
        discountMessage.textContent = 'Mã giảm giá hợp lệ!';
        discountValue.textContent = data.discountValue.toLocaleString(); // Format discount value
        totalAmount.textContent = `${data.totalAmount.toLocaleString()}`; // Format total amount
    } else {
        discountMessage.textContent = data.message || 'Mã giảm giá không hợp lệ!';
    }

    // Update initial amount and formatted shipping fee display
    document.getElementById('initial-amount').textContent = initialAmount.toLocaleString();
    formattedShippingFee.textContent = shippingFee.toLocaleString(); // Display formatted shipping fee
});

// Function to format numbers with commas
function formatNumber(value) {
    return value.toLocaleString();
}

// On page load, format initial amount and total amount
window.addEventListener('DOMContentLoaded', () => {
    const initialAmountElement = document.getElementById('initial-amount');
    const totalAmountElement = document.getElementById('total-amount');
    const shippingFeeInput = document.getElementById('shipping-fee');
    const formattedShippingFee = document.getElementById('formatted-shipping-fee');

    // Parse raw numeric values
    const initialAmount = parseInt(initialAmountElement.textContent.replace(/,/g, ''), 10);
    const shippingFee = parseInt(shippingFeeInput.value, 10);
    const totalAmount = initialAmount + shippingFee;

    // Update elements with formatted values
    initialAmountElement.textContent = formatNumber(initialAmount);
    formattedShippingFee.textContent = formatNumber(shippingFee);
    totalAmountElement.textContent = formatNumber(totalAmount);
});
