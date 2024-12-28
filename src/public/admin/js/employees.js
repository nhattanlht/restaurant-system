// For Item Management Editing
document.querySelectorAll(".items-edit-save-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const isEditing = this.textContent === "Edit";
  
      // Toggle editable state
      row.querySelectorAll("[contenteditable]").forEach((cell) => {
        cell.contentEditable = isEditing;
        cell.style.backgroundColor = isEditing ? "#f9f9f9" : "";
      });
  
      if (!isEditing) {
        const itemId = row.dataset.itemId; // Ensure item_id is correctly retrieved from data-item-id
        console.log("item_id:", itemId); // Verify itemId value
  
        const updatedData = {};
  
        row.querySelectorAll("[contenteditable]").forEach((cell, index) => {
          const fields = [
            "item_name",
            "category_name", // Tên món ăn
            "price", // Giá
            "status", // Trạng thái
          ];
  
          updatedData[fields[index]] = cell.textContent.trim();
        });
  
        updatedData["item_id"] = itemId; // Ensure item_id is included in the data
  
        console.log("Data being sent to the server:", updatedData);
  
        fetch(`/admin/items/${itemId}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to save changes.");
            }
            alert("Changes saved successfully!");
          })
          .catch((error) => {
            console.error(error);
            alert("Error saving changes.");
          });
      }
  
      this.textContent = isEditing ? "Save" : "Edit";
      this.style.backgroundColor = isEditing ? "#66FF66" : "";
      this.style.color = isEditing ? "#FFFFFF" : "";
    });
  });
  
  document.addEventListener("DOMContentLoaded", () => {
      //Pop up
      const popup = document.getElementById("popup");
      const openPopupBtn = document.getElementById("openPopup");
      const closePopupBtn = document.getElementById("closePopup");
      const cancelPopupBtn = document.getElementById("cancelPopup");
      const closeBtnbag = document.getElementById("closeBtnbag");
  
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
  
      if (closeBtnbag) {
          closeBtnbag.addEventListener("click", () => {
              closeBag();
          });
      } else {
          console.log("closeBtnbag is not found!");
      }
    });
    document.addEventListener("DOMContentLoaded", () => {
      const popup = document.getElementById("popup1");
      const openPopup1 = document.getElementById("openPopup1");
      const closePopup1 = document.getElementById("closePopup1");
      const cancelPopup1 = document.getElementById("cancelPopup1");
  
      if (!popup || !openPopup1 || !closePopup1 || !cancelPopup1) {
          console.error("One or more elements not found");
          return;
      }
  
      function showPopup() {
          popup.classList.add("active");
      }
  
      function closePopup() {
          popup.classList.remove("active");
      }
  
      openPopup1.addEventListener("click", showPopup);
      closePopup1.addEventListener("click", closePopup);
      cancelPopup1.addEventListener("click", closePopup);
  });
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
  
              fetch('/admin/cart/add', {
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
    // THIS FOR CARTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
  
    document.body.addEventListener("click", function (event) {
      if (event.target && event.target.classList.contains("add-to-cart")) {
        const itemData = {
          id: event.target.dataset.id,
          name: event.target.dataset.name,
          price: event.target.dataset.price,
          image: event.target.dataset.image,
        };
  
        // Log the item data for debugging
        console.log("Item Data:", itemData);
  
        fetch("/admin/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log("Cart items:", data.cartItems); // Check if cart items are updated
              updateCartDisplay(data.cartItems);
              document.getElementById("SlideShoppingBag").style.display = "block";
            }
          })
          .catch((err) => console.error("Error:", err));
      }
    });
  
  
    function updateCartDisplay(cartItems) {
      const cartItemsContainer = document.getElementById("cartItemsContainer");
      cartItemsContainer.innerHTML = ""; // Clear current cart content
  
      if (cartItems.length > 0) {
        cartItems.forEach((item) => {
          cartItemsContainer.innerHTML += `
                      <div class="cart-item" id="cart-item-${item.id}" data-id="${
            item.id
          }">
                          <img src="${item.image}" alt="${
            item.name
          }" style="width:50px; height:50px;">
                          <span>${item.name}</span>
                          <input type="number" class="quantity-input" value="${
                            item.quantity
                          }" data-id="${item.id}" min="1">
                          <span>${item.price.toLocaleString()}₫</span>
                          <button class="remove-btn" data-id="${
                            item.id
                          }">Xóa</button>
                      </div>
                  `;
        });
  
        // Add event listeners for the quantity inputs and remove buttons
        const quantityInputs = document.querySelectorAll(".quantity-input");
        quantityInputs.forEach((input) => {
          input.addEventListener("change", function () {
            const itemId = input.dataset.id;
            const newQuantity = input.value;
            updateItemQuantity(itemId, newQuantity);
          });
        });
  
        // Add event listeners for the remove buttons
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach((button) => {
          button.addEventListener("click", function () {
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
        alert("Số lượng phải lớn hơn hoặc bằng 1");
        return;
      }
  
      // Lấy giỏ hàng hiện tại
      const cartItems = Array.from(document.querySelectorAll(".cart-item"));
      const updatedCart = cartItems.map((item) => {
        const id = item.id.replace("cart-item-", "");
        const itemQuantity = item.querySelector(".quantity-input").value;
        return {
          itemId: id,
          quantity: itemQuantity,
        };
      });
  
      // Gửi yêu cầu cập nhật giỏ hàng lên server
      fetch("/admin/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: updatedCart }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.cart) {
            updateCartDisplay(data.cart); // Cập nhật lại giỏ hàng sau khi thay đổi số lượng
            alert("Giỏ hàng đã được cập nhật");
          }
        })
        .catch((err) => {
          console.error("Error updating cart:", err);
        });
    }
  
    // Function to send request to remove item from cart
    function removeItemFromCart(itemId) {
      fetch("/admin/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.cart) {
            updateCartDisplay(data.cart); // Update the cart display after removing the item
            alert("Item removed from cart");
          }
        })
        .catch((err) => {
          console.error("Error removing item:", err);
        });
    }
  
  
  document.querySelectorAll(".customers-edit-save-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const isEditing = this.textContent === "Edit";
  
      // Toggle editable state
      row.querySelectorAll("[contenteditable]").forEach((cell) => {
        cell.contentEditable = isEditing;
        cell.style.backgroundColor = isEditing ? "#f9f9f9" : "";
      });
  
      if (!isEditing) {
        // Save changes
        const customerId = row.dataset.customerId;
        const updatedData = {};
  
        row.querySelectorAll("[contenteditable]").forEach((cell, index) => {
          const field = [
            "name",
            "phone_number",
            "email",
            "identity_card",
            "gender",
            "member_card_number",
            "card_type",
            "accumulated_spending",
          ][index];
          updatedData[field] = cell.textContent.trim();
        });
  
        fetch(`/admin/${customerId}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to save changes.");
            }
            alert("Changes saved successfully!");
          })
          .catch((error) => {
            console.error(error);
            alert("Error saving changes.");
          });
      }
  
      // Toggle button text
      this.textContent = isEditing ? "Save" : "Edit";
    });
  });
  
  function openBag() {
    const sidebar = document.getElementById("SlideShoppingBag");
    const mainContent = document.getElementById("order");
    sidebar.style.width = "250px";
    mainContent.style.marginRight = "250px";
    document
      .querySelector(".SlideShoppingBag")
      .classList.replace("close", "open");
  }
  document.querySelectorAll(".openbtnbag").forEach((button) => {
    button.addEventListener("click", openBag);
  });
  
  // Function to close the sidebar and reset main content margin
  function closeBag() {
    const sidebar = document.getElementById("SlideShoppingBag");
    const mainContent = document.getElementById("order");
    sidebar.style.width = "0";
    mainContent.style.marginRight = "15px";
    document
      .querySelector(".SlideShoppingBag")
      .classList.replace("open", "close");
  }
  
  document.getElementById("submitCartBtn").addEventListener("click", function () {
    const cartItems = []; // Collect the items in the cart
    let hasError = false; // Flag to track if any error occurs during cart item processing
  
    // Loop through each item in the cart container
    document
      .querySelectorAll("#cartItemsContainer .cart-item")
      .forEach((itemElement) => {
        const itemId = itemElement.dataset.id;
        const itemName = itemElement
          .querySelector("span")
          .textContent.split(" x ")[0]; // Extract item name
        const itemQuantity = itemElement.querySelector(
          "input.quantity-input"
        ).value; // Get quantity from input field
        const itemPrice = itemElement
          .querySelectorAll("span")[1]
          .textContent.replace(/[^0-9]/g, ""); // Clean price (remove commas and "₫")
  
        console.log("Item ID:", itemId);
        console.log("Item Name:", itemName);
        console.log("Item Quantity:", itemQuantity);
        console.log("Item Quantity:", itemPrice);
  
        // Check if all required data is available
        if (itemName && itemQuantity && itemPrice) {
          // Push the parsed data to the cartItems array
          cartItems.push({
            id: itemId,
            name: itemName.trim(),
            price: parseInt(itemPrice), // Convert price to an integer
            quantity: parseInt(itemQuantity), // Convert quantity to an integer
          });
        } else {
          console.error(
            "Failed to parse item:",
            itemName,
            itemQuantity,
            itemPrice
          );
          hasError = true; // Set error flag if parsing fails
        }
      });
  
    if (hasError) {
      console.error("Error: Some cart items could not be parsed correctly.");
      alert("There was an issue with some of the items in your cart.");
      return; // Stop the process if there's an error
    }
  
    // Now send the cart data to the server
    fetch("/admin/cart/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: cartItems }), // Send cart items as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Cart saved successfully!");
        } else {
          console.error("Error response from server:", data); // Log error response from server
          alert("Error saving cart: " + data.message); // Show detailed error message
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        alert("An error occurred while saving the cart.");
      });
  });
  
  // document.addEventListener("DOMContentLoaded", () => {
  //   // Select elements
  //   const addItemBtn = document.getElementById("addItemBtn");
  //   const addItemPopup = document.getElementById("addItemPopup");
  //   const closePopupBtn = document.getElementById("closePopup1");
  //   const addItemForm = document.getElementById("addItemForm");
  
  //   // Show the popup when the button is clicked
  //   addItemBtn.addEventListener("click", () => {
  //     addItemPopup.classList.add("active");
  //   });
  
  //   // Close the popup when the close button is clicked
  //   closePopupBtn.addEventListener("click", () => {
  //     addItemPopup.classList.remove("active");
  //   });
  
  //   // Handle form submission to add new item
  //   addItemForm.addEventListener("submit", async (e) => {
  //     e.preventDefault();
  
  //     // Get form data
  //     const itemName = document.getElementById("itemName").value;
  //     const itemCategory = document.getElementById("itemCategory").value;
  //     const itemPrice = document.getElementById("itemPrice").value;
  
  //     // Create item object
  //     const newItem = {
  //       item_name: itemName,
  //       category_id: itemCategory,
  //       price: itemPrice,
  //     };
  //     console.log("Kiểm tra pop-up client: ", newItem);
  
  //     try {
  //       // Send the item data to the server to save
  //       const response = await fetch("/admin/items/add", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newItem),
  //       });
  
  //       if (response.ok) {
  //         // If successful, close the popup and reload the page to show the new item
  //         addItemPopup.classList.remove("active");
  //         location.reload();
  //       } else {
  //         console.error("Error adding item");
  //         alert("Failed to add item");
  //       }
  //     } catch (error) {
  //       console.error("Error adding item:", error);
  //       alert("Error adding item");
  //     }
  //   });
  // });
  