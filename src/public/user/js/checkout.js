document.addEventListener("DOMContentLoaded", () => {
    const paymentMethodElement = document.getElementById('payment-method');

    // Lắng nghe sự kiện click của checkout button
    document.getElementById("checkout-button").addEventListener("click", async () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const totalAmount = parseInt(document.getElementById("total-amount").textContent.replace(/,/g, ''), 10);

        // Lấy thông tin các sản phẩm trong giỏ hàng
        const items = [];
        document.querySelectorAll(".cart-item").forEach(item => {
            const itemId = item.querySelector(".item-id")?.textContent || "";
            const itemName = item.querySelector(".item-name")?.textContent || "";
            const itemPriceText = item.querySelector(".item-price")?.textContent.replace(/[^\d]/g, '');
            const itemPrice = parseInt(itemPriceText, 10);
            const itemQuantity = parseInt(item.querySelector(".item-quantity")?.textContent.replace('Số lượng: ', '')) || 0;

            items.push({ id: itemId, name: itemName, price: itemPrice, quantity: itemQuantity });
        });

        // Kiểm tra xem thông tin có đầy đủ không
        if (!name || !phone || !email || items.length === 0) {
            alert("Vui lòng điền đầy đủ thông tin và có ít nhất một sản phẩm trong giỏ hàng.");
            return;
        }

        try {
            const response = await fetch("/checkout/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, email, totalAmount, items }),
            });

            const result = await response.json();
            const order_id = result.order_id
            if (response.ok) {
                console.log("Thanh toán thành công");
                    // xử lí check zalo
                // Kiểm tra phương thức thanh toán và xử lý
                const paymentResponse = await fetch("/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({order_id, name, phone, email, totalAmount }),
                });

                const paymentResult = await paymentResponse.json();
                if (paymentResponse.ok) {
                    console.log("Tạo giao dịch thanh toán thành công, chuyển hướng đến ZaloPay.");
                    window.location.href = paymentResult.order_url;
                } else {
                    window.location.href = `/thank-you?order_id=${result.order_id}&name=${name}&phone=${phone}&email=${email}&totalAmount=${totalAmount}`;
                }
                // window.location.href = `/thank-you?order_id=${result.order_id}&name=${name}&phone=${phone}&email=${email}&totalAmount=${totalAmount}`;
            } else {
                console.log(result.message || "Có lỗi xảy ra trong quá trình thanh toán.");
            }
        } catch (err) {
            console.error("Error during checkout:", err);
            console.log("Có lỗi xảy ra trong quá trình thanh toán.");
        }
    });


    // Áp dụng mã giảm giá
    document.getElementById('apply-discount').addEventListener('click', async () => {
        const code = document.getElementById('discount-code').value;

        const shippingFeeInput = document.getElementById('shipping-fee');
        const shippingFee = parseInt(shippingFeeInput.value, 10);

        const initialAmount = parseInt(document.getElementById('initial-amount').textContent.replace(/,/g, ''), 10);

        // Gửi yêu cầu đến server để áp dụng mã giảm giá
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
            discountValue.textContent = data.discountValue.toLocaleString();
            totalAmount.textContent = `${data.totalAmount.toLocaleString()}`;
        } else {
            discountMessage.textContent = data.message || 'Mã giảm giá không hợp lệ!';
        }

        document.getElementById('initial-amount').textContent = initialAmount.toLocaleString();
        formattedShippingFee.textContent = shippingFee.toLocaleString();
    });

    // Định dạng số với dấu phẩy
    function formatNumber(value) {
        return value.toLocaleString();
    }

    // Khi trang tải, format lại số tiền ban đầu và tổng cộng
    window.addEventListener('DOMContentLoaded', () => {
        const initialAmountElement = document.getElementById('initial-amount');
        const totalAmountElement = document.getElementById('total-amount');
        const shippingFeeInput = document.getElementById('shipping-fee');
        const formattedShippingFee = document.getElementById('formatted-shipping-fee');

        const initialAmount = parseInt(initialAmountElement.textContent.replace(/,/g, ''), 10);
        const shippingFee = parseInt(shippingFeeInput.value, 10);
        const totalAmount = initialAmount + shippingFee;

        initialAmountElement.textContent = formatNumber(initialAmount);
        formattedShippingFee.textContent = formatNumber(shippingFee);
        totalAmountElement.textContent = formatNumber(totalAmount);
    });
});
