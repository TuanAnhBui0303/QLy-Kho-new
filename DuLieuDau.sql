-- 1. KÍCH HOẠT VÀ TẠO CƠ SỞ DỮ LIỆU
CREATE DATABASE IF NOT EXISTS quan_ly_kho CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quan_ly_kho;

-- 2. TẠO BẢNG LƯU TÀI KHOẢN ADMIN
CREATE TABLE IF NOT EXISTS tai_khoan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) NOT NULL UNIQUE,
    mat_khau VARCHAR(100) NOT NULL
);

-- 3. TẠO BẢNG LƯU THÔNG TIN SẢN PHẨM TỒN KHO
CREATE TABLE IF NOT EXISTS san_pham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_sku VARCHAR(50) NOT NULL UNIQUE,
    ten_sp VARCHAR(255) NOT NULL,
    vi_tri VARCHAR(100) DEFAULT 'Chưa xếp',
    so_luong INT DEFAULT 0
);

-- 4. CHÈN DỮ LIỆU MẪU BAN ĐẦU
-- Thêm tài khoản admin đăng nhập
INSERT INTO tai_khoan (ten_dang_nhap, mat_khau) VALUES 
('admin', '123456')
ON DUPLICATE KEY UPDATE ten_dang_nhap=ten_dang_nhap;

-- Thêm danh sách mặt hàng tồn kho mẫu
INSERT INTO san_pham (ma_sku, ten_sp, vi_tri, so_luong) VALUES
('SKU-9901', 'Đế cao su mẫu A', 'Kệ A1 - Tầng 2', 150),
('SKU-4412', 'Keo dán chuyên dụng', 'Kệ B3 - Tầng 1', 45),
('SKU-1049', 'Da bò nguyên tấm', 'Kho C - Ô 12', 5)
ON DUPLICATE KEY UPDATE ma_sku=ma_sku;