// Dữ liệu tỉnh/thành và quận/huyện
const locations = {
    TPHCM: [" Bình Thạnh ", "Gò Vấp", "Quận 10","Quận 1", "Tân Bình"],
    LongAn: ["TP Tân An", "Đức Hòa", "Đức Huệ"],
    ĐồngNai:["Biên Hòa","Long Khánh", "Xuân Lộc"]

};
const deliveryOption = document.getElementById('delivery');
const pickupOption = document.getElementById('pickup');
const deliveryDetails = document.getElementById('delivery-details');

// Lắng nghe sự kiện thay đổi phương thức giao hàng
deliveryOption.addEventListener('change', function() {
    // Nếu chọn "Giao tận nơi", hiển thị các trường địa chỉ
    if (this.checked) {
        deliveryDetails.style.display = 'block';
    }
});

// Lắng nghe sự kiện thay đổi phương thức nhận hàng
pickupOption.addEventListener('change', function() {
    // Nếu chọn "Nhận tại cửa hàng", ẩn các trường địa chỉ
    if (this.checked) {
        deliveryDetails.style.display = 'none';
    }
});

// Lấy các phần tử dropdown
const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");

// Xử lý khi người dùng thay đổi tỉnh/thành
provinceSelect.addEventListener("change", function () {
    const selectedProvince = provinceSelect.value;

    // Xóa các tùy chọn quận/huyện cũ
    districtSelect.innerHTML = '<option value="">Chọn quận / huyện</option>';

    // Nếu tỉnh/thành được chọn, hiển thị danh sách quận/huyện tương ứng
    if (selectedProvince && locations[selectedProvince]) {
        locations[selectedProvince].forEach(district => {
            const option = document.createElement("option");
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
});
