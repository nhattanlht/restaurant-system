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
    console.log("Giỏ hàng hiện tại:", cart); // In giỏ hàng ra console để kiểm tra
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartQuantity(); // Cập nhật số lượng hiển thị
    renderCartItems(cart); // Hiển thị lại giỏ hàng
};

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


document.querySelector('.shopping-cart-button').addEventListener('click', function (event) {
    event.preventDefault(); // Ngăn việc reload trang mặc định
    window.location.href = '/cart'; // Điều hướng đến trang giỏ hàng
});
// Khởi động: Cập nhật số lượng giỏ hàng khi trang được tải
updateCartQuantity();
// Gọi loadCart khi trang được tải để giữ lại giỏ hàng
loadCart();

window.addEventListener('beforeunload', () => {
    // Xóa giỏ hàng trong localStorage khi người dùng refresh hoặc đóng trang
    localStorage.removeItem('cart');
});