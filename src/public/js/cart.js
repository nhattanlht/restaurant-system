//Mang gio hang lấy từ localStorage nếu có
let cart=[];

// Hàm cập nhật số lượng giỏ hàng
const updateCartQuantity = () => {
    const quantity = cart.length; // Tổng số món trong giỏ hàng
    const quantityElement = document.querySelector('.count-holder'); // Phần tử hiển thị số lượng
    if (quantityElement) {
        quantityElement.textContent = quantity; // Cập nhật số lượng
    }
};

// Tải giỏ hàng từ localStorage khi trang tải
const loadCart = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartQuantity();
    }
};
// Hàm hiển thị thông báo toast
function showToast(message){
    const toast=document.getElementById('toast');
    toast.textContent=message;
    toast.classList.add('show');
    // Sau 3 giây, tự động ẩn thông báo
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};


document.querySelectorAll('.add-to-cart').forEach(button=>{
   button.addEventListener('click',async function(){
         // Lấy thông tin món ăn từ các thuộc tính data
        const food={
            id:this.dataset.id,
            name:this.dataset.name,
            price:parseFloat(this.dataset.price),
        };


         // Kiểm tra nếu món ăn đã có trong giỏ hàng
         const existingItem=cart.find(item=> item.id.toString()===food.id);// So sánh ID
         if(existingItem){
            showToast(`"${food.name}" đã có trong giỏ hàng.`);

         }else{
            cart.push({...food,quantity:1}); //Thêm món mới và với số lượng là 1

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


// window.addEventListener('beforeunload', () => {
//     // Xóa giỏ hàng trong localStorage khi người dùng refresh hoặc đóng trang
//     localStorage.removeItem('cart');
// });
//updateCartQuantity();



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
//Hiển thị đúng số lượng khi reload lại trang
loadCart();

