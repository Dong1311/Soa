import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import addIcon from '../../../assets/images/Function/Add.png';
import deleteIcon from '../../../assets/images/Function/DeleteFile.png';
import editIcon from '../../../assets/images/Function/ChinhSua.png';
import infoIcon from '../../../assets/images/Function/info.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const DanhSachBienBanBanGiao = () => {
  const [bienBanList, setBienBanList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchBienBans = () => {
    fetch(`/api/bien-ban-ban-giao?search=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        setBienBanList(data);
      })
      .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
  };

  useEffect(() => {
    fetchBienBans();
  }, [searchTerm]);

  const handleEditBienBan = (bienBanId) => {
    navigate(`/bien-ban-ban-giao/${bienBanId}`);
  };

  const handleDeleteBienBan = (bienBanId) => {
    if (window.confirm('Bạn có chắc muốn xóa biên bản này không?')) {
      fetch(`/api/bien-ban-ban-giao/${bienBanId}`, { method: 'DELETE' })
        .then(() => {
          setBienBanList(bienBanList.filter(bienBan => bienBan.id !== bienBanId));
        })
        .catch(error => console.error('Lỗi khi xóa biên bản:', error));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="d-flex align-items-center">
          <img src={infoIcon} alt="info" width="30" className="me-2" />
          Biên bản bàn giao
        </h5>
      </div>

      <h6 className="text-start mb-3">Danh sách biên bản bàn giao</h6>

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
          <button className="btn btn-outline-secondary">
            <i className="bi bi-search"></i> {/* Biểu tượng tìm kiếm */}
          </button>
        </div>

        <button className="btn btn-light" onClick={() => navigate('/bien-ban-ban-giao/add')}>
          <img src={addIcon} alt="Thêm" width="20" />
        </button>
      </div>

      <table className="table table-striped table-hover align-middle">
        <thead style={{ backgroundColor: '#2289E7', color: '#fff' }}>
          <tr>
            <th scope="col"><input type="checkbox" /></th>
            <th scope="col">STT</th>
            <th scope="col">Số biên bản</th>
            <th scope="col">Tiêu đề biên bản</th>
            <th scope="col">Ngày tạo</th>
            <th scope="col">Căn cứ</th>
            <th scope="col">Đơn vị nộp lưu</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bienBanList.map((bienBan, index) => (
            <tr key={bienBan.id}>
              <td><input type="checkbox" /></td>
              <td>{index + 1}</td>
              <td>{bienBan.soBienBan}</td>
              <td>
                <Link to={`/bien-ban-ban-giao/${bienBan.id}`} style={{ color: '#043371' }}>
                  {bienBan.tieuDe}
                </Link>
              </td>
              <td>{new Date(bienBan.ngayLap).toLocaleDateString()}</td>
              <td>{bienBan.canCu ? bienBan.canCu.tieuDe : 'N/A'}</td>
              <td>{bienBan.donViNopLuu ? bienBan.donViNopLuu.tenPhongBan : 'N/A'}</td>

              <td>
                <span style={getTrangThaiStyle(bienBan.trangThaiBienBan)}>
                  {bienBan.trangThaiBienBan}
                </span>
              </td>
              <td>
                <button className="btn btn-light me-2" onClick={() => handleEditBienBan(bienBan.id)}  disabled={!(bienBan.trangThaiBienBan === 'Tạo mới' )}>
                  <img src={editIcon} alt="Chỉnh sửa" width="20" />
                </button>
                <button className="btn btn-light" onClick={() => handleDeleteBienBan(bienBan.id)}>
                  <img src={deleteIcon} alt="Xóa" width="20" />
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
    case 'Đã gửi duyệt':
      backgroundColor = '#ffc107';
      break;
    case 'Đã nhận':
      backgroundColor = '#28a745';
      break;
    case 'Từ chối':
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
    minWidth: '110px',
    textAlign: 'center',
  };
};

export default DanhSachBienBanBanGiao;