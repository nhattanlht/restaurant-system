document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const customerManagementLink = document.getElementById('customerManagementLink');
    const reportInvoicesLink = document.getElementById('reportInvoices');
    const orderItemsLink = document.getElementById('orderItems'); // Added for Order Items
    const itemManagementLink = document.getElementById('itemManagement');
    const customerManagementSection = document.getElementById('customer-management');
    const reportInvoicesSection = document.getElementById('report-invoices');
    const itemManagementSection = document.getElementById('item-management');
    const orderItemsSection = document.getElementById('order-items'); // Added for Order Items section


    // Hide all sections and show the specific one
    const showSection = (section) => {
        customerManagementSection.style.display = 'none';
        reportInvoicesSection.style.display = 'none';
        itemManagementSection.style.display = 'none';
        orderItemsSection.style.display = 'none';
        section.style.display = 'block';
    };

    // Add event listeners
    customerManagementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(customerManagementSection);
    });

    reportInvoicesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(reportInvoicesSection);
    });

    itemManagementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(itemManagementSection);
    });

    orderItemsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(orderItemsSection);
    });

    // Define sections
    const sections = {
        'customer-management': document.getElementById('customer-management'),
        'report-invoices': document.getElementById('report-invoices'),
        'item-management': document.getElementById('item-management'),
        'order-items': orderItemsSection, // Added for Order Items section
    };

    // Hide all sections by default
    Object.values(sections).forEach(section => section.style.display = 'none');

    // Retrieve the activeSection value from the hidden input field
    const activeSectionInput = document.querySelector('input[name="activeSection"]');
    const activeSection = activeSectionInput ? activeSectionInput.value : null;

    // Debugging logs to check if activeSection is being set correctly
    console.log("Active Section Input Element:", activeSectionInput);  // Log the input element
    console.log("Active Section Value (raw):", activeSection);  // Log the raw value of activeSection

    if (activeSection === '') {
        console.log("The activeSection value is empty. Make sure it's set correctly in the backend.");
    }

    // Show the active section if it's available, otherwise default to 'customer-management'
    if (activeSection && sections[activeSection]) {
        console.log(`Showing section: ${activeSection}`);  // Log the section being shown
        sections[activeSection].style.display = 'block';
    } else {
        console.log("Defaulting to 'customer-management' section");  // Log the fallback section
        sections['customer-management'].style.display = 'block'; // Default section
    }
});

document.querySelectorAll('.customers-edit-save-btn').forEach(button => {
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
                    'item_name',
                    'category_name',  // Tên món ăn
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
        this.style.backgroundColor = isEditing ? '#66FF66' : '';
        this.style.color = isEditing ? '#FFFFFF' : '';
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
    })
});

function openNav() {
    const sidebar = document.getElementById("mySidebar");
    const mainContent = document.getElementById("main-content");
    sidebar.style.width = "250px";
    mainContent.style.marginLeft = "250px";
    document.querySelector(".sidebar").classList.replace("close", "open");
}

// Function to close the sidebar and reset main content margin
function closeNav() {
    const sidebar = document.getElementById("mySidebar");
    const mainContent = document.getElementById("main-content");
    sidebar.style.width = "0";
    mainContent.style.marginLeft = "15px";
    document.querySelector(".sidebar").classList.replace("open", "close");
}
function openBag() {
    const sidebar = document.getElementById("SlideShoppingBag");
    const mainContent = document.getElementById("showcart");
    sidebar.style.width = "250px";
    mainContent.style.marginRight = "250px";
    document.querySelector(".SlideShoppingBag").classList.replace("close", "open");
}

// Function to close the sidebar and reset main content margin
function closeBag() {
    const sidebar = document.getElementById("SlideShoppingBag");
    const mainContent = document.getElementById("showcart");
    sidebar.style.width = "0";
    mainContent.style.marginRight = "15px";
    document.querySelector(".SlideShoppingBag").classList.replace("open", "close");
}

// Event listener to open the sidebar
document.querySelectorAll('.openbtn').forEach(button => {
    button.addEventListener('click', openNav);
});
document.querySelectorAll('.openbtnbag').forEach(button => {
    button.addEventListener('click', openBag);
});

// Initialize flags to track if the data has been loaded
let branchesLoaded = false;
let categoriesLoaded = false;

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openPopupBtn = document.getElementById("openPopup");
    const closePopupBtn = document.getElementById("closePopup1");
    const cancelPopupBtn = document.getElementById("cancelPopup");
    const branchSelect = document.getElementById("branch");
    const categorySelect = document.getElementById("category");
    const closeBtn = document.getElementById("closeBtn");
    const closeBtnbag = document.getElementById("closeBtnbag");

    // Add event listener for close button
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            closeNav();
        });
    } else {
        console.log("closeBtn is not found!");
    }
    if (closeBtnbag) {
        closeBtnbag.addEventListener("click", () => {
            closeBag();
        });
    } else {
        console.log("closeBtnbag is not found!");
    }
    // Hiển thị popup
    function showPopup() {
        popup.classList.add("active");
        // Lấy danh sách thành phố khi trang web tải
    }

    // Đóng popup
    function closePopup() {
        popup.classList.remove("active");
    }

    // Load categories function (only runs once)
    async function loadAllCategories() {
        if (categoriesLoaded) return;  // Skip if already loaded

        try {
            const response = await fetch('/api/categories');  // Gọi API đúng với URL
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.category_id;  // Giả sử category_id là ID khu vực
                option.textContent = category.category_name;  // category_name là tên khu vực
                categorySelect.appendChild(option);
            });

            // Mark as loaded
            categoriesLoaded = true;
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    // Lấy danh sách thành phố từ API
    async function loadBranches() {
        if (branchesLoaded) return;  // Skip if already loaded

        try {
            const response = await fetch('/api/branches');  // Gọi API đúng với URL
            const branches = await response.json();
            branches.forEach(branch => {
                const option = document.createElement("option");
                option.value = branch.branch_id;  // Giả sử branch_id là ID khu vực
                option.textContent = branch.branch_name;  // branch_name là tên khu vực
                branchSelect.appendChild(option);
            });

            // Mark as loaded
            branchesLoaded = true;
        } catch (error) {
            console.error("Error loading branches:", error);
        }
    }
    loadAllCategories();
    loadBranches();

    // Gán sự kiện
    openPopupBtn.addEventListener("click", showPopup);
    closePopupBtn.addEventListener("click", closePopup1);
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

// xử lý sự kiện order Items
// For the filter button
document.getElementById('filter-btn').addEventListener('click', function () {
    let branch = document.getElementById('branchsearch').value;
    let category = document.getElementById('category').value;
    let price = document.getElementById('price-max').value;

    // Create the query string with filter parameters
    let queryString = `?branch=${branch}&category=${category}&price=${price}`;

    // Redirect to the /employees/result with the query string
    window.location.href = '/employees/result' + queryString;
});

// For the search button
document.getElementById('search-btn').addEventListener('click', function () {
    let search = document.getElementById('search-box').value;
    let branch = document.getElementById('branchsearch').value;
    let category = document.getElementById('category').value;
    let price = document.getElementById('price-max').value;

    // Create the query string with search and filter parameters
    let queryString = `?search=${search}&branch=${branch}&category=${category}&price=${price}`;

    // Redirect to the /employees/result with the query string
    window.location.href = '/employees/result' + queryString;
});

