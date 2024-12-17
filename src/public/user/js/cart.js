// Mảng giỏ hàng
let cart = [];

// Hàm cập nhật số lượng giỏ hàng
const updateCartQuantity = () => {
    const quantity = cart.length;
    const quantityElement = document.querySelector('.count-holder'); // Phần tử hiển thị số lượng
    if (quantityElement) {
        quantityElement.textContent = quantity; // Cập nhật số lượng
    }
    renderCartItems(cart);
};

// Tải giỏ hàng từ localStorage khi trang tải
const loadCart = () => {
    const storedCart = localStorage.getItem('cart');
    console.log("Giỏ hàng từ localStorage:", storedCart); // In giá trị giỏ hàng từ localStorage
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartQuantity();
        renderCartItems(cart);
    }
};

// Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartQuantity(); // Cập nhật số lượng hiển thị
    renderCartItems(cart); // Hiển thị lại giỏ hàng
};


// Hàm gửi giỏ hàng lên server (trong ví dụ này là POST)
const sendCartToServer = async () => {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const response = await fetch('/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cart }),  // Gửi giỏ hàng lên server
    });

    if (response.ok) {
        console.log("Giỏ hàng đã được gửi lên server thành công.");
    } else {
        console.error("Gửi giỏ hàng lên server thất bại.");
    }
};

// Hàm hiển thị thông báo toast
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.error("Không tìm thấy phần tử với id 'toast'");
        return;
    }
    toast.textContent = message;
    toast.classList.add('show');

    // Sau 3 giây, tự động ẩn thông báo
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // Thời gian hiển thị là 3 giây
}

// Hàm hiển thị danh sách món trong giỏ hàng
function renderCartItems(cart) {
    const cartContainer = document.querySelector(".showcart-item-container");
    const quantityElement = document.querySelector(".count-holder");

    // Kiểm tra nếu không có container
    if (!cartContainer) {
        console.error("Không tìm thấy phần tử .showcart-item-container");
        return;
    }

    // Xóa nội dung cũ
    cartContainer.innerHTML = "";

    // Kiểm tra giá trị trong .count-holder
    const quantity = parseInt(quantityElement?.textContent || "0", 10);

    // Nếu không có sản phẩm, hiển thị "Giỏ hàng trống"
    if (quantity === 0) {
        cartContainer.innerHTML = "<p class='empty-cart-message'>Giỏ hàng trống.</p>";
        return;
    }

    // Duyệt qua từng mục trong giỏ hàng và tạo phần tử HTML
    cart.forEach(item => {
        const cartItemHTML = `
            <div class="showcart-item">
                <div class="showcart-left">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="showcart-right">
                    <h5>${item.name}</h5>
                    <span>${item.price.toLocaleString()}đ</span> <br>
                    <span>Số lượng: ${item.quantity}</span>
                </div>
            </div>
        `;
        cartContainer.innerHTML += cartItemHTML;
    });

    // Tính tổng tiền
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalContainer = document.querySelector(".showcart-total span");
    if (totalContainer) {
        totalContainer.textContent = `${total.toLocaleString()} VNĐ`;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Xử lý sự kiện thêm món vào giỏ hàng
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            // Lấy thông tin món ăn từ các thuộc tính data
            const food = {
                id: this.dataset.id, // Đảm bảo data-id tồn tại
                name: this.dataset.name,
                price: parseFloat(this.dataset.price), // Chuyển đổi giá trị thành số
                image: this.dataset.image,
                quantity: 1 // Khởi tạo số lượng mặc định là 1
            };

            // Kiểm tra nếu món ăn đã có trong giỏ hàng
            const existingItem = cart.find(item => item.id.toString() === food.id); // So sánh ID
            if (existingItem) {
                existingItem.quantity += 1; // Tăng số lượng nếu đã có trong giỏ hàng
                showToast(`Tăng số lượng "${food.name}" trong giỏ hàng.`);
            } else {
                // Thêm món ăn vào giỏ hàng
                cart.push(food);
                showToast(`"${food.name}" đã được thêm vào giỏ hàng.`);
            }
            // Cập nhật giỏ hàng vào localStorage
            saveCart();
            // Cập nhật số lượng trên giao diện
            updateCartQuantity();
            //Gửi đến server
            sendCartToServer();
        });
    });

    // Xử lý sự kiện mở/đóng giỏ hàng
    const toggleCart = () => {
        const cart = document.getElementById("showcart");
        if (!cart) {
            console.error("Không tìm thấy phần tử với id 'showcart'");
            return;
        }

        if (cart.style.display === "none" || cart.style.display === "") {
            cart.style.display = "block"; // Hiển thị
        } else {
            cart.style.display = "none"; // Ẩn
        }
    };

   document.querySelector(".shopping-bag-button").onclick = toggleCart;
});

// Khởi động: Cập nhật số lượng giỏ hàng khi trang được tải
updateCartQuantity();
// Gọi loadCart khi trang được tải để giữ lại giỏ hàng
loadCart();


//reload giỏ hàng không bị mất
if(window.location.href==="/cart"){
    sendCartToServer();
}
// Gắn sự kiện click cho nút "Xóa" trong giỏ hàng
document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function () {
        const itemId = this.dataset.id.trim(); // Loại bỏ khoảng trắng thừa 
        const itemName = this.dataset.name;
        removeItemFromCart(itemId,itemName);  // Gọi hàm xóa món ăn khỏi giỏ hàng
    });
});

// Hàm xóa món ăn khỏi giỏ hàng
const removeItemFromCart = async (itemId,itemName) => {
    try {
        console.log("Gửi yêu cầu xóa món ăn với ID:", itemId);  // Log ID của món ăn đang xóa
        const response = await fetch('/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId }), // Gửi ID món ăn cần xóa
        });

        const result = await response.json();
        console.log("Kết quả trả về từ server:", result);  // Log kết quả trả về từ server

        if (response.ok) {

            localStorage.setItem('cart', JSON.stringify(result.cart));     // Tải lại giỏ hàng từ localStorage và cập nhật giao diện

       
            loadCart();  // Hàm này sẽ tự động cập nhật số lượng giỏ hàng và hiển thị lại các món ăn
            // Hiển thị thông báo
            showToast(`Món "${itemName}"  đã được xóa khỏi giỏ hàng`,'success');

            setTimeout(() => {
                window.location.reload();  // Reload trang giỏ hàng
            }, 1000);
          
         // Chờ 1 giây để toast được hiển thị trước khi reload trang
        } else {
            showToast('Lỗi khi xóa món ăn. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Lỗi khi xóa món ăn:', error);
        showToast('Lỗi khi xóa món ăn. Vui lòng thử lại.');
    }
};
// Gắn sự kiện bấm nút "Cập nhật giỏ hàng"
document.getElementById('update-cart-button').addEventListener('click', async () => {
    // Lấy tất cả các mục trong giỏ hàng
    const cartItems = document.querySelectorAll('.cart-item');
    const updatedCart = [];

    // Duyệt qua từng món ăn trong giỏ hàng và lấy ID và số lượng mới
    cartItems.forEach(item => {
        const itemId = item.querySelector('.cart-item-quantity').dataset.id;
        const quantity = parseInt(item.querySelector('.cart-item-quantity').value);

        // Kiểm tra số lượng hợp lệ
        if (isNaN(quantity) || quantity < 1) {
            return; // Bỏ qua món ăn này nếu số lượng không hợp lệ
        }

        updatedCart.push({ itemId, quantity });
    });

    try {
        // Gửi yêu cầu cập nhật giỏ hàng lên server
        const response = await fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart: updatedCart }) // Gửi thông tin giỏ hàng mới
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Phản hồi từ server: ', result);

            // Lưu lại giỏ hàng mới vào localStorage
            localStorage.setItem('cart', JSON.stringify(result.cart));
            
            //Chỉnh lại số lượng giỏ hàng
            loadCart();
            // Hiển thị thông báo thành công
            showToast('Giỏ hàng đã được cập nhật thành công.', 'success');

            // Reload lại trang sau khi cập nhật giỏ hàng
            setTimeout(() => {
                window.location.reload(); // Reload trang sau 1 giây để hiển thị các thay đổi
            }, 1000);

        } else {
            showToast('Có lỗi khi cập nhật giỏ hàng.');
        }
    } catch (error) {
        console.error('Có lỗi khi cập nhật giỏ hàng:', error);
        showToast('Có lỗi khi cập nhật giỏ hàng.');
    }
});
