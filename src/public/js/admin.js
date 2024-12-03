// Hàm để chuyển hướng và hiển thị phần tử tương ứng khi nút được nhấn
function showSection(section) {
    // Ẩn tất cả các section
    const sections = ['branches', 'employees', 'reports'];
    sections.forEach(sec => {
        document.getElementById(sec).classList.add('hidden'); // Ẩn phần tử
    });

    // Hiển thị section tương ứng
    document.getElementById(section).classList.remove('hidden'); // Hiển thị phần tử

    // Cập nhật trạng thái của các nút
    const buttons = ['btnBranches', 'btnEmployees', 'btnReports'];
    buttons.forEach(btn => {
        document.getElementById(btn).classList.remove('active'); // Xóa lớp active
    });

    // Thêm lớp active vào nút tương ứng
    document.getElementById(`btn${capitalizeFirstLetter(section)}`).classList.add('active');
}

// Hàm phụ để viết hoa chữ cái đầu tiên của tên section
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Thiết lập mặc định là hiển thị phần "Branch Management"
document.addEventListener('DOMContentLoaded', () => {
    showSection('branches');
});
