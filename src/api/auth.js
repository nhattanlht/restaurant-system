const API_URL = 'http://localhost:3005/login';

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        // Trả về dữ liệu user và token
        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;  // Ném lỗi để có thể xử lý ở nơi gọi
    }
};

export const logout = () => {
    // Xóa thông tin đăng nhập khi người dùng logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};
