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

    //cho datetime theo thời điểm
    const datetimeInput = document.getElementById('datetime');
            const now = new Date().toISOString().slice(0, 16); // Lấy thời gian hiện tại định dạng yyyy-MM-ddTHH:mm
            datetimeInput.min = now;

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

    async function loadAllBranches() {
        try {
            // Gọi API để lấy danh sách tất cả các chi nhánh
            const response = await fetch('/api/branches'); // Đảm bảo URL API chính xác
            const branches = await response.json();
            
            // Truy cập vào phần tử <select> có id="branch"
            const branchSelect = document.getElementById('branchsearch');
            
            // Xóa các tùy chọn hiện tại (nếu có)
            branchSelect.innerHTML = `<option value="all" selected>All</option>`;
    
            // Thêm các tùy chọn mới từ API
            branches.forEach(branch => {
                const option = document.createElement("option");
                option.value = branch.branch_id; // Giá trị là branch_id
                option.textContent = branch.branch_name; // Hiển thị tên chi nhánh
                branchSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading branches:", error);
        }
    }

    async function loadAllCategories() {
        try {
            // Gọi API để lấy danh sách tất cả các chi nhánh
            const response = await fetch('/api/categories'); // Đảm bảo URL API chính xác
            const categories = await response.json();
            
            // Truy cập vào phần tử <select> có id="branch"
            const categorySelect = document.getElementById('category');
            
            // Xóa các tùy chọn hiện tại (nếu có)
            categorySelect.innerHTML = `<option value="all" selected>All</option>`;
    
            // Thêm các tùy chọn mới từ API
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.category_id; // Giá trị là category_id
                option.textContent = category.category_name; // Hiển thị tên chi nhánh
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading categories:", error);
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
    
    //branch cho nút search
    loadAllBranches();
    //Phân loại món ăn
    loadAllCategories();
    //Areas cho đặt bàn
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
    let arrival_time = document.getElementById('datetime').value;

    let queryString = `?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&identity=${encodeURIComponent(identity)}&gender=${encodeURIComponent(gender)}&area=${encodeURIComponent(area)}&branch=${encodeURIComponent(branch)}&table=${encodeURIComponent(table)}&arrival_time=${encodeURIComponent(arrival_time)}`;

    // Chuyển hướng đến trang với query string
    window.location.href = '/filter/submit' + queryString;  // Chuyển hướng đến /submit với query string đã tạo
});
