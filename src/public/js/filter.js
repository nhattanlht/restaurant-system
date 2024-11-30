//cho filter
document.getElementById('filter-btn').addEventListener('click',function(){
    let branch=document.getElementById('branch').value;
    let category=document.getElementById('category').value;
    let price=document.getElementById('price-max').value;
    
    // Tạo URL với các tham số lọc dưới dạng query string
    let queryString = `?branch=${branch}&category=${category}&price=${price}`;

    // Chuyển hướng đến trang với các tham số lọc
    window.location.href = '/filter/result' + queryString;
  

}) ;

//cho nút search
document.getElementById('search-btn').addEventListener('click',function(){
    let search=document.getElementById('search-box').value;
    let branch=document.getElementById('branch').value;
    let category=document.getElementById('category').value;
    let price=document.getElementById('price-max').value;
    
    // Tạo URL với các tham số lọc dưới dạng query string
    let queryString = `?search=${(search)}&branch=${branch}&category=${category}&price=${price}`;

    // Chuyển hướng đến trang với các tham số lọc
    window.location.href = '/filter/result' + queryString;
})  

