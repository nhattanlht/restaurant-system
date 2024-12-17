document.addEventListener("DOMContentLoaded", () => {
    // Select elements for the menu links
    const customerManagementLink = document.getElementById('customerManagementLink');
    const reportInvoicesLink = document.getElementById('reportInvoicesLink');
    const itemManagementLink = document.getElementById('itemManagementLink');

    const customerManagementSection = document.getElementById('customer-management');
    const reportInvoicesSection = document.getElementById('report-invoices');
    const itemManagementSection = document.getElementById('item-management');

    // Function to hide all sections and show the specified one
    const showSection = (section) => {
        customerManagementSection.style.display = 'none';
        reportInvoicesSection.style.display = 'none';
        itemManagementSection.style.display = 'none';
        section.style.display = 'block';
    };

    // Add event listeners to the links
    if (customerManagementLink) {
        customerManagementLink.addEventListener('click', (e) => {
            // e.redirect('/admin/employees');
            e.preventDefault();
            showSection(customerManagementSection);
        });
    }

    if (reportInvoicesLink) {
        reportInvoicesLink.addEventListener('click', (e) => {
            // e.redirect('/admin/employees');
            e.preventDefault();
            showSection(reportInvoicesSection);
        });
    }

    if (itemManagementLink) {
        itemManagementLink.addEventListener('click', (e) => {
            // e.redirect('/admin/employees');
            e.preventDefault();
            showSection(itemManagementSection);
        });
    }

    // Optionally, set the default section to show
    // showSection(reportInvoicesSection); // Default: Branch Revenue
});

// For Item Management Editing
document.querySelectorAll('.items-edit-save-btn').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const isEditing = this.textContent === 'Edit';

        // Toggle editable state for contenteditable cells
        row.querySelectorAll('[contenteditable]').forEach(cell => {
            cell.contentEditable = isEditing;
            cell.style.backgroundColor = isEditing ? '#f9f9f9' : '';
        });

        if (!isEditing) {
            const itemId = row.dataset.itemId;  // Ensure item_id is correctly retrieved from data-item-id
            console.log('item_id:', itemId);  // Verify itemId value

            const updatedData = {};

            row.querySelectorAll('[contenteditable]').forEach((cell, index) => {
                const fields = [
                    'item_name',
                    'category_name',  // Tên món ăn
                    'price',      // Giá
                    'status'      // Trạng thái
                ];

                updatedData[fields[index]] = cell.textContent;
            });

            // Make AJAX request to save the updated data
            fetch(`/admin/items/${itemId}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData), // Send updated fields in the body
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Item updated successfully');
                        // Optionally show success message or update the UI
                    } else {
                        console.error('Failed to update item');
                    }
                })
                .catch(error => {
                    console.error('Error updating item:', error);
                });
        }

        // Toggle the button text to 'Save' or 'Edit'
        this.textContent = isEditing ? 'Save' : 'Edit';
    });
});
