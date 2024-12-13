// Dữ liệu tỉnh/thành và quận/huyện
const locations = {
    TPHCM: ["Quận 5", "Quận 7", "Quận 10","Quận 1"],
    LongAn: ["TP Tân An", "Đức Hòa"],

};

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
