// Import module 'fs' của Node.js để làm việc với hệ thống file
const fs=require('fs');

const branchData={
    "branches":[
        {
            "branch_name": "TPHCM",
            "menu_items":[
                { "item_id": 1, "item_name": "Tôm Ebi", "price": 199000, "category": "Sushi Truyền Thống" },
        { "item_id": 4, "item_name": "Sashimi Cá Hồi", "price": 350000, "category": "Sushi Truyền Thống" },
        { "item_id": 7, "item_name": "Cuộn Cá Hồi Philadelphia", "price": 299000, "category": "Sushi Đặc Biệt" },
        { "item_id": 13, "item_name": "Đậu Nành Luộc (Edamame)", "price": 50000, "category": "Salad và Khai Vị" },
        { "item_id": 19, "item_name": "Cá Hồi Nướng Sốt Teriyaki", "price": 349000, "category": "Món Nướng và Chiên" },
        { "item_id": 25, "item_name": "Cơm Chiên Hải Sản", "price": 250000, "category": "Cơm và Mì" },
        { "item_id": 31, "item_name": "Bánh Gạo Mochi", "price": 49000, "category": "Món Ăn Phụ" },
        { "item_id": 37, "item_name": "Coca-Cola", "price": 20000, "category": "Đồ Uống" },
        { "item_id": 38, "item_name": "Nước Ép Cam Tươi", "price": 45000, "category": "Đồ Uống" },
        { "item_id": 44, "item_name": "Trà Xanh Nhật Bản (Matcha)", "price": 55000, "category": "Đồ Uống" }
            ]
        },
        {
            "branch_name":"Long An",
            "menu_items":[
                { "item_id": 2, "item_name": "Cá Ngừ Maguro", "price": 299000, "category": "Sushi Truyền Thống" },
                { "item_id": 8, "item_name": "Cuộn Cầu Vồng", "price": 349000, "category": "Sushi Đặc Biệt" },
                { "item_id": 14, "item_name": "Há Cảo Chiên (Gyoza)", "price": 60000, "category": "Salad và Khai Vị" },
                { "item_id": 20, "item_name": "Gà Chiên Karaage", "price": 249000, "category": "Món Nướng và Chiên" },
                { "item_id": 26, "item_name": "Mì Ramen Tonkotsu", "price": 299000, "category": "Cơm và Mì" },
                { "item_id": 32, "item_name": "Dưa Chuột Muối", "price": 35000, "category": "Món Ăn Phụ" },
                { "item_id": 39, "item_name": "Nước Ép Lựu", "price": 55000, "category": "Đồ Uống" },
                { "item_id": 40, "item_name": "Nước Ép Táo", "price": 50000, "category": "Đồ Uống" },
                { "item_id": 41, "item_name": "Nước Suối", "price": 10000, "category": "Đồ Uống" },
                { "item_id": 42, "item_name": "Rượu Sake", "price": 150000, "category": "Đồ Uống" }
            ]
        },
        {
           "branch_name": "Đồng Nai",
            "menu_items": [
                { "item_id": 5, "item_name": "Sushi Nigiri", "price": 179000, "category": "Sushi Truyền Thống" },
                { "item_id": 10, "item_name": "Cuộn Nhện (Spider Roll)", "price": 350000, "category": "Sushi Đặc Biệt" },
                { "item_id": 16, "item_name": "Cá Hồi Tempura", "price": 120000, "category": "Salad và Khai Vị" },
                { "item_id": 24, "item_name": "Tôm Chiên Tempura", "price": 279000, "category": "Món Nướng và Chiên" },
                { "item_id": 29, "item_name": "Cơm Cá Ngừ Cay", "price": 315000, "category": "Cơm và Mì" },
                { "item_id": 34, "item_name": "Kimchi Nhật Bản", "price": 45000, "category": "Món Ăn Phụ" },
                { "item_id": 18, "item_name": "Salad Rong Biển (Wakame)", "price": 70000, "category": "Salad và Khai Vị" },
                { "item_id": 30, "item_name": "Cơm Lươn Nướng Unagi", "price": 359000, "category": "Cơm và Mì" },
                { "item_id": 35, "item_name": "Khoai Tây Nghiền", "price": 49000, "category": "Món Ăn Phụ" },
                { "item_id": 36, "item_name": "Cơm Trắng", "price": 25000, "category": "Món Ăn Phụ" }
      ]
    }
  ]
};
// Chuyển đổi dữ liệu thành chuỗi JSON
const jsonData=JSON.stringify(branchData,null,2);//Thụt lề 2 dòng để dễ đọc
// Ghi dữ liệu vào file JSON
fs.writeFile('branch_menu_data.json',jsonData,(err)=>{
    if(err){
        console.log('Lỗi khi ghi File',err);
    }else{
        console.log('Ghi file JSON thành công');
    }
})