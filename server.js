const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối Cơ sở dữ liệu MySQL trong XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quan_ly_kho'
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
    } else {
        console.log('✅ Đã kết nối thành công tới Database MySQL!');
    }
});

// API Lấy danh sách sản phẩm từ SQL
app.get('/api/san-pham', (req, res) => {
    const sql = "SELECT ma_sku AS maSku, ten_sp AS tenSp, vi_tri AS viTri, so_luong AS soLuong FROM san_pham";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        return res.json(results);
    });
});

// Chạy Server tại cổng 3000
app.listen(3000, () => {
    console.log('🚀 Server Node.js đang chạy tại: http://localhost:3000');
});
// API Xử lý Đăng nhập
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM tai_khoan WHERE ten_dang_nhap = ? AND mat_khau = ?";
    
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi Server" });
        
        if (results.length > 0) {
            return res.json({ success: true, message: "Đăng nhập thành công!" });
        } else {
            return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
        }
    });
});