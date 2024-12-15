document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const customerManagementLink = document.getElementById('customerManagementLink');
    const reportInvoicesLink = document.getElementById('reportInvoices');
    const itemManagementLink = document.getElementById('itemManagement');
    const customerManagementSection = document.getElementById('customer-management');
    const reportInvoicesSection = document.getElementById('report-invoices');
    const itemManagementSection = document.getElementById('item-management');

    // Hide all sections and show the specific one
    const showSection = (section) => {
        customerManagementSection.style.display = 'none';
        reportInvoicesSection.style.display = 'none';
        itemManagementSection.style.display = 'none';
        section.style.display = 'block';
    };

    // Add event listeners
    customerManagementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(customerManagementSection);
    });

    reportInvoicesLink .addEventListener('click', (e) => {
        e.preventDefault();
        showSection( reportInvoicesSection);
    });

    itemManagementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(itemManagementSection);
    });

    // Optionally, set the default section to show
    showSection( reportInvoicesSection); // Default: Branch Revenue
});

// document.querySelectorAll('.customers-edit-save-btn').forEach(button => {
//     button.addEventListener('click', function () {
//         const row = this.closest('tr');
//         const isEditing = this.textContent === 'Edit';

//         // Toggle editable state
//         row.querySelectorAll('[contenteditable]').forEach(cell => {
//             cell.contentEditable = isEditing;
//             cell.style.backgroundColor = isEditing ? '#f9f9f9' : '';
//         });

//         if (!isEditing) {
//             // Save changes
//             const customerId = row.dataset.customerId;
//             const updatedData = {};

//             row.querySelectorAll('[contenteditable]').forEach((cell, index) => {
//                 const field = [
//                     'name', 'phone_number', 'email', 'identity_card', 'gender',
//                     'member_card_number', 'card_type', 'accumulated_spending'
//                 ][index];
//                 updatedData[field] = cell.textContent.trim();
//             });

//             fetch(`/employees/${customerId}/update`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(updatedData),
//             })
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error('Failed to save changes.');
//                     }
//                     alert('Changes saved successfully!');
//                 })
//                 .catch(error => {
//                     console.error(error);
//                     alert('Error saving changes.');
//                 });
//         }

//         // Toggle button text
//         this.textContent = isEditing ? 'Save' : 'Edit';
//     });
// });

document.querySelectorAll('.items-edit-save-btn').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const isEditing = this.textContent === 'Edit';

        // Toggle editable state
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
                    'category_name',
                    'item_name',  // Tên món ăn
                    'price',      // Giá
                    'status'      // Trạng thái
                ];

                updatedData[fields[index]] = cell.textContent.trim();
            });

            updatedData['item_id'] = itemId;  // Ensure item_id is included in the data

            console.log('Data being sent to the server:', updatedData);

            fetch(`/employees/items/${itemId}/update`, {
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

        this.textContent = isEditing ? 'Save' : 'Edit';
    });
});

//Pop Up
document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const addItemBtn = document.getElementById('addItemBtn');
    const addItemPopup = document.getElementById('addItemPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const addItemForm = document.getElementById('addItemForm');

    // Show the popup when the button is clicked
    addItemBtn.addEventListener('click', () => {
        addItemPopup.style.display = 'flex';
    });

    // Close the popup when the close button is clicked
    closePopupBtn.addEventListener('click', () => {
        addItemPopup.style.display = 'none';
    });

    // Handle form submission to add new item
    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const itemName = document.getElementById('itemName').value;
        const itemCategory = document.getElementById('itemCategory').value;
        const itemPrice = document.getElementById('itemPrice').value;

        // Create item object
        const newItem = {
            item_name: itemName,
            category_id: itemCategory,
            price: itemPrice,
        };
        console.log("Kiểm tra pop-up client: ", newItem);

        try {
            // Send the item data to the server to save
            const response = await fetch('/employees/items/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                // If successful, close the popup and reload the page to show the new item
                addItemPopup.style.display = 'none';
                location.reload();
            } else {
                console.error('Error adding item');
                alert('Failed to add item');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item');
        }
    });
});

document.querySelectorAll('.items-delete-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        
        const row = this.closest('tr');
        const itemId = row.dataset.itemId;

        if (confirm('Are you sure you want to delete this item?')) {
            fetch(`/employees/items/${itemId}/delete`, {
                method: 'POST',
            })
            .then(response => {
                if (response.ok) {
                    row.remove(); // Remove the row from the table
                    alert('Item deleted successfully!');
                } else {
                    alert('Failed to delete item.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete item.');
            });
        }
    });
});
