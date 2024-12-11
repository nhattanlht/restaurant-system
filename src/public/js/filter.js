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
        loadAreas();
    }

    // Đóng popup
    function closePopup() {
        popup.classList.remove("active");
    }

    // Lấy danh sách thành phố từ API
    async function loadAreas() {
        try {
            const response = await fetch('http://localhost:3001/api/areas');  // Gọi API đúng với URL
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
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

    // Cập nhật chi nhánh dựa trên khu vực đã chọn
    async function loadBranches(areaId) {
        try {
            const response = await fetch(`/api/branches/${areaId}`);  // Gọi API để lấy chi nhánh theo areaId
            const branches = await response.json();
            branchSelect.innerHTML = `<option value="" disabled selected>-- Chọn chi nhánh --</option>`;
            branches.forEach(branch => {
                const option = document.createElement("option");
                option.value = branch.branch_id;
                option.textContent = branch.branch_name;
                branchSelect.appendChild(option);
            });
            tableSelect.innerHTML = `<option value="" disabled selected>-- Chọn bàn --</option>`;
        } catch (error) {
            console.error("Error loading branches:", error);
        }
    }

    // Cập nhật bàn dựa trên chi nhánh đã chọn
    async function loadTables(branchId) {
        try {
            const response = await fetch(`/api/tables?branchId=${branchId}`);  // Gọi API để lấy bàn theo branchId
            const tables = await response.json();
            tableSelect.innerHTML = `<option value="" disabled selected>-- Chọn bàn --</option>`;
            tables.forEach(table => {
                const option = document.createElement("option");
                option.value = table.table_id;
                option.textContent = `Bàn ${table.table_number}`;
                tableSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading tables:", error);
        }
    }

    // Cập nhật chi nhánh khi chọn khu vực
    areaSelect.addEventListener("change", () => {
        const selectedAreaId = areaSelect.value;
        loadBranches(selectedAreaId);
    });

    // Cập nhật bàn khi chọn chi nhánh
    branchSelect.addEventListener("change", () => {
        const selectedBranchId = branchSelect.value;
        loadTables(selectedBranchId);
    });

    // Gán sự kiện
    openPopupBtn.addEventListener("click", showPopup);
    closePopupBtn.addEventListener("click", closePopup);
    cancelPopupBtn.addEventListener("click", closePopup);


});

