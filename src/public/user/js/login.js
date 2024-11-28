// document.getElementById('registerForm').addEventListener('submit', async function (event) {
//
//     const username = document.getElementById('user_name').value.trim();
//     const password = document.getElementById('password').value.trim();
//     try {
//         const response = await fetch('/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json'},
//             body: JSON.stringify({ user_name: username, password: password })
//         });
//
//         // Check if the response is ok before parsing
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error('Đăng nhập không thành công. Mã lỗi: ' + errorData.message);
//         }
//         // const user_id = response.headers.get('x-client-id');
//         // const accessToken = response.headers.get('authorization');
//         // const refreshToken = response.headers.get('x-rf-token-id');
//         //
//         // // Lưu thông tin vào localStorage
//         // localStorage.setItem('user_id', user_id);
//         // localStorage.setItem('accessToken', accessToken);
//         // localStorage.setItem('refreshToken', refreshToken);
//         const data = await response.json();
//         alert(data.message); // Hiển thị thông báo thành công
//         window.location.href = '/';
//     } catch (error) {
//         console.error('Error:', error.message);
//         alert(error.message); // Thông báo lỗi
//     }
// });
//
