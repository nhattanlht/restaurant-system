// JavaScript to handle the search and update the table dynamically
document.querySelector('.search-btn').addEventListener('click', function (event) {
    event.preventDefault();
    const foodName = document.querySelector('input[name="foodName"]').value;
    const branch = document.querySelector('select[name="branch"]').value;
    const category = document.querySelector('select[name="category"]').value;
    const maxPrice = document.querySelector('input[name="maxPrice"]').value;

    // Prepare data to be sent to the server
    const searchParams = new URLSearchParams({
        foodName,
        branch,
        category,
        maxPrice
    }).toString();
    const newUrl = `/admin/order/results?${searchParams}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    // Fetch search results from server (using a route to handle the search logic)
    fetch(newUrl)
        .then(response => response.json())  // Assuming server returns JSON
        .then(data => {
            const foodItemsTable = document.getElementById('foodItemsTable');

            // Clear current table content
            foodItemsTable.innerHTML = '';

            if (data.foods && data.foods.length > 0) {
                data.foods.forEach(food => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td><img src="../../../public/admin/images/${food.item_name}.jpg" class="card-img-top" alt="${food.item_name}"></td>
                        <td>${food.item_name || 'N/A'}</td>
                        <td>${food.category_name || 'N/A'}</td>
                        <td>${food.price.toLocaleString()}₫</td>
                        <td>
                            <button class="btn btn-primary add-to-cart" 
                                    data-id="${food.item_id}" 
                                    data-name="${food.item_name}" 
                                    data-price="${food.price}" 
                                    data-image="../../../public/admin/images/${food.item_name}.jpg">
                                Add to Cart
                            </button>
                        </td>
                    `;

                    foodItemsTable.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5">No items match your search criteria.</td>`;
                foodItemsTable.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
});
