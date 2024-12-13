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
    showSection(branchRevenueSection); // Default: Branch Revenue
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
    });
});