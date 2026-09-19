// Hàm chuyên lấy danh sách hàng hóa từ Node.js Server
function fetchDanhSachKho() {
    return fetch('http://localhost:3000/api/san-pham')
        .then(function(response) {
            return response.json();
        })
        .catch(function(error) {
            console.error('Lỗi kết nối API:', error);
            return [];
        });
}
// Hàm gửi thông tin đăng nhập lên Server
function guiyeuCauLogin(username, password) {
    return fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(function(response) {
        return response.json();
    });
}