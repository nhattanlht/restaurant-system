const fs = require('fs');
const path = require('path');

class FoodModel {
    static async searchFoods(filters = {}) {
        try {
            const filePath = path.join(__dirname, '../branch_menu_data.json');
            const data = fs.readFileSync(filePath, 'utf-8');

            if (!data) {
                throw new Error('No data found in JSON file');
            }

            const branchData = JSON.parse(data);

            // Lọc chi nhánh trước
            let filteredBranches = branchData.branches.filter(branch => {
                // Lọc theo branch nếu không phải 'all'
                return filters.branch === 'all' || branch.branch_name === filters.branch;
            });

            let filteredFoods = [];

            // Lọc theo menu_items trong từng branch đã lọc
            filteredBranches.forEach(branch => {
                let branchFoods = branch.menu_items.filter(item => {
                    // Lọc theo phân loại món ăn nếu không phải 'all'
                    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
                        return false;
                    }

                    // Lọc theo giá tiền nếu có chỉ định
                    if (filters.price && parseInt(item.price) > filters.price) {
                        return false;
                    }

                    // Lọc theo từ khóa tìm kiếm nếu có chỉ định
                    if (filters.search && !item.item_name.toLowerCase().includes(filters.search.toLowerCase())) {
                        return false;
                    }

                    return true; // Giữ lại món ăn phù hợp
                });

                // Gắn thông tin chi nhánh vào từng món ăn và thêm vào danh sách kết quả
                branchFoods.forEach(item => {
                    filteredFoods.push({
                        branch: branch.branch_name,
                        ...item
                    });
                });
            });

            // Log kết quả sau khi lọc
            console.log("Filtered foods in searchFoods:", filteredFoods);

            return filteredFoods;
        } catch (error) {
            console.error('Error while searching foods:', error);
            throw new Error(error.message);
        }
    }
}

module.exports = FoodModel;
