import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import addIcon from '../../../assets/images/Function/Add.png';
import deleteIcon from '../../../assets/images/Function/DeleteFile.png';
import editIcon from '../../../assets/images/Function/ChinhSua.png';
import infoIcon from '../../../assets/images/Function/info.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const DanhSachTaiLieu = () => {
  const [taiLieuList, setTaiLieuList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchTaiLieus = async () => {
    try {
      const response = await fetch(`/api/tai-lieu?search=${searchTerm}`);
      const data = await response.json();
  
      // Lấy tên và trạng thái hồ sơ cho mỗi tài liệu và lọc theo trạng thái hồ sơ mong muốn
      const updatedData = await Promise.all(
        data.map(async (taiLieu) => {
          const hoSoResponse = await fetch(`/api/ho-so/${taiLieu.hoSoId}/name-status`);
          const hoSoData = await hoSoResponse.json();
          
          // Kiểm tra nếu trạng thái của hồ sơ thuộc các trạng thái yêu cầu
          if (["Tạo mới", "Đã trình duyệt", "Cần thu thập lại", "Từ chối NLLS"].includes(hoSoData.trangThai)) {
            return {
              ...taiLieu,
              tenHoSo: hoSoData.tenHoSo || 'Không tìm thấy',
              trangThaiHoSo: hoSoData.trangThai || 'Không xác định'
            };
          }
          return null; // Loại bỏ tài liệu nếu không thỏa mãn điều kiện trạng thái hồ sơ
        })
      );
  
      // Loại bỏ các giá trị null trong mảng kết quả sau khi lọc
      setTaiLieuList(updatedData.filter((item) => item !== null));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  useEffect(() => {
    fetchTaiLieus();
  }, [searchTerm]);

  const handleEditTaiLieu = (taiLieuId) => {
    navigate(`/tai-lieu/${taiLieuId}`);
  };

  const handleDeleteTaiLieu = (taiLieuId) => {
    if (window.confirm('Bạn có chắc muốn xóa tài liệu này không?')) {
      fetch(`/api/tai-lieu/${taiLieuId}`, { method: 'DELETE' })
        .then(() => {
          setTaiLieuList(taiLieuList.filter(taiLieu => taiLieu.id !== taiLieuId));
        })
        .catch(error => console.error('Lỗi khi xóa tài liệu:', error));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="d-flex align-items-center">
          <img src={infoIcon} alt="info" width="30" className="me-2" />
          Quản lý tài liệu
        </h5>
      </div>

      <h6 className="text-start mb-3">Danh sách tài liệu</h6>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <input 
            type="text" 
            className="form-control me-2" 
            placeholder="Tìm kiếm..." 
            style={{ width: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-light" onClick={() => navigate('/tai-lieu/add')}>
          <img src={addIcon} alt="add" width="20" />
        </button>
      </div>

      <table className="table table-striped table-hover align-middle">
        <thead style={{ backgroundColor: '#2289E7', color: '#fff' }}>
          <tr>
            <th scope="col">
              <input type="checkbox" />
            </th>
            <th scope="col">STT</th>
            <th scope="col">Mã định danh</th>
            <th scope="col">Hồ sơ</th>
            <th scope="col">Trích yếu nội dung</th>
            <th scope="col">Ngày tháng năm VB</th>
            <th scope="col">Cơ quan ban hành</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {taiLieuList.map((taiLieu, index) => (
            <tr key={taiLieu.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{index + 1}</td>
              <td>{taiLieu.maDinhDanhVanBan}</td>
              <td>{taiLieu.tenHoSo}</td> {/* Hiển thị tên hồ sơ */}
              <td>{taiLieu.trichYeuNoiDung}</td>
              <td>{new Date(taiLieu.ngayThangNamVB).toLocaleDateString()}</td>
              <td>{taiLieu.tenCoQuanBanHanh}</td>
              <td>
                <span style={getTrangThaiStyle(taiLieu.trangThaiHoSo)}>
                  {taiLieu.trangThaiHoSo} {/* Hiển thị trạng thái hồ sơ */}
                </span>
              </td>
              <td>
                <button className="btn btn-light me-2" onClick={() => handleEditTaiLieu(taiLieu.id)}>
                  <img src={editIcon} alt="edit" width="20" />
                </button>
                <button className="btn btn-light" onClick={() => handleDeleteTaiLieu(taiLieu.id)}>
                  <img src={deleteIcon} alt="delete" width="20" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getTrangThaiStyle = (trangThai) => {
  let backgroundColor = '';
  let color = '#fff';
  switch (trangThai) {
    case 'Tạo mới':
      backgroundColor = '#2289E7';
      break;
    case 'Đã trình duyệt':
      backgroundColor = '#ffc107';
      break;
    case 'Đã duyệt':
      backgroundColor = '#28a745';
      break;
    case 'Từ chối NLLS':
      backgroundColor = '#dc3545';
      break;
    default:
      backgroundColor = '#6c757d';
      break;
  }

  return {
    backgroundColor,
    color,
    padding: '5px 10px',
    borderRadius: '8px',
    display: 'inline-block',
    fontWeight: '400',
    fontSize: '14px',
    minWidth: '80px',
    textAlign: 'center',
  };
};

export default DanhSachTaiLieu;