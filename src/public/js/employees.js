document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const customerManagementLink = document.getElementById('customerManagementLink');
    const branchRevenueLink = document.getElementById('branchRevenueLink');
    const customerManagementSection = document.getElementById('customer-management');
    const branchRevenueSection = document.getElementById('branch-revenue');

    // Hide all sections and show the specific one
    const showSection = (section) => {
        customerManagementSection.style.display = 'none';
        branchRevenueSection.style.display = 'none';
        section.style.display = 'block';
    };

    // Add event listeners
    customerManagementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(customerManagementSection);
    });

    branchRevenueLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(branchRevenueSection);
    });

    // Optionally, set the default section to show
    showSection(customerManagementSection); // Default: Branch Revenue
});


document.querySelectorAll('.edit-save-btn').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const isEditing = this.textContent === 'Edit';

        // Toggle editable state
        row.querySelectorAll('[contenteditable]').forEach(cell => {
            cell.contentEditable = isEditing;
            cell.style.backgroundColor = isEditing ? '#f9f9f9' : '';
        });

        if (!isEditing) {
            // Save changes
            const customerId = row.dataset.customerId;
            const updatedData = {};

            row.querySelectorAll('[contenteditable]').forEach((cell, index) => {
                const field = [
                    'name', 'phone_number', 'email', 'identity_card', 'gender',
                    'member_card_number', 'card_type', 'accumulated_spending'
                ][index];
                updatedData[field] = cell.textContent.trim();
            });

            fetch(`/employees/${customerId}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to save changes.');
                    }
                    alert('Changes saved successfully!');
                })
                .catch(error => {
                    console.error(error);
                    alert('Error saving changes.');
                });
        }

        // Toggle button text
        this.textContent = isEditing ? 'Save' : 'Edit';
        this.style.backgroundColor = isEditing ? '#66FF66' : '';
        this.style.color = isEditing ? '#FFFFFF' : '';
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openPopupBtn = document.getElementById("openPopup");
    const closePopupBtn = document.getElementById("closePopup");
    const cancelPopupBtn = document.getElementById("cancelPopup");

    // Hiển thị popup
    function showPopup() {
        popup.classList.add("active");
        // Lấy danh sách thành phố khi trang web tải
    }

    // Đóng popup
    function closePopup() {
        popup.classList.remove("active");
    }

    // Gán sự kiện
    openPopupBtn.addEventListener("click", showPopup);
    closePopupBtn.addEventListener("click", closePopup);
    cancelPopupBtn.addEventListener("click", closePopup);
});

document.getElementById('submit-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById('infoFrom'); // Ensure this matches your form's ID
    const formData = new FormData(form);
    const newCustomerData = {};

    // Convert FormData to an object
    formData.forEach((value, key) => {
        newCustomerData[key] = value.trim(); // Trim unnecessary whitespace
    });

    fetch('/employees/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomerData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to insert customer.');
            }
            return response.json();
        })
        .then(data => {
            // Handle success response
            console.log(data.message); // Log success message
            const successMessage = document.getElementById('success-message');
            successMessage.textContent = 'Customer added successfully!';
            successMessage.style.color = 'green';

            form.reset(); // Optionally reset the form fields
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = document.getElementById('success-message');
            errorMessage.textContent = 'Failed to add customer. Please try again.';
            errorMessage.style.color = 'red';
        });
});
