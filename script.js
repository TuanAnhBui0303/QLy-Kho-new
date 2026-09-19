var danhSachKho = [];

// 1. HÀM VẼ BẢNG DỮ LIỆU
function veBangKho(tuKhoa) {
    var bangBody = document.getElementById("inventoryTableBody");
    if (!bangBody) return;

    bangBody.innerHTML = "";
    if (!tuKhoa) tuKhoa = "";

    var stt = 1;

    for (var i = 0; i < danhSachKho.length; i++) {
        var sp = danhSachKho[i];

        var maSkuStr = sp.maSku || "";
        var tenSpStr = sp.tenSp || "";
        var viTriStr = sp.viTri || "Chưa xếp";
        var tuKhoaLower = tuKhoa.toLowerCase().trim();

        if (tuKhoaLower !== "") {
            var khớpSku = maSkuStr.toLowerCase().includes(tuKhoaLower);
            var khớpTen = tenSpStr.toLowerCase().includes(tuKhoaLower);
            var khớpViTri = viTriStr.toLowerCase().includes(tuKhoaLower);

            if (!khớpSku && !khớpTen && !khớpViTri) {
                continue;
            }
        }

        var dong = document.createElement("tr");

        if (sp.soLuong < 10) {
            dong.style.backgroundColor = "#f8d7da";
        }

        var oStt = document.createElement("td");
        oStt.innerText = stt++;

        var oSku = document.createElement("td");
        oSku.innerText = maSkuStr;

        var oTen = document.createElement("td");
        oTen.innerText = tenSpStr;

        var oViTri = document.createElement("td");
        oViTri.innerText = viTriStr;

        var oSoLuong = document.createElement("td");
        oSoLuong.innerText = sp.soLuong;

        var oTrangThai = document.createElement("td");
        if (sp.soLuong < 10) {
            oTrangThai.innerText = "Sắp hết!";
            oTrangThai.className = "text-danger";
        } else {
            oTrangThai.innerText = "An toàn";
            oTrangThai.className = "text-success";
        }

        dong.appendChild(oStt);
        dong.appendChild(oSku);
        dong.appendChild(oTen);
        dong.appendChild(oViTri);
        dong.appendChild(oSoLuong);
        dong.appendChild(oTrangThai);

        if (window.location.pathname.includes("admin.html")) {
            var oThaoTac = document.createElement("td");
            var nutXoa = document.createElement("button");
            nutXoa.innerText = "Xóa";
            nutXoa.className = "btn-danger";
            nutXoa.style.padding = "4px 8px";
            nutXoa.style.border = "none";
            nutXoa.style.borderRadius = "3px";
            nutXoa.style.cursor = "pointer";

            nutXoa.onclick = (function(index) {
                return function() {
                    danhSachKho.splice(index, 1);
                    var oTK = document.getElementById("searchInput");
                    veBangKho(oTK ? oTK.value : "");
                };
            })(i);

            oThaoTac.appendChild(nutXoa);
            dong.appendChild(oThaoTac);
        }

        bangBody.appendChild(dong);
    }
}

// 2. TÌM KIẾM REAL-TIME
var oTimKiem = document.getElementById("searchInput");
if (oTimKiem) {
    oTimKiem.addEventListener("input", function() {
        veBangKho(oTimKiem.value);
    });
}

// 3. TẢI DỮ LIỆU TỪ API TRONG FILE API.JS VÀ CHẠY
document.addEventListener("DOMContentLoaded", function() {
    // Gọi hàm từ file api.js
    fetchDanhSachKho().then(function(data) {
        danhSachKho = data;
        veBangKho();
    });
});
// Xử lý sự kiện form đăng nhập
var formLogin = document.getElementById("loginForm");
if (formLogin) {
    formLogin.addEventListener("submit", function(e) {
        e.preventDefault();
        var user = document.getElementById("username").value;
        var pass = document.getElementById("password").value;

        // Gọi hàm từ api.js để kiểm tra với CSDL
        guiyeuCauLogin(user, pass).then(function(res) {
            if (res.success) {
                alert("Đăng nhập thành công!");
                window.location.href = "admin.html"; // Chuyển sang trang admin
            } else {
                alert(res.message);
            }
        });
    });
}