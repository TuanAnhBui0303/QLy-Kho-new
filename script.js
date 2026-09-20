// 1. TẠO DỮ LIỆU MẶC ĐỊNH (3 SẢN PHẨM MẪU SẴN CÓ ĐỂ DEMO NGAY)
var danhSachKho = [
    { maSku: "SKU-9901", tenSp: "Đế cao su mẫu A", viTri: "Kệ A1 - Tầng 2", soLuong: 150 },
    { maSku: "SKU-4412", tenSp: "Keo dán chuyên dụng P66", viTri: "Kệ B3 - Tầng 1", soLuong: 45 },
    { maSku: "SKU-1049", tenSp: "Da bò nguyên tấm Nâu", viTri: "Kho C - Ô 12", soLuong: 5 }
];

// 2. HÀM VẼ BẢNG DỮ LIỆU
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

        if (window.location.pathname.includes("Admin.html")) {
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

// 3. TÌM KIẾM REAL-TIME
var oTimKiem = document.getElementById("searchInput");
if (oTimKiem) {
    oTimKiem.addEventListener("input", function() {
        veBangKho(oTimKiem.value);
    });
}

// 4. KHI TRANG TẢI XONG: VẼ BẢNG NGAY + NẾU CÓ SERVER THÌ MỚI LẤY THÊM DỮ LIỆU
document.addEventListener("DOMContentLoaded", function() {
    // Hiện ngay 3 sản phẩm mặc định ra màn hình
    veBangKho();

    // Nếu có chạy server thì lấy thêm/đè dữ liệu từ API, nếu không có server thì vẫn giữ 3 sản phẩm mẫu
    if (typeof fetchDanhSachKho === "function") {
        fetchDanhSachKho().then(function(data) {
            if (data && data.length > 0) {
                danhSachKho = data;
                veBangKho();
            }
        });
    }
});

// 5. XỬ LÝ FORM THÊM HÀNG (DÀNH CHO TRANG ADMIN)
var formInventory = document.getElementById("inventoryForm");
if (formInventory) {
    formInventory.addEventListener("submit", function(e) {
        e.preventDefault();
        var skuVal = document.getElementById("sku").value;
        var nameVal = document.getElementById("productName").value;
        var typeVal = document.getElementById("type").value;
        var qtyVal = parseInt(document.getElementById("quantity").value) || 1;

        // Tìm xem sản phẩm đã có chưa
        var tonTai = false;
        for (var i = 0; i < danhSachKho.length; i++) {
            if (danhSachKho[i].maSku === skuVal) {
                if (typeVal === "IN") {
                    danhSachKho[i].soLuong += qtyVal;
                } else {
                    danhSachKho[i].soLuong = Math.max(0, danhSachKho[i].soLuong - qtyVal);
                }
                tonTai = true;
                break;
            }
        }

        // Nếu chưa có thì thêm mới
        if (!tonTai) {
            danhSachKho.push({
                maSku: skuVal,
                tenSp: nameVal,
                viTri: "Kệ mới",
                soLuong: typeVal === "IN" ? qtyVal : 0
            });
        }

        veBangKho();
        formInventory.reset();
    });
}

// 6. XỬ LÝ XUẤT FILE EXCEL
var btnExcel = document.getElementById("btnExportExcel");
if (btnExcel) {
    btnExcel.addEventListener("click", function() {
        if (!danhSachKho || danhSachKho.length === 0) {
            alert("Hiện chưa có dữ liệu tồn kho để xuất file!");
            return;
        }

        var excelData = danhSachKho.map(function(item, index) {
            return {
                "STT": index + 1,
                "Mã SKU": item.maSku || "",
                "Tên Sản Phẩm": item.tenSp || "",
                "Vị Trí": item.viTri || "Chưa xếp",
                "Số Lượng Tồn": item.soLuong,
                "Trạng Thái": item.soLuong < 10 ? "Sắp hết!" : "An toàn"
            };
        });

        var worksheet = XLSX.utils.json_to_sheet(excelData);
        var workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "BaoCaoTonKho");

        XLSX.writeFile(workbook, "Bao_Cao_Ton_Kho_Realtime.xlsx");
    });
}