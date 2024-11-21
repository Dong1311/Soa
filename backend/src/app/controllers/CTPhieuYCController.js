const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CTPhieuYCController {
  getThongKe = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Lọc theo ngày nếu có
      const whereCondition = {};
      if (startDate) {
        whereCondition.PhieuYCKhaiThacSuDung = {
          khaiThacTuNgay: { gte: new Date(startDate) },
        };
      }
      if (endDate) {
        whereCondition.PhieuYCKhaiThacSuDung = {
          ...whereCondition.PhieuYCKhaiThacSuDung,
          khaiThacDenNgay: { lte: new Date(endDate) },
        };
      }

      // Lấy dữ liệu từ bảng CTPhieuYCKhaiThacSuDung, kết hợp với PhieuYCKhaiThacSuDung và HoSo
      const danhSach = await prisma.cTPhieuYCKhaiThacSuDung.findMany({
        where: whereCondition,
        include: {
          HoSo: true, // Lấy thông tin hồ sơ
          PhieuYCKhaiThacSuDung: true, // Lấy thông tin ngày khai thác
        },
      });

      // Gom nhóm và tính tổng số lượt khai thác
      const thongKeMap = {};
      danhSach.forEach((item) => {
        const maHoSo = item.HoSo?.maHoSo || "N/A";
        if (!thongKeMap[maHoSo]) {
          thongKeMap[maHoSo] = {
            maHoSo,
            tieuDeHoSo: item.HoSo?.tieuDeHoSo || "N/A",
            soLuotKhaiThac: 0,
          };
        }
        thongKeMap[maHoSo].soLuotKhaiThac += 1; // Tính tổng số lượt khai thác
      });

      // Chuyển dữ liệu từ map sang array
      const thongKe = Object.values(thongKeMap).map((item, index) => ({
        stt: index + 1,
        ...item,
      }));

      // Trả về kết quả
      res.status(200).json({ data: thongKe });
    } catch (error) {
      console.error("Error fetching Thong Ke:", error);
      res.status(500).json({ message: "Lỗi khi lấy thống kê", error });
    }
  };
}

module.exports = new CTPhieuYCController();