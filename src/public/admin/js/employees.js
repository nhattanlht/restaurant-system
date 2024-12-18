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

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openPopupBtn = document.getElementById("openPopup");
    const closePopupBtn = document.getElementById("closePopup");
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
    closePopupBtn.addEventListener("click", closePopup);
    cancelPopupBtn.addEventListener("click", closePopup);


    // THIS FOR CARTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT

    document.body.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('add-to-cart')) {

            const itemData = {
                id: event.target.dataset.id,
                name: event.target.dataset.name,
                price: event.target.dataset.price,
                image: event.target.dataset.image
            };

            // Log the item data for debugging
            console.log('Item Data:', itemData);

            fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Cart items:', data.cartItems); // Check if cart items are updated
                        updateCartDisplay(data.cartItems);
                        document.getElementById('SlideShoppingBag').style.display = 'block';
                    }
                })
                .catch(err => console.error('Error:', err));
        }
    });


    function updateCartDisplay(cartItems) {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        cartItemsContainer.innerHTML = ''; // Clear current cart content

        if (cartItems.length > 0) {
            cartItems.forEach(item => {
                cartItemsContainer.innerHTML += `
                    <div class="cart-item" id="cart-item-${item.id}" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px;">
                        <span>${item.name}</span>
                        <input type="number" class="quantity-input" value="${item.quantity}" data-id="${item.id}" min="1">
                        <span>${item.price.toLocaleString()}₫</span>
                        <button class="remove-btn" data-id="${item.id}">Xóa</button>
                    </div>
                `;
            });

            // Add event listeners for the quantity inputs and remove buttons
            const quantityInputs = document.querySelectorAll('.quantity-input');
            quantityInputs.forEach(input => {
                input.addEventListener('change', function () {
                    const itemId = input.dataset.id;
                    const newQuantity = input.value;
                    updateItemQuantity(itemId, newQuantity);
                });
            });

            // Add event listeners for the remove buttons
            const removeButtons = document.querySelectorAll('.remove-btn');
            removeButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const itemId = button.dataset.id; // Get the item ID from the button's data-id attribute
                    removeItemFromCart(itemId);
                });
            });
        } else {
            cartItemsContainer.innerHTML = `<p>No items in cart.</p>`;
        }
    }
    function updateItemQuantity(itemId, quantity) {
        // Kiểm tra số lượng hợp lệ
        if (quantity < 1) {
            alert('Số lượng phải lớn hơn hoặc bằng 1');
            return;
        }

        // Lấy giỏ hàng hiện tại
        const cartItems = Array.from(document.querySelectorAll('.cart-item'));
        const updatedCart = cartItems.map(item => {
            const id = item.id.replace('cart-item-', '');
            const itemQuantity = item.querySelector('.quantity-input').value;
            return {
                itemId: id,
                quantity: itemQuantity
            };
        });

        // Gửi yêu cầu cập nhật giỏ hàng lên server
        fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: updatedCart })
        })
            .then(response => response.json())
            .then(data => {
                if (data.cart) {
                    updateCartDisplay(data.cart); // Cập nhật lại giỏ hàng sau khi thay đổi số lượng
                    alert('Giỏ hàng đã được cập nhật');
                }
            })
            .catch(err => {
                console.error('Error updating cart:', err);
            });
    }

    // Function to send request to remove item from cart
    function removeItemFromCart(itemId) {
        fetch('/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.cart) {
                    updateCartDisplay(data.cart); // Update the cart display after removing the item
                    alert('Item removed from cart');
                }
            })
            .catch(err => {
                console.error('Error removing item:', err);
            });
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

            fetch(`/admin/${customerId}/update`, {
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