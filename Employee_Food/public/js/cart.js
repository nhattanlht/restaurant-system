// Mảng giỏ hàng
let cart = [];

// Hàm cập nhật số lượng giỏ hàng
const updateCartQuantity = () => {
    const quantity = cart.length; // Tổng số món trong giỏ hàng
    const quantityElement = document.querySelector('.count-holder'); // Phần tử hiển thị số lượng
    if (quantityElement) {
        quantityElement.textContent = quantity; // Cập nhật số lượng
    }
};

// Hàm hiển thị thông báo toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    // Sau 3 giây, tự động ẩn thông báo
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // Thời gian hiển thị là 3 giây
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async function () {
        // Lấy thông tin món ăn từ các thuộc tính data
        const food = {
            id: this.dataset.id, // Đảm bảo data-id tồn tại
            name: this.dataset.name,
            price: parseFloat(this.dataset.price), // Chuyển đổi giá trị thành số
            image: this.dataset.image
        };

        // Kiểm tra nếu món ăn đã có trong giỏ hàng
        const existingItem = cart.find(item => item.id.toString() === food.id); // So sánh ID
        if (existingItem) {
            showToast(`"${food.name}" đã có trong giỏ hàng.`);
        } else {
            // Thêm món ăn vào giỏ hàng
            cart.push(food);
            showToast(`"${food.name}" đã được thêm vào giỏ hàng.`);
        }
        
        updateCartQuantity();
    });
});

// Khởi động: Cập nhật số lượng giỏ hàng khi trang được tải
updateCartQuantity();