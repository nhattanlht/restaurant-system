//cho filter
document.getElementById('filter-btn').addEventListener('click', function () {
    let branch = document.getElementById('branch').value;
    let category = document.getElementById('category').value;
    let price = document.getElementById('price-max').value;

    // Tạo URL với các tham số lọc dưới dạng query string
    let queryString = `?branch=${branch}&category=${category}&price=${price}`;

    // Chuyển hướng đến trang với các tham số lọc
    window.location.href = '/filter/result' + queryString;


});

//cho nút search
document.getElementById('search-btn').addEventListener('click', function () {
    let search = document.getElementById('search-box').value;
    let branch = document.getElementById('branch').value;
    let category = document.getElementById('category').value;
    let price = document.getElementById('price-max').value;

    // Tạo URL với các tham số lọc dưới dạng query string
    let queryString = `?search=${(search)}&branch=${branch}&category=${category}&price=${price}`;

    // Chuyển hướng đến trang với các tham số lọc
    window.location.href = '/filter/result' + queryString;
})

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openPopupBtn = document.getElementById("openPopup");
    const closePopupBtn = document.getElementById("closePopup");
    const cancelPopupBtn = document.getElementById("cancelPopup");
    const areaSelect = document.getElementById("area");
    const branchSelect = document.getElementById("branch");
    const tableSelect = document.getElementById("table");

    // Hiển thị popup
    function showPopup() {
        popup.classList.add("active");
        // Lấy danh sách thành phố khi trang web tải
    }

    // Đóng popup
    function closePopup() {
        popup.classList.remove("active");
    }

    // Lấy danh sách thành phố từ API
    async function loadAreas() {
        try {
            const response = await fetch('/api/areas');  // Gọi API đúng với URL
            const areas = await response.json();
            areas.forEach(area => {
                const option = document.createElement("option");
                option.value = area.area_id;  // Giả sử area_id là ID khu vực
                option.textContent = area.area_name;  // area_name là tên khu vực
                areaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading areas:", error);
        }
    }

    // Cập nhật bàn dựa trên chi nhánh đã chọn
    async function loadBranches(areaId) {
        try {
            const response = await fetch(`/api/branches/${areaId}`);
            const branches = await response.json();
            branchSelect.innerHTML = `<option value="" disabled selected>-- Chọn chi nhánh --</option>`;
            branches.forEach(branch => {
                const option = document.createElement("option");
                option.value = branch.branch_id;
                option.textContent = branch.branch_name;
                branchSelect.appendChild(option);
            });
            tableSelect.innerHTML = `<option value="" disabled selected>-- Chọn bàn --</option>`; // Reset bảng
            for (let i = 1; i <= 20; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `Bàn ${i}`;
                tableSelect.appendChild(option);
            }
        } catch (error) {
            console.error("Error loading branches:", error);
        }
    }


    // Cập nhật chi nhánh khi chọn khu vực
    areaSelect.addEventListener("change", () => {
        const selectedAreaId = areaSelect.value;
        loadBranches(selectedAreaId);
    });

    // Gán sự kiện
    openPopupBtn.addEventListener("click", showPopup);
    closePopupBtn.addEventListener("click", closePopup);
    cancelPopupBtn.addEventListener("click", closePopup);

    loadAreas();
});

//sử lý khi người dùng đặt bàn
document.getElementById('infoForm').addEventListener('submit', function (event) {
    // Ngừng hành động mặc định của form để không tải lại trang
    event.preventDefault();

    // Lấy giá trị từ các trường trong form
    let name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let identity = document.getElementById('identity').value;
    let gender = document.querySelector('input[name="gender"]:checked').value; // Lấy giới tính đã chọn
    let area = document.getElementById('area').value;
    let branch = document.getElementById('branch').value;
    let table = document.getElementById('table').value;

    let queryString = `?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&identity=${encodeURIComponent(identity)}&gender=${encodeURIComponent(gender)}&area=${encodeURIComponent(area)}&branch=${encodeURIComponent(branch)}&table=${encodeURIComponent(table)}`;

    // Chuyển hướng đến trang với query string
    window.location.href = '/filter/submit' + queryString;  // Chuyển hướng đến /submit với query string đã tạo
});
