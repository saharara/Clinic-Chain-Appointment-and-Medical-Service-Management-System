import { useMemo, useState } from 'react'
import {
  Activity,
  Building2,
  Calendar,
  ClipboardList,
  DollarSign,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react'
import medicalLogoImage from './assets/medical-logo-cutout.png'
import medicalTeamImage from './assets/medical-team-cutout.png'
import './App.css'

const BACKEND_URL = 'http://127.0.0.1:8000'

const INITIAL_PATIENT_ACCOUNTS = [
  {
    MaBenhAn: 'BN001',
    HoTen: 'Trần Quang Hải',
    NgaySinh: '1995-04-12',
    GioiTinh: 'Nam',
    CCCD: '001095012345',
    SDT: '0901234567',
    DiaChi: 'Cầu Giấy, Hà Nội',
    MaSoBHYT: 'DN4010123456789',
    KyTuDauBHYT: 'DN',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN002',
    HoTen: 'Nguyễn Thị Mai',
    NgaySinh: '2000-09-20',
    GioiTinh: 'Nữ',
    CCCD: '001200054321',
    SDT: '0907654321',
    DiaChi: 'Hai Bà Trưng, Hà Nội',
    MaSoBHYT: '',
    KyTuDauBHYT: '',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN003',
    HoTen: 'Phạm Lê Minh',
    NgaySinh: '2021-01-15',
    GioiTinh: 'Nam',
    CCCD: '001221098765',
    SDT: '0911999888',
    DiaChi: 'Đống Đa, Hà Nội',
    MaSoBHYT: 'TE1010999888777',
    KyTuDauBHYT: 'TE',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN004',
    HoTen: 'Lê Hoàng Nam',
    NgaySinh: '1986-03-04',
    GioiTinh: 'Nam',
    CCCD: '001186000004',
    SDT: '0904000004',
    DiaChi: 'Nam Từ Liêm, Hà Nội',
    MaSoBHYT: 'DN401000000004',
    KyTuDauBHYT: 'DN',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN005',
    HoTen: 'Đỗ Minh Châu',
    NgaySinh: '1987-05-11',
    GioiTinh: 'Nữ',
    CCCD: '001187000005',
    SDT: '0905000005',
    DiaChi: 'Thanh Xuân, Hà Nội',
    MaSoBHYT: '',
    KyTuDauBHYT: '',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN006',
    HoTen: 'Vũ Gia Hân',
    NgaySinh: '1988-06-22',
    GioiTinh: 'Nữ',
    CCCD: '001188000006',
    SDT: '0906000006',
    DiaChi: 'Ba Đình, Hà Nội',
    MaSoBHYT: 'HT401000000006',
    KyTuDauBHYT: 'HT',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN007',
    HoTen: 'Hoàng Đức Anh',
    NgaySinh: '1989-02-17',
    GioiTinh: 'Nam',
    CCCD: '001189000007',
    SDT: '0907000007',
    DiaChi: 'Cầu Giấy, Hà Nội',
    MaSoBHYT: 'DN401000000007',
    KyTuDauBHYT: 'DN',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN008',
    HoTen: 'Phan Ngọc Linh',
    NgaySinh: '1990-07-29',
    GioiTinh: 'Nữ',
    CCCD: '001190000008',
    SDT: '0908000008',
    DiaChi: 'Đống Đa, Hà Nội',
    MaSoBHYT: '',
    KyTuDauBHYT: '',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN009',
    HoTen: 'Bùi Quang Huy',
    NgaySinh: '1991-08-13',
    GioiTinh: 'Nam',
    CCCD: '001191000009',
    SDT: '0909000009',
    DiaChi: 'Long Biên, Hà Nội',
    MaSoBHYT: 'DN401000000009',
    KyTuDauBHYT: 'DN',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN010',
    HoTen: 'Đặng Khánh Vy',
    NgaySinh: '1992-10-03',
    GioiTinh: 'Nữ',
    CCCD: '001192000010',
    SDT: '0910000010',
    DiaChi: 'Hai Bà Trưng, Hà Nội',
    MaSoBHYT: 'TE101000000010',
    KyTuDauBHYT: 'TE',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN011',
    HoTen: 'Ngô Tuấn Kiệt',
    NgaySinh: '1993-11-18',
    GioiTinh: 'Nam',
    CCCD: '001193000011',
    SDT: '0911000011',
    DiaChi: 'Hoàn Kiếm, Hà Nội',
    MaSoBHYT: '',
    KyTuDauBHYT: '',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN012',
    HoTen: 'Mai Phương Anh',
    NgaySinh: '1994-12-08',
    GioiTinh: 'Nữ',
    CCCD: '001194000012',
    SDT: '0912000012',
    DiaChi: 'Tây Hồ, Hà Nội',
    MaSoBHYT: 'DN401000000012',
    KyTuDauBHYT: 'DN',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN013',
    HoTen: 'Cao Nhật Minh',
    NgaySinh: '1995-01-25',
    GioiTinh: 'Nam',
    CCCD: '001195000013',
    SDT: '0913000013',
    DiaChi: 'Hoàng Mai, Hà Nội',
    MaSoBHYT: '',
    KyTuDauBHYT: '',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN014',
    HoTen: 'Tạ Thu Trang',
    NgaySinh: '1996-04-09',
    GioiTinh: 'Nữ',
    CCCD: '001196000014',
    SDT: '0914000014',
    DiaChi: 'Hà Đông, Hà Nội',
    MaSoBHYT: 'DN401000000014',
    KyTuDauBHYT: 'DN',
    MatKhau: '123456',
  },
  {
    MaBenhAn: 'BN015',
    HoTen: 'Lương Quốc Hưng',
    NgaySinh: '1997-09-14',
    GioiTinh: 'Nam',
    CCCD: '001197000015',
    SDT: '0915000015',
    DiaChi: 'Gia Lâm, Hà Nội',
    MaSoBHYT: 'HT401000000015',
    KyTuDauBHYT: 'HT',
    MatKhau: '123456',
  },
]

function InputField({ label, placeholder, icon, type = 'text', value, onChange }) {
  const Icon = icon

  return (
    <label className="field-group">
      <span className="field-label">{label}</span>
      <span className="input-shell">
        <Icon size={18} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />
      </span>
    </label>
  )
}

export default function App() {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('patient')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [hoTen, setHoTen] = useState('')
  const [cccdDangKy, setCccdDangKy] = useState('')
  const [sdtDangKy, setSdtDangKy] = useState('')
  const [ngaySinh, setNgaySinh] = useState('')
  const [gioiTinh, setGioiTinh] = useState('Nam')
  const [diaChi, setDiaChi] = useState('')
  const [maBHYT, setMaBHYT] = useState('')
  const [kyTuBHYT, setKyTuBHYT] = useState('')
  const [matKhauDangKy, setMatKhauDangKy] = useState('')
  const [xacNhanMatKhauDangKy, setXacNhanMatKhauDangKy] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [patientAccounts, setPatientAccounts] = useState(INITIAL_PATIENT_ACCOUNTS)

  const handleLogin = async (event) => {
    event.preventDefault()

    if (role === 'admin' && username === 'admin' && password === 'admin123') {
      setCurrentUser({ name: 'Quản trị viên hệ thống', id: 'admin' })
      setMode('admin')
      return
    }

    const normalizedUsername = username.trim()
    const mockPatient = patientAccounts.find(
      (patient) => role === 'patient' && patient.CCCD === normalizedUsername && patient.MatKhau === password,
    )

    if (mockPatient) {
      setCurrentUser({
        ...mockPatient,
        name: mockPatient.HoTen,
        id: mockPatient.CCCD,
      })
      setMode('patient')
      return
    }

    const mockReceptionists = [
      {
        id: 'LT001',
        name: 'Phạm Minh Thư',
        MatKhau: '123456',
        MaChiNhanh: 'CN_CG',
        TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      },
      {
        id: 'LT002',
        name: 'Nguyễn Hoàng Yến',
        MatKhau: '123456',
        MaChiNhanh: 'CN_HBT',
        TenChiNhanh: 'Smart Clinic - Cơ sở Hai Bà Trưng',
      },
    ]
    const mockReceptionist = mockReceptionists.find(
      (receptionist) =>
        role === 'letan' && receptionist.id === username && receptionist.MatKhau === password,
    )

    if (mockReceptionist) {
      setCurrentUser(mockReceptionist)
      setMode('letan')
      return
    }

    const mockTechnicians = [
      {
        id: 'XNV001',
        name: 'Trần Văn Cường',
        MatKhau: '123456',
        MaChiNhanh: 'CN_CG',
        TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      },
      {
        id: 'XNV002',
        name: 'Vũ Hồng Ngọc',
        MatKhau: '123456',
        MaChiNhanh: 'CN_HBT',
        TenChiNhanh: 'Smart Clinic - Cơ sở Hai Bà Trưng',
      },
    ]
    const mockTechnician = mockTechnicians.find(
      (technician) =>
        role === 'xnv' && technician.id === username && technician.MatKhau === password,
    )

    if (mockTechnician) {
      setCurrentUser(mockTechnician)
      setMode('xnv')
      return
    }

    const mockDoctors = [
      {
        id: 'BS001',
        MaBacSi: 'BS001',
        name: 'Nguyễn Văn An',
        HoTen: 'Nguyễn Văn An',
        ChuyenKhoa: 'Nội tổng quát',
        SDT: '0911222333',
        MatKhau: '123456',
        MaChiNhanh: 'CN_CG',
        TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      },
      {
        id: 'BS002',
        MaBacSi: 'BS002',
        name: 'Lê Thị Bình',
        HoTen: 'Lê Thị Bình',
        ChuyenKhoa: 'Răng hàm mặt',
        SDT: '0922333444',
        MatKhau: '123456',
        MaChiNhanh: 'CN_CG',
        TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      },
      {
        id: 'BS015',
        MaBacSi: 'BS015',
        name: 'Võ Thị Sáu',
        HoTen: 'Võ Thị Sáu',
        ChuyenKhoa: 'Tai mũi họng',
        SDT: '0936789012',
        MatKhau: '123456',
        MaChiNhanh: 'CN_HBT',
        TenChiNhanh: 'Smart Clinic - Cơ sở Hai Bà Trưng',
      },
    ]
    const mockDoctor = mockDoctors.find(
      (doctor) => role === 'doctor' && doctor.id === username && doctor.MatKhau === password,
    )

    if (mockDoctor) {
      setCurrentUser(mockDoctor)
      setMode('doctor')
      return
    }

    let endpoint = ''
    let payload = {}

    if (role === 'patient') {
      endpoint = '/auth/login-patient'
      payload = { cccd: normalizedUsername, password }
    } else if (role === 'doctor') {
      endpoint = '/auth/login-doctor'
      payload = { MaBacSi: username, password }
    } else if (role === 'letan') {
      endpoint = '/auth/login-le-tan'
      payload = { MaLeTan: username, password }
    } else if (role === 'xnv') {
      endpoint = '/auth/login_xet_nghiem_vien'
      payload = { MaXetNghiemVien: username, password }
    } else if (role === 'admin') {
      endpoint = '/auth/login_admin'
      payload = { username, password }
    }

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

		      if (response.ok) {
        const fallbackPatient = patientAccounts.find(
          (patient) => role === 'patient' && patient.CCCD === normalizedUsername,
        )
        const fallbackReceptionist = mockReceptionists.find(
          (receptionist) => role === 'letan' && receptionist.id === username,
        )
        const fallbackTechnician = mockTechnicians.find(
          (technician) => role === 'xnv' && technician.id === username,
        )
        const fallbackDoctor = mockDoctors.find(
          (doctor) => role === 'doctor' && doctor.id === username,
        )
		        setCurrentUser({
          name:
            data?.HoTen ||
            data?.name ||
            fallbackPatient?.HoTen ||
            fallbackReceptionist?.name ||
            fallbackTechnician?.name ||
            fallbackDoctor?.name ||
            username,
          id: role === 'patient' ? normalizedUsername : username,
          MaBenhAn: data?.MaBenhAn || data?.ma_benh_an || fallbackPatient?.MaBenhAn,
          HoTen: data?.HoTen || data?.hoten || fallbackPatient?.HoTen || fallbackDoctor?.HoTen,
          NgaySinh: data?.NgaySinh || data?.ngaysinh || fallbackPatient?.NgaySinh,
          GioiTinh: data?.GioiTinh || data?.gioitinh || fallbackPatient?.GioiTinh,
          CCCD: data?.CCCD || data?.cccd || fallbackPatient?.CCCD,
          DiaChi: data?.DiaChi || data?.diachi || fallbackPatient?.DiaChi,
          MaSoBHYT: data?.MaSoBHYT || data?.ma_so_bhyt || fallbackPatient?.MaSoBHYT,
          KyTuDauBHYT: data?.KyTuDauBHYT || data?.ky_tu_bhyt || fallbackPatient?.KyTuDauBHYT,
          MaBacSi: fallbackDoctor?.MaBacSi,
          ChuyenKhoa: fallbackDoctor?.ChuyenKhoa,
          SDT: data?.SDT || data?.sdt || fallbackPatient?.SDT || fallbackDoctor?.SDT,
          MatKhau: password,
          ...(fallbackReceptionist || fallbackTechnician || fallbackDoctor
            ? {
                MaChiNhanh:
                  fallbackReceptionist?.MaChiNhanh ||
                  fallbackTechnician?.MaChiNhanh ||
                  fallbackDoctor?.MaChiNhanh,
                TenChiNhanh:
                  fallbackReceptionist?.TenChiNhanh ||
                  fallbackTechnician?.TenChiNhanh ||
                  fallbackDoctor?.TenChiNhanh,
              }
            : {}),
        })
		        setMode(role)
		      } else {
        alert(`Đăng nhập thất bại: ${data.detail || 'Sai tài khoản hoặc mật khẩu'}`)
      }
    } catch {
      alert('Không thể kết nối đến Backend FastAPI! Bạn đã bật Uvicorn chưa?')
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    if (matKhauDangKy !== xacNhanMatKhauDangKy) {
      alert('Mật khẩu xác nhận không trùng khớp, vui lòng kiểm tra lại!')
      return
    }

    if (patientAccounts.some((patient) => patient.CCCD === cccdDangKy.trim())) {
      alert('Số CCCD này đã tồn tại trong hệ thống, vui lòng đăng nhập hoặc kiểm tra lại!')
      return
    }

    const payload = {
      hoten: hoTen,
      cccd: cccdDangKy,
      ngaysinh: ngaySinh,
      gioitinh: gioiTinh,
      sdt: sdtDangKy,
      matkhau: matKhauDangKy,
      diachi: diaChi,
      ma_so_bhyt: maBHYT || null,
      ky_tu_bhyt: kyTuBHYT || null,
    }

    try {
      const response = await fetch(`${BACKEND_URL}/patient/register-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setPatientAccounts((current) => [
          ...current,
          {
            MaBenhAn: `BN${String(current.length + 1).padStart(3, '0')}`,
            HoTen: hoTen.trim(),
            NgaySinh: ngaySinh,
            GioiTinh: gioiTinh,
            CCCD: cccdDangKy.trim(),
            SDT: sdtDangKy.trim(),
            DiaChi: diaChi.trim(),
            MaSoBHYT: maBHYT.trim(),
            KyTuDauBHYT: kyTuBHYT.trim().toUpperCase(),
            MatKhau: matKhauDangKy,
          },
        ])
        alert('Đăng ký tài khoản Bệnh nhân thành công! Mời bạn đăng nhập.')
        setUsername(cccdDangKy.trim())
        setPassword('')
        setMode('login')
      } else {
        const errorData = await response.json()
        alert(`Đăng ký thất bại: ${errorData.detail || 'Dữ liệu không hợp lệ'}`)
      }
    } catch {
      alert('Lỗi kết nối máy chủ khi đăng ký!')
    }
  }

	  const handleLogout = () => {
	    setCurrentUser(null)
	    setUsername('')
    setPassword('')
    setXacNhanMatKhauDangKy('')
    setMode('login')
	    setRole('patient')
	  }

	  const handleUpdateCurrentUser = (updatedFields) => {
	    setCurrentUser((current) => (current ? { ...current, ...updatedFields } : current))
	  }

	  if (mode === 'admin') return <AdminDashboard user={currentUser} onLogout={handleLogout} />
	  if (mode === 'doctor') return <DoctorDashboard user={currentUser} onLogout={handleLogout} />
	  if (mode === 'letan') return <ReceptionistDashboard user={currentUser} onLogout={handleLogout} />
	  if (mode === 'xnv') return <TechnicianDashboard user={currentUser} onLogout={handleLogout} />
	  if (mode === 'patient') return <PatientDashboard user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateCurrentUser} />

  return (
    <main className="page-shell">
      <section className="auth-wrapper">
        <div className="auth-layout">
          <div className="form-panel">
            <div className="brand-header">
              <img className="brand-logo" src={medicalLogoImage} alt="Logo Medicare" />
              <span className="brand-name">Medicare</span>
            </div>

            <div className="tab-row">
              <button
                type="button"
                className={`tab-button ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={`tab-button ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Đăng ký
              </button>
            </div>

            {mode === 'login' && (
              <form className="auth-form" onSubmit={handleLogin}>
                <label className="field-group">
                  <span className="field-label">Vai trò đăng nhập</span>
                  <select
                    className="admin-input"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                  >
                    <option value="patient">Bệnh nhân</option>
                    <option value="doctor">Bác sĩ chuyên khoa</option>
                    <option value="letan">Lễ tân tiếp đón</option>
                    <option value="xnv">Xét nghiệm viên</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </label>

                <InputField
                  label={role === 'patient' ? 'Căn cước công dân (CCCD)' : 'Mã đăng nhập hệ thống'}
                  placeholder={role === 'patient' ? 'Nhập 12 số CCCD' : 'Nhập tài khoản của bạn'}
                  icon={UserRound}
                  value={username}
                  onChange={setUsername}
                />
                <InputField
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={setPassword}
                />

                <button type="submit" className="submit-button">
                  Đăng nhập
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form className="auth-form" onSubmit={handleRegister}>
                <InputField
                  label="Họ và tên bệnh nhân"
                  placeholder="Nhập họ và tên"
                  icon={UserRound}
                  value={hoTen}
                  onChange={setHoTen}
                />
                <InputField
                  label="Số Căn cước công dân"
                  placeholder="Nhập 12 số CCCD"
                  icon={UserRound}
                  value={cccdDangKy}
                  onChange={setCccdDangKy}
                />
                <InputField
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  icon={Phone}
                  value={sdtDangKy}
                  onChange={setSdtDangKy}
                />
                <InputField
                  label="Ngày sinh"
                  placeholder="YYYY-MM-DD"
                  icon={Calendar}
                  type="date"
                  value={ngaySinh}
                  onChange={setNgaySinh}
                />

                <label className="field-group">
                  <span className="field-label">Giới tính</span>
                  <select
                    className="admin-input"
                    value={gioiTinh}
                    onChange={(event) => setGioiTinh(event.target.value)}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </label>

                <InputField
                  label="Địa chỉ cư trú"
                  placeholder="Nhập địa chỉ"
                  icon={MapPin}
                  value={diaChi}
                  onChange={setDiaChi}
                />
                <InputField
                  label="Mã số BHYT (nếu có)"
                  placeholder="Nhập số thẻ BHYT"
                  icon={Mail}
                  value={maBHYT}
                  onChange={setMaBHYT}
                />
                <InputField
                  label="Ký tự đầu BHYT (TE/DN/HT)"
                  placeholder="Ví dụ: DN"
                  icon={Mail}
                  value={kyTuBHYT}
                  onChange={setKyTuBHYT}
                />
                <InputField
                  label="Tạo mật khẩu hệ thống"
                  placeholder="Nhập mật khẩu"
                  icon={Lock}
                  type="password"
                  value={matKhauDangKy}
                  onChange={setMatKhauDangKy}
                />
                <InputField
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  icon={Lock}
                  type="password"
                  value={xacNhanMatKhauDangKy}
                  onChange={setXacNhanMatKhauDangKy}
                />

                <button type="submit" className="submit-button">
                  Đăng ký tài khoản
                </button>
              </form>
            )}
          </div>

          <div className="visual-panel" aria-hidden="true">
            <div className="visual-card">
              <div className="wave-shape" />
              <div className="visual-content">
                <img className="visual-image" src={medicalTeamImage} alt="Đội ngũ y tế" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function AdminDashboard({ user, onLogout }) {
  const [branches, setBranches] = useState([
    {
      MaChiNhanh: 'CN_CG',
      TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      DiaChi: 'Số 1 Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
      SDT: '0241234567',
    },
    {
      MaChiNhanh: 'CN_HBT',
      TenChiNhanh: 'Smart Clinic - Cơ sở Hai Bà Trưng',
      DiaChi: 'Số 99 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
      SDT: '0247654321',
    },
  ])
  const [branchForm, setBranchForm] = useState({
    MaChiNhanh: '',
    TenChiNhanh: '',
    DiaChi: '',
    SDT: '',
  })

  const [services, setServices] = useState([
    { MaDichVu: 'DV_KHAM_NOI', TenDichVu: 'Khám Nội Tổng Quát', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_GIA_DINH', TenDichVu: 'Khám Sức Khỏe Gia Đình', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 250000 },
    { MaDichVu: 'DV_KHAM_LAO_KHOA', TenDichVu: 'Khám Tư Vấn Sức Khỏe Lão Khoa', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_TIM_MACH', TenDichVu: 'Khám Sàng Lọc Tim Mạch - Huyết Áp', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_KHAM_TIEU_HOA', TenDichVu: 'Khám Tiêu Hóa - Gan Mật', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_HO_HAP', TenDichVu: 'Khám Bệnh Lý Đường Hô Hấp', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 170000 },
    { MaDichVu: 'DV_KHAM_NOI_TIET', TenDichVu: 'Khám Sàng Lọc Tiểu Đường & Nội Tiết', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 220000 },
    { MaDichVu: 'DV_KHAM_DINH_DUONG', TenDichVu: 'Khám Tư Vấn Dinh Dưỡng Chuyên Sâu', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DT_TRUYEN_DICH', TenDichVu: 'Liệu trình truyền dịch giải độc, bù nước', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Điều trị', GiaGoc: 250000 },
    { MaDichVu: 'DT_TIEM_KHANG_SINH', TenDichVu: 'Dịch vụ tiêm thuốc/kháng sinh theo chỉ định', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Điều trị', GiaGoc: 80000 },
    { MaDichVu: 'DV_KHAM_RANG', TenDichVu: 'Khám Răng Hàm Mặt Định Kỳ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_LAY_CAO', TenDichVu: 'Lấy Cao Răng Và Đánh Bóng Thẩm Mỹ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_NIENG_RANG', TenDichVu: 'Khám Tư Vấn Chỉnh Nha/Niềng Răng', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 300000 },
    { MaDichVu: 'DV_KHAM_IMPLANT', TenDichVu: 'Khám Tư Vấn Trồng Răng Implant', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 300000 },
    { MaDichVu: 'DT_HAN_RANG', TenDichVu: 'Hàn Răng Composite Thẩm Mỹ (1 Răng)', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 300000 },
    { MaDichVu: 'DT_RANG_TUY', TenDichVu: 'Liệu Trình Điều Trị Tủy Răng Toàn Diện', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 1200000 },
    { MaDichVu: 'DT_NHO_RANG_KHON', TenDichVu: 'Phẫu Thuật Nhổ Răng Khôn Mọc Lệch', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 1000000 },
    { MaDichVu: 'DT_TAY_TRANG', TenDichVu: 'Tẩy Trắng Răng Công Nghệ Laser', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 2000000 },
    { MaDichVu: 'DV_KHAM_TMH', TenDichVu: 'Khám Tai Mũi Họng Thông Thường', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_NOI_SOI_TMH', TenDichVu: 'Nội Soi Tai Mũi Họng Ống Mềm', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 250000 },
    { MaDichVu: 'DV_KHAM_THINH_LUC', TenDichVu: 'Khám Đo Thính Lực Đơn Âm', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DT_KHIDUNG', TenDichVu: 'Liệu Trình Khí Dung Mũi Họng', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 450000 },
    { MaDichVu: 'DT_VIEM_AMIDAN', TenDichVu: 'Liệu Trình Điều Trị Viêm Amidan Hạt', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 600000 },
    { MaDichVu: 'DT_RUA_XOANG', TenDichVu: 'Hút Mủ Và Chọc Rửa Xoang Điều Trị', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 350000 },
    { MaDichVu: 'DT_LAY_DI_VAT', TenDichVu: 'Thủ Thuật Lấy Dị Vật Vùng Tai/Mũi/Họng', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 400000 },
    { MaDichVu: 'XN_MAU', TenDichVu: 'Xét Nghiệm Công Thức Máu 24 Chỉ Số', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 250000 },
    { MaDichVu: 'SA_O_BUNG', TenDichVu: 'Siêu Âm Ổ Bụng Tổng Quát', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 300000 },
    { MaDichVu: 'XN_NUOC_TIEU', TenDichVu: 'Xét Nghiệm Nước Tiểu Toàn Bộ (10 Thông Số)', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 120000 },
    { MaDichVu: 'XN_SINH_HOA', TenDichVu: 'Xét Nghiệm Sinh Hóa Máu (Gan, Thận, Mỡ Máu)', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 350000 },
    { MaDichVu: 'XN_DUONG_HUYET', TenDichVu: 'Xét Nghiệm Đường Huyết Nhanh', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 80000 },
  ])
  const [priceDrafts, setPriceDrafts] = useState(() => ({
    DV_KHAM_NOI: '150000',
    DV_KHAM_GIA_DINH: '250000',
    DV_KHAM_LAO_KHOA: '180000',
    DV_KHAM_TIM_MACH: '200000',
    DV_KHAM_TIEU_HOA: '180000',
    DV_KHAM_HO_HAP: '170000',
    DV_KHAM_NOI_TIET: '220000',
    DV_KHAM_DINH_DUONG: '150000',
    DT_TRUYEN_DICH: '250000',
    DT_TIEM_KHANG_SINH: '80000',
    DV_KHAM_RANG: '200000',
    DV_LAY_CAO: '150000',
    DV_KHAM_NIENG_RANG: '300000',
    DV_KHAM_IMPLANT: '300000',
    DT_HAN_RANG: '300000',
    DT_RANG_TUY: '1200000',
    DT_NHO_RANG_KHON: '1000000',
    DT_TAY_TRANG: '2000000',
    DV_KHAM_TMH: '180000',
    DV_NOI_SOI_TMH: '250000',
    DV_KHAM_THINH_LUC: '200000',
    DT_KHIDUNG: '450000',
    DT_VIEM_AMIDAN: '600000',
    DT_RUA_XOANG: '350000',
    DT_LAY_DI_VAT: '400000',
    XN_MAU: '250000',
    SA_O_BUNG: '300000',
    XN_NUOC_TIEU: '120000',
    XN_SINH_HOA: '350000',
    XN_DUONG_HUYET: '80000',
  }))

  const [activeMenu, setActiveMenu] = useState('staff')
  const [staffList, setStaffList] = useState([
    {
      MaNhanSu: 'BS001',
      HoTen: 'Nguyễn Văn An',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Nội tổng quát',
      SDT: '0911222333',
      MatKhau: 'hashed_bs001',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS002',
      HoTen: 'Lê Thị Bình',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Răng hàm mặt',
      SDT: '0922333444',
      MatKhau: 'hashed_bs002',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS003',
      HoTen: 'Phạm Hoàng Long',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Tai mũi họng',
      SDT: '0933444555',
      MatKhau: 'hashed_bs003',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS004',
      HoTen: 'Trần Thu Hà',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Nội tổng quát',
      SDT: '0912000004',
      MatKhau: 'hashed_bs004',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS005',
      HoTen: 'Đỗ Minh Quân',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Răng hàm mặt',
      SDT: '0912000005',
      MatKhau: 'hashed_bs005',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS006',
      HoTen: 'Vũ Hải Yến',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Tai mũi họng',
      SDT: '0912000006',
      MatKhau: 'hashed_bs006',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS007',
      HoTen: 'Hoàng Đức Mạnh',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Nội tổng quát',
      SDT: '0912000007',
      MatKhau: 'hashed_bs007',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS008',
      HoTen: 'Ngô Phương Linh',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Răng hàm mặt',
      SDT: '0912000008',
      MatKhau: 'hashed_bs008',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS009',
      HoTen: 'Bùi Anh Tuấn',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Tai mũi họng',
      SDT: '0912000009',
      MatKhau: 'hashed_bs009',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS010',
      HoTen: 'Đặng Thùy Dương',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Nội tổng quát',
      SDT: '0912000010',
      MatKhau: 'hashed_bs010',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS011',
      HoTen: 'Phan Quốc Bảo',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Răng hàm mặt',
      SDT: '0912000011',
      MatKhau: 'hashed_bs011',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS012',
      HoTen: 'Mai Hương Giang',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Tai mũi họng',
      SDT: '0912000012',
      MatKhau: 'hashed_bs012',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS013',
      HoTen: 'Tạ Văn Dũng',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Nội tổng quát',
      SDT: '0912000013',
      MatKhau: 'hashed_bs013',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS014',
      HoTen: 'Lương Khánh Chi',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Răng hàm mặt',
      SDT: '0912000014',
      MatKhau: 'hashed_bs014',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS015',
      HoTen: 'Cao Tiến Đạt',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Tai mũi họng',
      SDT: '0912000015',
      MatKhau: 'hashed_bs015',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS016',
      HoTen: 'Đinh Ngọc Mai',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Nội tổng quát',
      SDT: '0912000016',
      MatKhau: 'hashed_bs016',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS017',
      HoTen: 'Hồ Việt Anh',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Răng hàm mặt',
      SDT: '0912000017',
      MatKhau: 'hashed_bs017',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'BS018',
      HoTen: 'Nguyễn Hồng Sơn',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Tai mũi họng',
      SDT: '0912000018',
      MatKhau: 'hashed_bs018',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'LT001',
      HoTen: 'Phạm Minh Thư',
      VaiTro: 'Lễ tân',
      ChuyenKhoa: 'Tiếp nhận',
      SDT: '0988777666',
      MatKhau: 'hashed_lt001',
      MaChiNhanh: 'CN_CG',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'LT002',
      HoTen: 'Nguyễn Hoàng Yến',
      VaiTro: 'Lễ tân',
      ChuyenKhoa: 'Tiếp nhận',
      SDT: '0988555444',
      MatKhau: 'hashed_lt002',
      MaChiNhanh: 'CN_HBT',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'XNV001',
      HoTen: 'Trần Văn Cường',
      VaiTro: 'Xét nghiệm viên',
      ChuyenKhoa: 'Xét nghiệm',
      SDT: '0966111222',
      MatKhau: 'hashed_xnv001',
      MaChiNhanh: 'CN_CG',
      TrangThai: 'active',
    },
    {
      MaNhanSu: 'XNV002',
      HoTen: 'Vũ Hồng Ngọc',
      VaiTro: 'Xét nghiệm viên',
      ChuyenKhoa: 'Xét nghiệm',
      SDT: '0966333444',
      MatKhau: 'hashed_xnv002',
      MaChiNhanh: 'CN_HBT',
      TrangThai: 'active',
    },
  ])
  const [patients] = useState([
    {
      MaBenhAn: 'BN001',
      HoTen: 'Trần Quang Hải',
      CCCD: '001095012345',
      SDT: '0901234567',
      DiaChi: 'Cầu Giấy, Hà Nội',
      MaSoBHYT: 'DN4010123456789',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN002',
      HoTen: 'Nguyễn Thị Mai',
      CCCD: '001200054321',
      SDT: '0907654321',
      DiaChi: 'Đống Đa, Hà Nội',
      MaSoBHYT: '',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN003',
      HoTen: 'Phạm Lê Minh',
      CCCD: '001221098765',
      SDT: '0911999888',
      DiaChi: 'Hai Bà Trưng, Hà Nội',
      MaSoBHYT: 'TE1010999888777',
      KyTuDauBHYT: 'TE',
    },
  ])
  const [staffForm, setStaffForm] = useState({
    HoTen: '',
    VaiTro: 'Bác sĩ',
    ChuyenKhoa: 'Nội tổng quát',
    SDT: '',
    MatKhau: '',
    MaChiNhanh: '',
  })
  const [staffSearch, setStaffSearch] = useState('')
  const [patientSearch, setPatientSearch] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [newServiceForm, setNewServiceForm] = useState({
    MaDichVu: '',
    TenDichVu: '',
    LoaiDichVu: 'Khám lâm sàng',
    ChuyenKhoa: 'Nội tổng quát',
    GiaGoc: '',
  })
  const [branchServices, setBranchServices] = useState([
    { MaCauHinh: 'CH_CG_KHAMNOI', MaChiNhanh: 'CN_CG', MaDichVu: 'DV_KHAM_NOI', SlotGioiHan: 15, TrangThai: 'active' },
    { MaCauHinh: 'CH_CG_KHAMRANG', MaChiNhanh: 'CN_CG', MaDichVu: 'DV_KHAM_RANG', SlotGioiHan: 10, TrangThai: 'active' },
    { MaCauHinh: 'CH_CG_XNMAU', MaChiNhanh: 'CN_CG', MaDichVu: 'XN_MAU', SlotGioiHan: 20, TrangThai: 'active' },
    { MaCauHinh: 'CH_CG_SAOBUNG', MaChiNhanh: 'CN_CG', MaDichVu: 'SA_O_BUNG', SlotGioiHan: 15, TrangThai: 'active' },
    { MaCauHinh: 'CH_CG_RANGTUY', MaChiNhanh: 'CN_CG', MaDichVu: 'DT_RANG_TUY', SlotGioiHan: 5, TrangThai: 'active' },
    { MaCauHinh: 'CH_HBT_KHAMNOI', MaChiNhanh: 'CN_HBT', MaDichVu: 'DV_KHAM_NOI', SlotGioiHan: 15, TrangThai: 'active' },
    { MaCauHinh: 'CH_HBT_KHAMTMH', MaChiNhanh: 'CN_HBT', MaDichVu: 'DV_KHAM_TMH', SlotGioiHan: 12, TrangThai: 'active' },
    { MaCauHinh: 'CH_HBT_XNMAU', MaChiNhanh: 'CN_HBT', MaDichVu: 'XN_MAU', SlotGioiHan: 20, TrangThai: 'active' },
    { MaCauHinh: 'CH_HBT_KHIDUNG', MaChiNhanh: 'CN_HBT', MaDichVu: 'DT_KHIDUNG', SlotGioiHan: 8, TrangThai: 'active' },
  ])
  const [distributionForm, setDistributionForm] = useState({
    MaChiNhanh: 'CN_CG',
    MaDichVu: 'DV_KHAM_NOI',
    SlotGioiHan: '10',
  })
  const [serviceFilters, setServiceFilters] = useState({
    MaChiNhanh: 'all',
    LoaiDichVu: 'all',
  })
  const [slotDrafts, setSlotDrafts] = useState(() =>
    Object.fromEntries(
      [
        ['CH_CG_KHAMNOI', 15],
        ['CH_CG_KHAMRANG', 10],
        ['CH_CG_XNMAU', 20],
        ['CH_CG_SAOBUNG', 15],
        ['CH_CG_RANGTUY', 5],
        ['CH_HBT_KHAMNOI', 15],
        ['CH_HBT_KHAMTMH', 12],
        ['CH_HBT_XNMAU', 20],
        ['CH_HBT_KHIDUNG', 8],
      ].map(([key, value]) => [key, String(value)]),
    ),
  )
  const [doctorSchedules, setDoctorSchedules] = useState([
    { MaLichTruc: 'LT_001', MaBacSi: 'BS001', MaChiNhanh: 'CN_CG', NgayTruc: '2026-06-01', CaTruc: 1, TrangThai: 'Đang hoạt động' },
    { MaLichTruc: 'LT_002', MaBacSi: 'BS001', MaChiNhanh: 'CN_CG', NgayTruc: '2026-06-01', CaTruc: 2, TrangThai: 'Đang hoạt động' },
    { MaLichTruc: 'LT_003', MaBacSi: 'BS002', MaChiNhanh: 'CN_CG', NgayTruc: '2026-06-01', CaTruc: 3, TrangThai: 'Đang hoạt động' },
    { MaLichTruc: 'LT_004', MaBacSi: 'BS003', MaChiNhanh: 'CN_HBT', NgayTruc: '2026-06-01', CaTruc: 1, TrangThai: 'Đang hoạt động' },
  ])
  const [appointments, setAppointments] = useState([
    {
      MaLichHen: 'LH_001',
      MaBenhAn: 'BN001',
      MaCauHinh: 'CH_CG_KHAMNOI',
      NgayKham: '2026-06-01',
      CaKham: 1,
      STT: 1,
      GiaCuoi: 30000,
      TrangThai: 'Hoàn thành',
      MaLeTan: 'LT001',
    },
    {
      MaLichHen: 'LH_002',
      MaBenhAn: 'BN002',
      MaCauHinh: 'CH_CG_KHAMRANG',
      NgayKham: '2026-06-01',
      CaKham: 3,
      STT: 1,
      GiaCuoi: 200000,
      TrangThai: 'Đã xác nhận',
      MaLeTan: '',
    },
    {
      MaLichHen: 'LH_003',
      MaBenhAn: 'BN003',
      MaCauHinh: 'CH_CG_KHAMNOI',
      NgayKham: '2026-06-01',
      CaKham: 2,
      STT: 1,
      GiaCuoi: 0,
      TrangThai: 'Chờ khám',
      MaLeTan: 'LT001',
    },
    {
      MaLichHen: 'LH_004',
      MaBenhAn: 'BN002',
      MaCauHinh: 'CH_CG_KHAMNOI',
      NgayKham: '2026-06-01',
      CaKham: 2,
      STT: 2,
      GiaCuoi: 150000,
      TrangThai: 'Hoàn thành',
      MaLeTan: 'LT001',
    },
    {
      MaLichHen: 'LH_005',
      MaBenhAn: 'BN003',
      MaCauHinh: 'CH_HBT_KHAMTMH',
      NgayKham: '2026-06-01',
      CaKham: 1,
      STT: 1,
      GiaCuoi: 0,
      TrangThai: 'Hoàn thành',
      MaLeTan: 'LT002',
    },
  ])
  const [labTestDetails] = useState([
    {
      MaChiTietXN: 'CTXN_001',
      MaBenhAn: 'BN001',
      MaDichVu: 'XN_MAU',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS001',
      NgayThucHien: '2026-06-01',
      TrangThai: 'Hoàn thành',
    },
		    {
		      MaChiTietXN: 'CTXN_002',
      MaBenhAn: 'BN002',
      MaDichVu: 'XN_SINH_HOA',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS002',
      NgayThucHien: '2026-06-01',
      TrangThai: 'Đang xử lý',
    },
    {
      MaChiTietXN: 'CTXN_003',
      MaBenhAn: 'BN003',
      MaDichVu: 'XN_DUONG_HUYET',
      MaChiNhanh: 'CN_HBT',
      MaBacSi: 'BS003',
      NgayThucHien: '2026-06-01',
      TrangThai: 'Hoàn thành',
    },
  ])
  const [bulkScheduleForm, setBulkScheduleForm] = useState({
    MaBacSi: 'BS001',
    MaChiNhanh: 'CN_CG',
    TuNgay: '2026-06-01',
    DenNgay: '2026-06-07',
    selections: {},
  })
  const [scheduleFilters, setScheduleFilters] = useState({
    NgayTruc: new Date().toISOString().slice(0, 10),
    MaBacSi: 'all',
  })
  const [feedback, setFeedback] = useState('')

  const clinicalDepartments = ['Nội tổng quát', 'Răng hàm mặt', 'Tai mũi họng']
  const serviceDepartments = ['Nội tổng quát', 'Răng hàm mặt', 'Tai mũi họng', 'Xét nghiệm']
  const serviceTypes = ['Khám lâm sàng', 'Xét nghiệm', 'Điều trị']
  const bhytCategories = [
    { KyTuDauBHYT: 'TE', DoiTuongChinhSach: 'Trẻ em dưới 6 tuổi', TyLeHuong: 1 },
    { KyTuDauBHYT: 'HT', DoiTuongChinhSach: 'Cán bộ Hưu trí', TyLeHuong: 0.95 },
    { KyTuDauBHYT: 'DN', DoiTuongChinhSach: 'Người lao động doanh nghiệp', TyLeHuong: 0.8 },
  ]

  const doctors = useMemo(
    () => staffList.filter((staff) => staff.VaiTro === 'Bác sĩ' && staff.TrangThai === 'active'),
    [staffList],
  )

  const filteredStaffList = useMemo(() => {
    const keyword = staffSearch.trim().toLowerCase()
    if (!keyword) return staffList

    return staffList.filter((staff) => {
      const branchName = staff.MaChiNhanh
        ? branches.find((branch) => branch.MaChiNhanh === staff.MaChiNhanh)?.TenChiNhanh
        : ''

      return [staff.MaNhanSu, staff.HoTen, staff.SDT, staff.VaiTro, staff.ChuyenKhoa, staff.MaChiNhanh, branchName]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
  }, [branches, staffList, staffSearch])

  const filteredPatients = useMemo(() => {
    const keyword = patientSearch.trim().toLowerCase()
    if (!keyword) return patients

    return patients.filter((patient) =>
      [patient.MaBenhAn, patient.HoTen, patient.CCCD, patient.SDT, patient.DiaChi]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    )
  }, [patients, patientSearch])

  const filteredServices = useMemo(() => {
    const keyword = serviceSearch.trim().toLowerCase()
    if (!keyword) return services

    return services.filter((service) =>
      [service.MaDichVu, service.TenDichVu, service.LoaiDichVu, service.ChuyenKhoa]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    )
  }, [services, serviceSearch])

  const getBranchName = (maChiNhanh) =>
    branches.find((branch) => branch.MaChiNhanh === maChiNhanh)?.TenChiNhanh || maChiNhanh

  const getService = (maDichVu) =>
    services.find((service) => service.MaDichVu === maDichVu) || {
      MaDichVu: maDichVu,
      TenDichVu: maDichVu,
      LoaiDichVu: '',
      GiaGoc: 0,
    }

  const getPatient = (maBenhAn) => patients.find((patient) => patient.MaBenhAn === maBenhAn)

  const getBhytRate = (maBenhAn) => {
    const patient = getPatient(maBenhAn)
    if (!patient?.KyTuDauBHYT) return 0

    return (
      bhytCategories.find((category) => category.KyTuDauBHYT === patient.KyTuDauBHYT)
        ?.TyLeHuong || 0
    )
  }

  const calculateRevenueParts = (maBenhAn, giaGoc) => {
    const tyLeHuong = getBhytRate(maBenhAn)
    const insuranceAmount = Math.round(giaGoc * tyLeHuong)
    const netRevenue = Math.max(0, giaGoc - insuranceAmount)

    return { netRevenue, insuranceAmount }
  }

  const getConfigService = (maCauHinh) => {
    const config = branchServices.find((item) => item.MaCauHinh === maCauHinh)
    if (!config) return { config: null, service: getService('') }

    return { config, service: getService(config.MaDichVu) }
  }

  const getAppointmentCountForSchedule = (schedule) => {
    const configIds = branchServices
      .filter((config) => config.MaChiNhanh === schedule.MaChiNhanh)
      .map((config) => config.MaCauHinh)

    return appointments.filter(
      (appointment) =>
        appointment.NgayKham === schedule.NgayTruc &&
        appointment.CaKham === schedule.CaTruc &&
        configIds.includes(appointment.MaCauHinh) &&
        appointment.TrangThai !== 'Đã hủy' &&
        appointment.TrangThai !== 'Đã hủy (Hệ thống hoàn tiền)',
    ).length
  }

  const filteredDoctorSchedules = doctorSchedules.filter((schedule) => {
    const matchedDate = !scheduleFilters.NgayTruc || schedule.NgayTruc === scheduleFilters.NgayTruc
    const matchedDoctor =
      scheduleFilters.MaBacSi === 'all' || schedule.MaBacSi === scheduleFilters.MaBacSi

    return matchedDate && matchedDoctor
  })

  const reportData = (() => {
    const completedAppointments = appointments
      .filter((appointment) => appointment.TrangThai === 'Hoàn thành')
      .map((appointment) => {
        const { config, service } = getConfigService(appointment.MaCauHinh)
        const { netRevenue, insuranceAmount } = calculateRevenueParts(
          appointment.MaBenhAn,
          service.GiaGoc,
        )
        const doctor = doctorSchedules.find(
          (schedule) =>
            schedule.MaChiNhanh === config?.MaChiNhanh &&
            schedule.NgayTruc === appointment.NgayKham &&
            schedule.CaTruc === appointment.CaKham,
        )

        return {
          id: appointment.MaLichHen,
          type: 'Khám',
          maBenhAn: appointment.MaBenhAn,
          maChiNhanh: config?.MaChiNhanh || '',
          maDichVu: service.MaDichVu,
          tenDichVu: service.TenDichVu,
          chuyenKhoa: service.ChuyenKhoa,
          giaGoc: service.GiaGoc,
          netRevenue,
          insuranceAmount,
          maBacSi: doctor?.MaBacSi || '',
        }
      })

    const completedLabTests = labTestDetails
      .filter((test) => test.TrangThai === 'Hoàn thành')
      .map((test) => {
        const service = getService(test.MaDichVu)
        const { netRevenue, insuranceAmount } = calculateRevenueParts(test.MaBenhAn, service.GiaGoc)

        return {
          id: test.MaChiTietXN,
          type: 'Xét nghiệm',
          maBenhAn: test.MaBenhAn,
          maChiNhanh: test.MaChiNhanh,
          maDichVu: service.MaDichVu,
          tenDichVu: service.TenDichVu,
          chuyenKhoa: service.ChuyenKhoa,
          giaGoc: service.GiaGoc,
          netRevenue,
          insuranceAmount,
          maBacSi: test.MaBacSi,
        }
      })

    const completedFinancialRecords = [...completedAppointments, ...completedLabTests]
    const totalNetRevenue = completedFinancialRecords.reduce(
      (sum, record) => sum + record.netRevenue,
      0,
    )
    const totalInsuranceAmount = completedFinancialRecords.reduce(
      (sum, record) => sum + record.insuranceAmount,
      0,
    )
    const cancelledAppointments = appointments.filter((appointment) =>
      appointment.TrangThai.includes('Đã hủy'),
    ).length
    const cancellationRate =
      appointments.length > 0 ? Math.round((cancelledAppointments / appointments.length) * 1000) / 10 : 0

    const branchRows = branches.map((branch) => {
      const branchRecords = completedFinancialRecords.filter(
        (record) => record.maChiNhanh === branch.MaChiNhanh,
      )
      return {
        maChiNhanh: branch.MaChiNhanh,
        tenChiNhanh: branch.TenChiNhanh,
        completedCount: branchRecords.length,
        netRevenue: branchRecords.reduce((sum, record) => sum + record.netRevenue, 0),
        insuranceAmount: branchRecords.reduce((sum, record) => sum + record.insuranceAmount, 0),
      }
    })

    const rankBy = (records, keyGetter, valueGetter) => {
      const map = new Map()

      records.forEach((record) => {
        const key = keyGetter(record)
        if (!key) return

        const current = map.get(key) || { key, count: 0, value: 0, sample: record }
        map.set(key, {
          ...current,
          count: current.count + 1,
          value: current.value + valueGetter(record),
        })
      })

      return Array.from(map.values()).sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value
        return b.count - a.count
      })
    }

    const topSpecialties = rankBy(
      completedFinancialRecords,
      (record) => record.chuyenKhoa,
      () => 1,
    )
    const topServices = rankBy(
      completedFinancialRecords,
      (record) => record.maDichVu,
      (record) => record.netRevenue,
    ).map((item) => ({
      ...item,
      tenDichVu: item.sample.tenDichVu,
    }))
    const topDoctors = rankBy(
      completedAppointments,
      (record) => record.maBacSi,
      () => 1,
    ).map((item) => {
      const doctor = staffList.find((staff) => staff.MaNhanSu === item.key)
      return {
        ...item,
        hoTen: doctor?.HoTen || 'Chưa phân công',
        chuyenKhoa: doctor?.ChuyenKhoa || 'Chưa rõ',
      }
    })

    return {
      totalNetRevenue,
      totalInsuranceAmount,
      completedAppointmentCount: completedAppointments.length,
      cancellationRate,
      branchRows,
      topSpecialties,
      topServices,
      topDoctors,
    }
  })()

  const filteredBranchServices = branchServices.filter((config) => {
    const service = getService(config.MaDichVu)
    const matchedBranch =
      serviceFilters.MaChiNhanh === 'all' || config.MaChiNhanh === serviceFilters.MaChiNhanh
    const matchedType =
      serviceFilters.LoaiDichVu === 'all' || service.LoaiDichVu === serviceFilters.LoaiDichVu

    return matchedBranch && matchedType
  })

  const getDoctorName = (maBacSi) =>
    staffList.find((staff) => staff.MaNhanSu === maBacSi)?.HoTen || maBacSi

  const formatMoney = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const handleStaffFormChange = (field, value) => {
    if (field === 'VaiTro') {
      const requiresFixedBranch = value === 'Lễ tân' || value === 'Xét nghiệm viên'
      const departmentByRole = {
        'Bác sĩ': 'Nội tổng quát',
        'Lễ tân': 'Tiếp nhận',
        'Xét nghiệm viên': 'Xét nghiệm',
      }

      setStaffForm((current) => ({
        ...current,
        VaiTro: value,
        ChuyenKhoa: departmentByRole[value],
        MaChiNhanh: requiresFixedBranch ? current.MaChiNhanh || branches[0]?.MaChiNhanh || '' : '',
      }))
      return
    }

    setStaffForm((current) => ({ ...current, [field]: value }))
  }

  const buildStaffCode = (vaiTro) => {
    const prefixMap = {
      'Bác sĩ': 'BS',
      'Lễ tân': 'LT',
      'Xét nghiệm viên': 'XNV',
    }
    const prefix = prefixMap[vaiTro]
    const nextNumber =
      staffList.filter((staff) => staff.MaNhanSu.startsWith(prefix)).length + 1

    return `${prefix}${String(nextNumber).padStart(3, '0')}`
  }

  const handleAddStaff = (event) => {
    event.preventDefault()
    const requiresFixedBranch =
      staffForm.VaiTro === 'Lễ tân' || staffForm.VaiTro === 'Xét nghiệm viên'

    if (requiresFixedBranch && !staffForm.MaChiNhanh) {
      alert('Vui lòng chọn chi nhánh phụ trách.')
      return
    }

    if (requiresFixedBranch) {
      const hasFixedStaffInBranch = staffList.some(
        (staff) =>
          staff.VaiTro === staffForm.VaiTro &&
          staff.MaChiNhanh === staffForm.MaChiNhanh,
      )

      if (hasFixedStaffInBranch) {
        alert('Mỗi chi nhánh chỉ được phép có duy nhất 1 Lễ tân và 1 Xét nghiệm viên cố định!')
        return
      }
    }

    const newStaff = {
      MaNhanSu: buildStaffCode(staffForm.VaiTro),
      HoTen: staffForm.HoTen.trim(),
      VaiTro: staffForm.VaiTro,
      ChuyenKhoa: staffForm.ChuyenKhoa,
      SDT: staffForm.SDT.trim(),
      MatKhau: staffForm.MatKhau.trim(),
      ...(requiresFixedBranch ? { MaChiNhanh: staffForm.MaChiNhanh } : {}),
      TrangThai: 'active',
    }

    setStaffList((current) => [...current, newStaff])
    setStaffForm({
      HoTen: '',
      VaiTro: 'Bác sĩ',
      ChuyenKhoa: 'Nội tổng quát',
      SDT: '',
      MatKhau: '',
      MaChiNhanh: '',
    })
    setFeedback(`Đã tạo tài khoản ${newStaff.MaNhanSu} cho ${newStaff.HoTen}.`)
  }

  const handleToggleStaffStatus = (maNhanSu) => {
    const target = staffList.find((staff) => staff.MaNhanSu === maNhanSu)
    const nextStatus = target?.TrangThai === 'active' ? 'inactive' : 'active'
    const nextActiveDoctor = staffList.find(
      (staff) =>
        staff.VaiTro === 'Bác sĩ' &&
        staff.TrangThai === 'active' &&
        staff.MaNhanSu !== maNhanSu,
    )

    setStaffList((current) =>
      current.map((staff) =>
        staff.MaNhanSu === maNhanSu ? { ...staff, TrangThai: nextStatus } : staff,
      ),
    )
    if (
      target?.VaiTro === 'Bác sĩ' &&
      nextStatus === 'inactive' &&
      bulkScheduleForm.MaBacSi === maNhanSu &&
      nextActiveDoctor
    ) {
      setBulkScheduleForm((current) => ({ ...current, MaBacSi: nextActiveDoctor.MaNhanSu }))
    }
    setFeedback(
      nextStatus === 'active'
        ? `Đã kích hoạt lại tài khoản ${maNhanSu}.`
        : `Đã vô hiệu hóa tài khoản ${maNhanSu}.`,
    )
  }

  const handleSaveSlot = (maCauHinh) => {
    const nextSlot = Math.max(0, Number(slotDrafts[maCauHinh] || 0))
    setBranchServices((current) =>
      current.map((config) =>
        config.MaCauHinh === maCauHinh ? { ...config, SlotGioiHan: nextSlot } : config,
      ),
    )
    setSlotDrafts((current) => ({ ...current, [maCauHinh]: String(nextSlot) }))
    setFeedback(`Đã cập nhật SlotGioiHan cho cấu hình ${maCauHinh}.`)
  }

  const handleUpdateServicePrice = (maDichVu) => {
    const nextPrice = Math.max(0, Number(priceDrafts[maDichVu] || 0))
    setServices((current) =>
      current.map((service) =>
        service.MaDichVu === maDichVu ? { ...service, GiaGoc: nextPrice } : service,
      ),
    )
    setPriceDrafts((current) => ({ ...current, [maDichVu]: String(nextPrice) }))
    setFeedback(`Đã cập nhật giá chung cho dịch vụ ${maDichVu}.`)
  }

  const handleNewServiceFormChange = (field, value) => {
    setNewServiceForm((current) => ({ ...current, [field]: value }))
  }

  const handleAddService = (event) => {
    event.preventDefault()
    const maDichVu = newServiceForm.MaDichVu.trim().toUpperCase()
    const tenDichVu = newServiceForm.TenDichVu.trim()
    const giaGoc = Math.max(0, Number(newServiceForm.GiaGoc || 0))

    if (!maDichVu || !tenDichVu || giaGoc <= 0) {
      setFeedback('Vui lòng nhập đầy đủ mã dịch vụ, tên dịch vụ và giá gốc lớn hơn 0.')
      return
    }

    if (services.some((service) => service.MaDichVu === maDichVu)) {
      setFeedback(`Mã dịch vụ ${maDichVu} đã tồn tại trong danh mục.`)
      return
    }

    const newService = {
      MaDichVu: maDichVu,
      TenDichVu: tenDichVu,
      ChuyenKhoa: newServiceForm.ChuyenKhoa,
      LoaiDichVu: newServiceForm.LoaiDichVu,
      GiaGoc: giaGoc,
    }

    setServices((current) => [...current, newService])
    setPriceDrafts((current) => ({ ...current, [maDichVu]: String(giaGoc) }))
    setDistributionForm((current) => ({ ...current, MaDichVu: maDichVu }))
    setNewServiceForm({
      MaDichVu: '',
      TenDichVu: '',
      LoaiDichVu: 'Khám lâm sàng',
      ChuyenKhoa: 'Nội tổng quát',
      GiaGoc: '',
    })
    setFeedback(`Đã thêm dịch vụ ${maDichVu} vào danh mục gốc.`)
  }

  const handleDeleteRootService = (maDichVu) => {
    const remainingServices = services.filter((service) => service.MaDichVu !== maDichVu)
    const relatedConfigs = branchServices.filter((config) => config.MaDichVu === maDichVu)
    const relatedConfigIds = relatedConfigs.map((config) => config.MaCauHinh)
    const nextSelectedService =
      distributionForm.MaDichVu === maDichVu
        ? remainingServices[0]?.MaDichVu || ''
        : distributionForm.MaDichVu

    setServices(remainingServices)
    setBranchServices((current) => current.filter((config) => config.MaDichVu !== maDichVu))
    setDistributionForm((current) => ({ ...current, MaDichVu: nextSelectedService }))
    setPriceDrafts((current) => {
      const nextDrafts = { ...current }
      delete nextDrafts[maDichVu]
      return nextDrafts
    })
    setSlotDrafts((current) => {
      const nextDrafts = { ...current }
      relatedConfigIds.forEach((maCauHinh) => {
        delete nextDrafts[maCauHinh]
      })
      return nextDrafts
    })
    setFeedback(
      `Đã xóa dịch vụ gốc ${maDichVu} và ${relatedConfigs.length} cấu hình chi nhánh liên quan.`,
    )
  }

  const handleBranchFormChange = (field, value) => {
    setBranchForm((current) => ({ ...current, [field]: value }))
  }

  const handleAddBranch = (event) => {
    event.preventDefault()
    const maChiNhanh = branchForm.MaChiNhanh.trim().toUpperCase()
    const tenChiNhanh = branchForm.TenChiNhanh.trim()
    const diaChi = branchForm.DiaChi.trim()

    if (!maChiNhanh || !tenChiNhanh || !diaChi) {
      setFeedback('Vui lòng nhập đầy đủ mã chi nhánh, tên chi nhánh và địa chỉ.')
      return
    }

    if (branches.some((branch) => branch.MaChiNhanh === maChiNhanh)) {
      setFeedback(`Mã chi nhánh ${maChiNhanh} đã tồn tại.`)
      return
    }

    const newBranch = {
      MaChiNhanh: maChiNhanh,
      TenChiNhanh: tenChiNhanh,
      DiaChi: diaChi,
      SDT: branchForm.SDT.trim(),
    }

    setBranches((current) => [...current, newBranch])
    setDistributionForm((current) => ({ ...current, MaChiNhanh: maChiNhanh }))
    setBranchForm({ MaChiNhanh: '', TenChiNhanh: '', DiaChi: '', SDT: '' })
    setFeedback(`Đã thêm chi nhánh ${maChiNhanh}.`)
  }

  const handleDeleteRootBranch = (maChiNhanh) => {
    const remainingBranches = branches.filter((branch) => branch.MaChiNhanh !== maChiNhanh)
    const relatedConfigs = branchServices.filter((config) => config.MaChiNhanh === maChiNhanh)
    const relatedConfigIds = relatedConfigs.map((config) => config.MaCauHinh)
    const relatedSchedules = doctorSchedules.filter((schedule) => schedule.MaChiNhanh === maChiNhanh)
    const nextSelectedBranch =
      distributionForm.MaChiNhanh === maChiNhanh
        ? remainingBranches[0]?.MaChiNhanh || ''
        : distributionForm.MaChiNhanh

    setBranches(remainingBranches)
    setBranchServices((current) => current.filter((config) => config.MaChiNhanh !== maChiNhanh))
    setDoctorSchedules((current) => current.filter((schedule) => schedule.MaChiNhanh !== maChiNhanh))
    setDistributionForm((current) => ({ ...current, MaChiNhanh: nextSelectedBranch }))
    setBulkScheduleForm((current) => ({
      ...current,
      MaChiNhanh: current.MaChiNhanh === maChiNhanh ? nextSelectedBranch : current.MaChiNhanh,
    }))
    setServiceFilters((current) => ({
      ...current,
      MaChiNhanh: current.MaChiNhanh === maChiNhanh ? 'all' : current.MaChiNhanh,
    }))
    setSlotDrafts((current) => {
      const nextDrafts = { ...current }
      relatedConfigIds.forEach((maCauHinh) => {
        delete nextDrafts[maCauHinh]
      })
      return nextDrafts
    })
    setFeedback(
      `Đã xóa chi nhánh ${maChiNhanh}, ${relatedConfigs.length} cấu hình dịch vụ và ${relatedSchedules.length} lịch trực liên quan.`,
    )
  }

  const handleDistributionFormChange = (field, value) => {
    setDistributionForm((current) => ({ ...current, [field]: value }))
  }

  const buildBranchServiceCode = (maChiNhanh, maDichVu) => {
    const branchSuffix = maChiNhanh.replace('CN_', '')
    const serviceSuffix = maDichVu.replace('DV_', '').replace('DT_', '').replace('XN_', '')
    return `CH_${branchSuffix}_${serviceSuffix}`.replaceAll('__', '_')
  }

  const handleApplyBranchService = (event) => {
    event.preventDefault()
    if (!distributionForm.MaChiNhanh || !distributionForm.MaDichVu) {
      setFeedback('Cần có ít nhất một chi nhánh và một dịch vụ để áp dụng cấu hình.')
      return
    }

    const slot = Math.max(0, Number(distributionForm.SlotGioiHan || 0))
    const existingConfig = branchServices.find(
      (config) =>
        config.MaChiNhanh === distributionForm.MaChiNhanh &&
        config.MaDichVu === distributionForm.MaDichVu,
    )

    if (existingConfig) {
      setBranchServices((current) =>
        current.map((config) =>
          config.MaCauHinh === existingConfig.MaCauHinh
            ? { ...config, SlotGioiHan: slot, TrangThai: 'active' }
            : config,
        ),
      )
      setSlotDrafts((current) => ({ ...current, [existingConfig.MaCauHinh]: String(slot) }))
      setFeedback(`Đã cập nhật và hiển thị lại cấu hình ${existingConfig.MaCauHinh}.`)
      return
    }

    const maCauHinh = buildBranchServiceCode(distributionForm.MaChiNhanh, distributionForm.MaDichVu)
    const newConfig = {
      MaCauHinh: maCauHinh,
      MaChiNhanh: distributionForm.MaChiNhanh,
      MaDichVu: distributionForm.MaDichVu,
      SlotGioiHan: slot,
      TrangThai: 'active',
    }

    setBranchServices((current) => [...current, newConfig])
    setSlotDrafts((current) => ({ ...current, [maCauHinh]: String(slot) }))
    setFeedback(`Đã áp dụng dịch vụ ${distributionForm.MaDichVu} cho ${distributionForm.MaChiNhanh}.`)
  }

  const handleToggleBranchService = (maCauHinh) => {
    const target = branchServices.find((config) => config.MaCauHinh === maCauHinh)
    const nextStatus = target?.TrangThai === 'active' ? 'inactive' : 'active'

    setBranchServices((current) =>
      current.map((config) =>
        config.MaCauHinh === maCauHinh ? { ...config, TrangThai: nextStatus } : config,
      ),
    )
    setFeedback(
      nextStatus === 'active'
        ? `Đã hiện lại cấu hình ${maCauHinh}.`
        : `Đã ẩn cấu hình ${maCauHinh}.`,
    )
  }

  const handleDeleteBranchService = (maCauHinh) => {
    setBranchServices((current) => current.filter((config) => config.MaCauHinh !== maCauHinh))
    setSlotDrafts((current) => {
      const nextDrafts = { ...current }
      delete nextDrafts[maCauHinh]
      return nextDrafts
    })
    setFeedback(`Đã xóa cấu hình ${maCauHinh} khỏi chi nhánh.`)
  }

  const handleBulkScheduleFormChange = (field, value) => {
    setBulkScheduleForm((current) => ({ ...current, [field]: value }))
  }

  const handleScheduleFilterChange = (field, value) => {
    setScheduleFilters((current) => ({ ...current, [field]: value }))
  }

  const getScheduleSelectionKey = (thu, ca) => `${thu}-${ca}`

  const handleToggleScheduleSelection = (thu, ca) => {
    const key = getScheduleSelectionKey(thu, ca)
    setBulkScheduleForm((current) => ({
      ...current,
      selections: {
        ...current.selections,
        [key]: !current.selections[key],
      },
    }))
  }

  const parseDateInput = (value) => new Date(`${value}T00:00:00`)

  const formatDateInput = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleBulkAssignSchedule = (event) => {
    event.preventDefault()
    const activeDoctor = doctors.some((doctor) => doctor.MaNhanSu === bulkScheduleForm.MaBacSi)
    const selectedKeys = Object.entries(bulkScheduleForm.selections)
      .filter(([, selected]) => selected)
      .map(([key]) => key)

    if (!activeDoctor) {
      setFeedback('Chỉ có thể xếp lịch cho bác sĩ đang active.')
      return
    }

    if (!bulkScheduleForm.MaChiNhanh) {
      setFeedback('Vui lòng chọn chi nhánh trước khi xếp lịch.')
      return
    }

    if (!bulkScheduleForm.TuNgay || !bulkScheduleForm.DenNgay) {
      setFeedback('Vui lòng chọn đầy đủ khoảng ngày.')
      return
    }

    if (selectedKeys.length === 0) {
      setFeedback('Vui lòng tích ít nhất một ô Thứ/Ca trong ma trận lịch trực.')
      return
    }

    const startDate = parseDateInput(bulkScheduleForm.TuNgay)
    const endDate = parseDateInput(bulkScheduleForm.DenNgay)

    if (startDate > endDate) {
      setFeedback('Khoảng ngày không hợp lệ: Từ ngày phải nhỏ hơn hoặc bằng Đến ngày.')
      return
    }

    const existingKeys = new Set(
      doctorSchedules
        .filter((schedule) => schedule.TrangThai !== 'Đã hủy')
        .map(
          (schedule) =>
            `${schedule.MaBacSi}-${schedule.MaChiNhanh}-${schedule.NgayTruc}-${schedule.CaTruc}`,
        ),
    )
    const newSchedules = []
    let runningIndex = doctorSchedules.length + 1

    for (
      const cursor = new Date(startDate);
      cursor <= endDate;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const weekday = cursor.getDay() === 0 ? 1 : cursor.getDay() + 1
      const ngayTruc = formatDateInput(cursor)

      for (let ca = 1; ca <= 4; ca += 1) {
        const selected = selectedKeys.includes(getScheduleSelectionKey(weekday, ca))
        const duplicateKey = `${bulkScheduleForm.MaBacSi}-${bulkScheduleForm.MaChiNhanh}-${ngayTruc}-${ca}`

        if (selected && !existingKeys.has(duplicateKey)) {
          newSchedules.push({
            MaLichTruc: `LT_${String(runningIndex).padStart(3, '0')}`,
            MaBacSi: bulkScheduleForm.MaBacSi,
            MaChiNhanh: bulkScheduleForm.MaChiNhanh,
            NgayTruc: ngayTruc,
            CaTruc: ca,
            TrangThai: 'Đang hoạt động',
          })
          existingKeys.add(duplicateKey)
          runningIndex += 1
        }
      }
    }

    if (newSchedules.length === 0) {
      setFeedback('Không có lịch trực mới được tạo vì toàn bộ lựa chọn đã trùng lịch hiện có.')
      return
    }

    setDoctorSchedules((current) => [...current, ...newSchedules])
    setFeedback(`Đã xếp ${newSchedules.length} ca trực mới cho ${getDoctorName(bulkScheduleForm.MaBacSi)}.`)
  }

  const handleCancelSchedule = (schedule) => {
    const configIds = branchServices
      .filter((config) => config.MaChiNhanh === schedule.MaChiNhanh)
      .map((config) => config.MaCauHinh)

    const cancellableStatuses = ['Đã xác nhận', 'Chờ khám', 'Đang khám']

    const isAffectedAppointment = (appointment) =>
      appointment.NgayKham === schedule.NgayTruc &&
      appointment.CaKham === schedule.CaTruc &&
      configIds.includes(appointment.MaCauHinh) &&
      cancellableStatuses.includes(appointment.TrangThai)

    const affectedCount = appointments.filter(isAffectedAppointment).length

    if (affectedCount > 0) {
      const confirmed = window.confirm(
        `Ca trực này đang có ${affectedCount} lịch hẹn chưa hoàn thành. Bạn có chắc chắn muốn hủy ca trực này và tự động hoàn tiền cho bệnh nhân?`,
      )

      if (!confirmed) {
        return
      }
    }

    setAppointments((current) =>
      current.map((appointment) =>
        isAffectedAppointment(appointment)
          ? { ...appointment, TrangThai: 'Đã hủy (Hệ thống hoàn tiền)' }
          : appointment,
      ),
    )

    setDoctorSchedules((current) =>
      current.map((item) =>
        item.MaLichTruc === schedule.MaLichTruc
          ? { ...item, TrangThai: 'Đã hủy' }
          : item,
      ),
    )

    if (affectedCount > 0) {
      setFeedback(
        `Đã hủy ca trực ${schedule.MaLichTruc} và tự động hoàn tiền cho ${affectedCount} lịch hẹn.`,
      )
    } else {
      setFeedback(`Đã hủy ca trực ${schedule.MaLichTruc}.`)
    }
  }

  const renderStaffManagement = () => (
    <div className="admin-stack">
      <section className="admin-card">
        <div className="admin-section-header">
          <div>
            <h2>Quản lý Nhân sự</h2>
            <p>Tạo tài khoản cho Bác sĩ, Lễ tân và Xét nghiệm viên theo đúng mã định danh hệ thống.</p>
          </div>
        </div>

        <form className="admin-form-grid" onSubmit={handleAddStaff}>
          <label>
            Họ tên
            <input
              className="admin-input"
              value={staffForm.HoTen}
              onChange={(event) => handleStaffFormChange('HoTen', event.target.value)}
              required
            />
          </label>
          <label>
            Vai trò
            <select
              className="admin-input"
              value={staffForm.VaiTro}
              onChange={(event) => handleStaffFormChange('VaiTro', event.target.value)}
            >
              <option value="Bác sĩ">Bác sĩ</option>
              <option value="Lễ tân">Lễ tân</option>
              <option value="Xét nghiệm viên">Xét nghiệm viên</option>
            </select>
          </label>
          <label>
            Chuyên khoa/Bộ phận
            <select
              className="admin-input"
              value={staffForm.ChuyenKhoa}
              onChange={(event) => handleStaffFormChange('ChuyenKhoa', event.target.value)}
              disabled={staffForm.VaiTro !== 'Bác sĩ'}
            >
              {staffForm.VaiTro === 'Bác sĩ' ? (
                clinicalDepartments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))
              ) : (
                <option value={staffForm.ChuyenKhoa}>{staffForm.ChuyenKhoa}</option>
              )}
            </select>
          </label>
          {(staffForm.VaiTro === 'Lễ tân' || staffForm.VaiTro === 'Xét nghiệm viên') && (
            <label className="admin-fixed-branch-field">
              Chi nhánh phụ trách
              <select
                className="admin-input"
                value={staffForm.MaChiNhanh}
                onChange={(event) => handleStaffFormChange('MaChiNhanh', event.target.value)}
                required
              >
                {branches.map((branch) => (
                  <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
                    {branch.TenChiNhanh}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Số điện thoại
            <input
              className="admin-input"
              value={staffForm.SDT}
              onChange={(event) => handleStaffFormChange('SDT', event.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu
            <input
              className="admin-input"
              type="password"
              value={staffForm.MatKhau}
              onChange={(event) => handleStaffFormChange('MatKhau', event.target.value)}
              required
            />
          </label>
          <button type="submit" className="admin-primary-button">
            Thêm nhân sự
          </button>
        </form>

        <label className="admin-search-field">
          <span>Tìm kiếm nhân sự</span>
          <input
            className="admin-input"
            value={staffSearch}
            onChange={(event) => setStaffSearch(event.target.value)}
            placeholder="Tìm theo mã, họ tên, SĐT, vai trò hoặc chuyên khoa"
          />
        </label>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã nhân sự</th>
                <th>Họ tên</th>
                <th>Vai trò</th>
                <th>Chuyên khoa/Bộ phận</th>
                <th>Chi nhánh phụ trách</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffList.map((staff) => (
                <tr key={staff.MaNhanSu}>
                  <td>{staff.MaNhanSu}</td>
                  <td>{staff.HoTen}</td>
                  <td>{staff.VaiTro}</td>
                  <td>{staff.ChuyenKhoa}</td>
                  <td>{staff.MaChiNhanh ? getBranchName(staff.MaChiNhanh) : 'Linh hoạt theo lịch trực'}</td>
                  <td>{staff.SDT}</td>
                  <td>
                    <span className={`status-pill ${staff.TrangThai === 'active' ? 'active' : 'muted'}`}>
                      {staff.TrangThai === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={
                        staff.TrangThai === 'active'
                          ? 'admin-danger-button'
                          : 'admin-success-button'
                      }
                      onClick={() => handleToggleStaffStatus(staff.MaNhanSu)}
                    >
                      {staff.TrangThai === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStaffList.length === 0 && (
                <tr>
                  <td colSpan="8">Không tìm thấy nhân sự phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <h2>Danh sách Bệnh nhân</h2>
        <p>Bệnh nhân chỉ theo dõi tại Admin; tài khoản được tạo từ màn hình đăng ký bệnh nhân.</p>
        <label className="admin-search-field">
          <span>Tìm kiếm bệnh nhân</span>
          <input
            className="admin-input"
            value={patientSearch}
            onChange={(event) => setPatientSearch(event.target.value)}
            placeholder="Tìm theo mã bệnh án, CCCD, họ tên, SĐT hoặc địa chỉ"
          />
        </label>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã bệnh án</th>
                <th>Họ tên</th>
                <th>Số CCCD</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Mã số BHYT</th>
                <th>Ký tự đầu BHYT</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.MaBenhAn}>
                  <td>{patient.MaBenhAn}</td>
                  <td>{patient.HoTen}</td>
                  <td>{patient.CCCD}</td>
                  <td>{patient.SDT}</td>
                  <td>{patient.DiaChi}</td>
                  <td>{patient.MaSoBHYT || 'Không có'}</td>
                  <td>{patient.KyTuDauBHYT || 'Không có'}</td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="7">Không tìm thấy bệnh nhân phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )

  const renderServiceConfig = () => (
    <div className="admin-stack">
      <section className="admin-card">
        <h2>Quản lý giá danh mục dịch vụ</h2>
        <p>Giá gốc nằm tại bảng DICH_VU. Khi cập nhật tại đây, mọi chi nhánh đang phân phối dịch vụ sẽ dùng cùng mức giá mới.</p>

        <form className="admin-form-grid admin-form-grid-wide" onSubmit={handleAddService}>
          <label>
            Mã dịch vụ mới
            <input
              className="admin-input"
              value={newServiceForm.MaDichVu}
              onChange={(event) => handleNewServiceFormChange('MaDichVu', event.target.value)}
              placeholder="VD: DV_KHAM_DA_LIEU"
              required
            />
          </label>
          <label>
            Tên dịch vụ
            <input
              className="admin-input"
              value={newServiceForm.TenDichVu}
              onChange={(event) => handleNewServiceFormChange('TenDichVu', event.target.value)}
              placeholder="Nhập tên dịch vụ"
              required
            />
          </label>
          <label>
            Loại dịch vụ
            <select
              className="admin-input"
              value={newServiceForm.LoaiDichVu}
              onChange={(event) => handleNewServiceFormChange('LoaiDichVu', event.target.value)}
            >
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Chuyên khoa
            <select
              className="admin-input"
              value={newServiceForm.ChuyenKhoa}
              onChange={(event) => handleNewServiceFormChange('ChuyenKhoa', event.target.value)}
            >
              {serviceDepartments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>
          <label>
            Giá gốc ban đầu
            <input
              className="admin-input"
              type="number"
              min="0"
              step="1000"
              value={newServiceForm.GiaGoc}
              onChange={(event) => handleNewServiceFormChange('GiaGoc', event.target.value)}
              required
            />
          </label>
          <button type="submit" className="admin-primary-button">
            Thêm dịch vụ
          </button>
        </form>

        <label className="admin-search-field">
          <span>Tìm kiếm dịch vụ</span>
          <input
            className="admin-input"
            value={serviceSearch}
            onChange={(event) => setServiceSearch(event.target.value)}
            placeholder="Tìm theo mã, tên, loại dịch vụ hoặc chuyên khoa"
          />
        </label>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã dịch vụ</th>
                <th>Tên dịch vụ</th>
                <th>Loại dịch vụ</th>
                <th>Chuyên khoa</th>
                <th>Giá dịch vụ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.MaDichVu}>
                  <td>{service.MaDichVu}</td>
                  <td>{service.TenDichVu}</td>
                  <td>{service.LoaiDichVu}</td>
                  <td>{service.ChuyenKhoa}</td>
                  <td>
                    <input
                      className="admin-money-input"
                      type="number"
                      min="0"
                      step="1000"
                      value={priceDrafts[service.MaDichVu]}
                      onChange={(event) =>
                        setPriceDrafts((current) => ({
                          ...current,
                          [service.MaDichVu]: event.target.value,
                        }))
                      }
                    />
                  </td>
                  <td>
                    <div className="admin-actions-row">
                      <button
                        type="button"
                        className="admin-primary-button compact"
                        onClick={() => handleUpdateServicePrice(service.MaDichVu)}
                      >
                        Cập nhật giá
                      </button>
                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDeleteRootService(service.MaDichVu)}
                      >
                        Xóa gốc
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan="6">Không tìm thấy dịch vụ phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <h2>Quản lý danh sách Chi nhánh</h2>
        <p>Theo dõi các cơ sở đang vận hành và thêm chi nhánh mới khi phòng khám mở rộng.</p>

        <form className="admin-form-grid" onSubmit={handleAddBranch}>
          <label>
            Mã chi nhánh
            <input
              className="admin-input"
              value={branchForm.MaChiNhanh}
              onChange={(event) => handleBranchFormChange('MaChiNhanh', event.target.value)}
              placeholder="VD: CN_DD"
              required
            />
          </label>
          <label>
            Tên chi nhánh
            <input
              className="admin-input"
              value={branchForm.TenChiNhanh}
              onChange={(event) => handleBranchFormChange('TenChiNhanh', event.target.value)}
              placeholder="Smart Clinic - Cơ sở ..."
              required
            />
          </label>
          <label>
            Địa chỉ
            <input
              className="admin-input"
              value={branchForm.DiaChi}
              onChange={(event) => handleBranchFormChange('DiaChi', event.target.value)}
              placeholder="Nhập địa chỉ chi nhánh"
              required
            />
          </label>
          <label>
            Số điện thoại
            <input
              className="admin-input"
              value={branchForm.SDT}
              onChange={(event) => handleBranchFormChange('SDT', event.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </label>
          <button type="submit" className="admin-primary-button">
            Thêm chi nhánh
          </button>
        </form>

        <div className="admin-branch-grid">
          {branches.map((branch) => (
            <div className="admin-branch-card" key={branch.MaChiNhanh}>
              <strong>{branch.MaChiNhanh}</strong>
              <span>{branch.TenChiNhanh}</span>
              <small>{branch.DiaChi}</small>
              <small>{branch.SDT || 'Chưa có số điện thoại'}</small>
              <div className="admin-branch-card-actions">
                <button
                  type="button"
                  className="admin-delete-button"
                  onClick={() => handleDeleteRootBranch(branch.MaChiNhanh)}
                >
                  Xóa chi nhánh
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <h2>Phân phối & Cấu hình Slot theo Chi nhánh</h2>
        <p>Bảng CHI_NHANH_DICH_VU chỉ quản lý dịch vụ đang được bật tại từng cơ sở, SlotGioiHan và trạng thái ẩn/hiện.</p>

        <form className="admin-form-grid" onSubmit={handleApplyBranchService}>
          <label>
            Chi nhánh
            <select
              className="admin-input"
              value={distributionForm.MaChiNhanh}
              onChange={(event) => handleDistributionFormChange('MaChiNhanh', event.target.value)}
            >
              {branches.map((branch) => (
                <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
                  {branch.TenChiNhanh}
                </option>
              ))}
            </select>
          </label>
          <label>
            Dịch vụ
            <select
              className="admin-input"
              value={distributionForm.MaDichVu}
              onChange={(event) => handleDistributionFormChange('MaDichVu', event.target.value)}
            >
              {services.map((service) => (
                <option key={service.MaDichVu} value={service.MaDichVu}>
                  {service.MaDichVu} - {service.TenDichVu} ({formatMoney(service.GiaGoc)})
                </option>
              ))}
            </select>
          </label>
          <label>
            Slot giới hạn
            <input
              className="admin-input"
              type="number"
              min="0"
              value={distributionForm.SlotGioiHan}
              onChange={(event) => handleDistributionFormChange('SlotGioiHan', event.target.value)}
              required
            />
          </label>
          <button type="submit" className="admin-primary-button">
            Áp dụng cho chi nhánh
          </button>
        </form>

        <div className="admin-price-preview">
          Giá chuẩn hiện tại:{' '}
          <strong>{formatMoney(getService(distributionForm.MaDichVu).GiaGoc)}</strong>
        </div>

        <div className="admin-filter-row">
          <label>
            Lọc theo Chi nhánh
            <select
              className="admin-input"
              value={serviceFilters.MaChiNhanh}
              onChange={(event) =>
                setServiceFilters((current) => ({ ...current, MaChiNhanh: event.target.value }))
              }
            >
              <option value="all">Tất cả</option>
              {branches.map((branch) => (
                <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
                  {branch.TenChiNhanh.replace('Smart Clinic - Cơ sở ', '')}
                </option>
              ))}
            </select>
          </label>
          <label>
            Lọc theo Loại dịch vụ
            <select
              className="admin-input"
              value={serviceFilters.LoaiDichVu}
              onChange={(event) =>
                setServiceFilters((current) => ({ ...current, LoaiDichVu: event.target.value }))
              }
            >
              <option value="all">Tất cả</option>
              <option value="Khám lâm sàng">Khám lâm sàng</option>
              <option value="Xét nghiệm">Xét nghiệm</option>
              <option value="Điều trị">Điều trị</option>
            </select>
          </label>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Chi nhánh</th>
                <th>Tên dịch vụ</th>
                <th>Loại dịch vụ</th>
                <th>Giá hiện tại</th>
                <th>Slot giới hạn</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranchServices.map((config) => {
                const service = getService(config.MaDichVu)
                return (
                  <tr key={config.MaCauHinh}>
                    <td>{getBranchName(config.MaChiNhanh)}</td>
                    <td>{service.TenDichVu}</td>
                    <td>{service.LoaiDichVu}</td>
                    <td>{formatMoney(service.GiaGoc)}</td>
                    <td>
                      <input
                        className="admin-slot-input"
                        type="number"
                        min="0"
                        value={slotDrafts[config.MaCauHinh]}
                        onChange={(event) =>
                          setSlotDrafts((current) => ({
                            ...current,
                            [config.MaCauHinh]: event.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <span className={`status-pill ${config.TrangThai === 'active' ? 'active' : 'muted'}`}>
                        {config.TrangThai === 'active' ? 'Đang hiện' : 'Đang ẩn'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions-row">
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => handleSaveSlot(config.MaCauHinh)}
                        >
                          Lưu Slot
                        </button>
                        <button
                          type="button"
                          className={
                            config.TrangThai === 'active'
                              ? 'admin-danger-button'
                              : 'admin-success-button'
                          }
                          onClick={() => handleToggleBranchService(config.MaCauHinh)}
                        >
                          {config.TrangThai === 'active' ? 'Ẩn' : 'Hiện'}
                        </button>
                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => handleDeleteBranchService(config.MaCauHinh)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredBranchServices.length === 0 && (
                <tr>
                  <td colSpan="7">Không có cấu hình dịch vụ phù hợp với bộ lọc hiện tại.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )

  const renderSchedules = () => (
    <div className="admin-stack">
      <section className="admin-card">
        <h2>Xếp lịch trực hàng loạt</h2>
        <p>Chọn bác sĩ, chi nhánh, khoảng ngày và ma trận Thứ/Ca để sinh lịch trực tự động.</p>

        <form className="admin-schedule-form" onSubmit={handleBulkAssignSchedule}>
          <div className="admin-form-grid">
            <label>
              Bác sĩ
              <select
                className="admin-input"
                value={bulkScheduleForm.MaBacSi}
                onChange={(event) => handleBulkScheduleFormChange('MaBacSi', event.target.value)}
              >
                {doctors.map((doctor) => (
                  <option key={doctor.MaNhanSu} value={doctor.MaNhanSu}>
                    {doctor.MaNhanSu} - {doctor.HoTen}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Chi nhánh
              <select
                className="admin-input"
                value={bulkScheduleForm.MaChiNhanh}
                onChange={(event) => handleBulkScheduleFormChange('MaChiNhanh', event.target.value)}
              >
                {branches.map((branch) => (
                  <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
                    {branch.TenChiNhanh}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Từ ngày
              <input
                className="admin-input"
                type="date"
                value={bulkScheduleForm.TuNgay}
                onChange={(event) => handleBulkScheduleFormChange('TuNgay', event.target.value)}
                required
              />
            </label>
            <label>
              Đến ngày
              <input
                className="admin-input"
                type="date"
                value={bulkScheduleForm.DenNgay}
                onChange={(event) => handleBulkScheduleFormChange('DenNgay', event.target.value)}
                required
              />
            </label>
          </div>

          <div className="schedule-matrix-wrap">
            <div className="schedule-matrix">
              <div className="schedule-matrix-cell header">Ca / Thứ</div>
              {[2, 3, 4, 5, 6, 7, 1].map((weekday) => (
                <div className="schedule-matrix-cell header" key={weekday}>
                  {weekday === 1 ? 'Chủ Nhật' : `Thứ ${weekday}`}
                </div>
              ))}
              {[1, 2, 3, 4].map((shift) => (
                <div className="schedule-matrix-row" key={shift}>
                  <div className="schedule-matrix-cell shift-label">Ca {shift}</div>
                  {[2, 3, 4, 5, 6, 7, 1].map((weekday) => {
                    const key = getScheduleSelectionKey(weekday, shift)
                    return (
                      <label className="schedule-checkbox-cell" key={key}>
                        <input
                          type="checkbox"
                          checked={Boolean(bulkScheduleForm.selections[key])}
                          onChange={() => handleToggleScheduleSelection(weekday, shift)}
                        />
                      </label>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="admin-primary-button">
            Xếp lịch hàng loạt
          </button>
        </form>
      </section>

      <section className="admin-card">
        <h2>Danh sách lịch trực</h2>
        <div className="admin-filter-row">
          <label>
            Lọc theo Ngày
            <input
              className="admin-input"
              type="date"
              value={scheduleFilters.NgayTruc}
              onChange={(event) => handleScheduleFilterChange('NgayTruc', event.target.value)}
            />
          </label>
          <label>
            Lọc theo Bác sĩ
            <select
              className="admin-input"
              value={scheduleFilters.MaBacSi}
              onChange={(event) => handleScheduleFilterChange('MaBacSi', event.target.value)}
            >
              <option value="all">Tất cả bác sĩ</option>
              {doctors.map((doctor) => (
                <option key={doctor.MaNhanSu} value={doctor.MaNhanSu}>
                  {doctor.MaNhanSu} - {doctor.HoTen}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bác sĩ</th>
                <th>Chi nhánh</th>
                <th>Ngày</th>
                <th>Ca trực</th>
                <th>Số lịch hẹn đang có</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctorSchedules.map((schedule) => {
                const appointmentCount = getAppointmentCountForSchedule(schedule)
                const isCancelled = schedule.TrangThai === 'Đã hủy'
                return (
                  <tr key={schedule.MaLichTruc}>
                    <td>{getDoctorName(schedule.MaBacSi)}</td>
                    <td>{getBranchName(schedule.MaChiNhanh)}</td>
                    <td>{schedule.NgayTruc}</td>
                    <td>Ca {schedule.CaTruc}</td>
                    <td>{appointmentCount}</td>
                    <td>
                      <span className={`status-pill ${isCancelled ? 'danger' : 'active'}`}>
                        {isCancelled ? 'Đã hủy' : 'Đang hoạt động'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-danger-button"
                        onClick={() => handleCancelSchedule(schedule)}
                        disabled={isCancelled}
                      >
                        {isCancelled ? 'Đã hủy' : 'Hủy ca trực'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredDoctorSchedules.length === 0 && (
                <tr>
                  <td colSpan="7">Không có lịch trực phù hợp với bộ lọc hiện tại.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )

  const renderReports = () => (
    <div className="admin-stack">
      <div className="finance-kpi-grid">
        <div className="finance-kpi-card revenue">
          <DollarSign size={24} />
          <span>Tổng Doanh thu Thực tế</span>
          <strong>{formatMoney(reportData.totalNetRevenue)}</strong>
          <small>Sau khi trừ phần BHYT chi trả</small>
        </div>
        <div className="finance-kpi-card insurance">
          <ClipboardList size={24} />
          <span>Tổng Quỹ BHYT Chi trả</span>
          <strong>{formatMoney(reportData.totalInsuranceAmount)}</strong>
          <small>Phần bảo hiểm hoàn trả cho phòng khám</small>
        </div>
        <div className="finance-kpi-card success">
          <Activity size={24} />
          <span>Tổng số ca khám thành công</span>
          <strong>{reportData.completedAppointmentCount}</strong>
          <small>Chỉ tính lịch hẹn trạng thái Hoàn thành</small>
        </div>
        <div className="finance-kpi-card danger">
          <Users size={24} />
          <span>Tỷ lệ hủy hẹn</span>
          <strong>{reportData.cancellationRate}%</strong>
          <small>Tính trên tổng số lịch hẹn hiện có</small>
        </div>
      </div>

      <section className="admin-card">
        <h2>Hiệu suất và Doanh thu theo Chi nhánh</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Chi nhánh</th>
                <th>Tổng lượt khám thành công</th>
                <th>Doanh thu thực thu</th>
                <th>Tiền bảo hiểm chi trả</th>
              </tr>
            </thead>
            <tbody>
              {reportData.branchRows.map((row) => (
                <tr key={row.maChiNhanh}>
                  <td>{row.tenChiNhanh}</td>
                  <td>{row.completedCount}</td>
                  <td>{formatMoney(row.netRevenue)}</td>
                  <td>{formatMoney(row.insuranceAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <h2>Bảng xếp hạng xu hướng vận hành</h2>
        <div className="ranking-grid">
          <div className="ranking-panel">
            <h3>Top Chuyên Khoa</h3>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Chuyên khoa</th>
                  <th>Lượt</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topSpecialties.slice(0, 5).map((item) => (
                  <tr key={item.key}>
                    <td>{item.key}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ranking-panel">
            <h3>Top Dịch Vụ Thịnh Hành</h3>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topServices.slice(0, 5).map((item) => (
                  <tr key={item.key}>
                    <td>{item.tenDichVu}</td>
                    <td>{formatMoney(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ranking-panel">
            <h3>Top Bác Sĩ Xuất Sắc</h3>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Bác sĩ</th>
                  <th>Số ca</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topDoctors.slice(0, 5).map((item) => (
                  <tr key={item.key}>
                    <td>
                      <strong>{item.hoTen}</strong>
                      <span>{item.chuyenKhoa}</span>
                    </td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )

  const renderContent = () => {
    if (activeMenu === 'staff') return renderStaffManagement()
    if (activeMenu === 'services') return renderServiceConfig()
    if (activeMenu === 'schedules') return renderSchedules()
    return renderReports()
  }

  const navItems = [
    { key: 'staff', label: 'Quản lý Nhân sự & Bệnh nhân', icon: Users },
    { key: 'services', label: 'Cấu hình Dịch vụ Chi nhánh', icon: Building2 },
    { key: 'schedules', label: 'Quản lý Lịch trực', icon: Calendar },
    { key: 'reports', label: 'Báo cáo Thống kê', icon: Activity },
  ]

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img src={medicalLogoImage} alt="Medicare" />
          <div>
            <strong>Medicare</strong>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                type="button"
                className={`admin-nav-button ${activeMenu === item.key ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.key)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-box">
            <Stethoscope size={18} />
            <div>
              <strong>{user?.name || 'Quản trị viên'}</strong>
              <span>Toàn quyền hệ thống</span>
            </div>
          </div>
          <button type="button" className="admin-logout-button" onClick={onLogout}>
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">Smart Clinic</span>
            <h1>{navItems.find((item) => item.key === activeMenu)?.label}</h1>
          </div>
          {feedback && <p className="admin-feedback">{feedback}</p>}
        </header>

        {renderContent()}
      </section>
    </main>
  )
}

function DoctorDashboard({ user, onLogout }) {
  const [doctorProfile, setDoctorProfile] = useState({
    MaBacSi: user?.MaBacSi || user?.id || 'BS001',
    HoTen: user?.HoTen || user?.name || 'Nguyễn Văn An',
    ChuyenKhoa: user?.ChuyenKhoa || 'Nội tổng quát',
    SDT: user?.SDT || '0911222333',
    MatKhau: user?.MatKhau || '123456',
    MaChiNhanh: user?.MaChiNhanh || 'CN_CG',
    TenChiNhanh: user?.TenChiNhanh || 'Smart Clinic - Cơ sở Cầu Giấy',
  })
  const [contactForm, setContactForm] = useState({ SDT: doctorProfile.SDT })
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [activeDoctorTab, setActiveDoctorTab] = useState('clinic')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [activeBookingId, setActiveBookingId] = useState('')
  const [selectedVisitId, setSelectedVisitId] = useState('')
  const [historyDetail, setHistoryDetail] = useState(null)
  const [clinicalForm, setClinicalForm] = useState({
    TrieuChung: '',
    MaBenh: 'K29',
    LoiDan: '',
    MaThuoc: 'TH001',
    SoLuong: '10',
    LieuDung: '',
    MaXetNghiem: 'XN_MAU',
    MaDieuTri: 'DT_TRUYEN_DICH',
    TongSoBuoi: '3',
  })
  const [feedback, setFeedback] = useState('')
  const [patients] = useState([
    {
      MaBenhAn: 'BN001',
      HoTen: 'Trần Quang Hải',
      CCCD: '001095012345',
      SDT: '0901234567',
      NgaySinh: '1995-04-12',
      DiaChi: 'Cầu Giấy, Hà Nội',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN004',
      HoTen: 'Lê Hoàng Nam',
      CCCD: '001186000004',
      SDT: '0904000004',
      NgaySinh: '1986-09-20',
      DiaChi: 'Nam Từ Liêm, Hà Nội',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN005',
      HoTen: 'Đỗ Minh Châu',
      CCCD: '001187000005',
      SDT: '0905000005',
      NgaySinh: '1987-02-15',
      DiaChi: 'Thanh Xuân, Hà Nội',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN003',
      HoTen: 'Phạm Lê Minh',
      CCCD: '001221098765',
      SDT: '0911999888',
      NgaySinh: '2021-01-08',
      DiaChi: 'Hai Bà Trưng, Hà Nội',
      KyTuDauBHYT: 'TE',
    },
  ])
  const [services] = useState([
    { MaDichVu: 'DV_KHAM_NOI', TenDichVu: 'Khám Nội Tổng Quát', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_GIA_DINH', TenDichVu: 'Khám Sức Khỏe Gia Đình', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 250000 },
    { MaDichVu: 'DV_KHAM_TIM_MACH', TenDichVu: 'Khám Sàng Lọc Tim Mạch - Huyết Áp', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_KHAM_TIEU_HOA', TenDichVu: 'Khám Tiêu Hóa - Gan Mật', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_RANG', TenDichVu: 'Khám Răng Hàm Mặt Định Kỳ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_KHAM_TMH', TenDichVu: 'Khám Tai Mũi Họng Thông Thường', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'XN_MAU', TenDichVu: 'Xét Nghiệm Công Thức Máu 24 Chỉ Số', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 250000 },
    { MaDichVu: 'SA_O_BUNG', TenDichVu: 'Siêu Âm Ổ Bụng Tổng Quát', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 300000 },
    { MaDichVu: 'XN_SINH_HOA', TenDichVu: 'Xét Nghiệm Sinh Hóa Máu (Gan, Thận, Mỡ Máu)', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 350000 },
    { MaDichVu: 'DT_TRUYEN_DICH', TenDichVu: 'Liệu trình truyền dịch giải độc, bù nước', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Điều trị', GiaGoc: 250000 },
    { MaDichVu: 'DT_RANG_TUY', TenDichVu: 'Liệu Trình Điều Trị Tủy Răng Toàn Diện', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 1200000 },
    { MaDichVu: 'DT_KHIDUNG', TenDichVu: 'Liệu Trình Khí Dung Mũi Họng', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 450000 },
  ])
  const generateDoctorSchedules = () => {
    const doctorSeeds = [
      { MaBacSi: 'BS001', offset: 0 },
      { MaBacSi: 'BS002', offset: 2 },
      { MaBacSi: 'BS015', offset: 4 },
    ]
    const generatedSchedules = []
    let runningIndex = 1

    doctorSeeds.forEach((doctorSeed) => {
      for (
        let time = Date.UTC(2026, 4, 31), dayIndex = 0;
        time <= Date.UTC(2026, 6, 1);
        time += 86400000, dayIndex += 1
      ) {
        const schedulePattern = (dayIndex + doctorSeed.offset) % 7
        const shouldWorkThisDay = [0, 1, 3, 5].includes(schedulePattern)
        if (!shouldWorkThisDay) continue

        const ngayTruc = new Date(time).toISOString().slice(0, 10)
        const caTruc = ((dayIndex + doctorSeed.offset) % 4) + 1
        const maChiNhanh = (dayIndex + doctorSeed.offset) % 3 === 0 ? 'CN_HBT' : 'CN_CG'

        generatedSchedules.push({
          MaLichTruc: `LT_${doctorSeed.MaBacSi}_${String(runningIndex).padStart(3, '0')}`,
          MaBacSi: doctorSeed.MaBacSi,
          MaChiNhanh: maChiNhanh,
          NgayTruc: ngayTruc,
          CaTruc: caTruc,
          TrangThai: 'Đang hoạt động',
        })
        runningIndex += 1
      }
    })

    return generatedSchedules
  }
  const [doctorSchedules] = useState(() => generateDoctorSchedules())
  const [bookings, setBookings] = useState([
    {
      MaLichHen: 'LH_DR_001',
      MaBenhAn: 'BN001',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS001',
      NgayKham: '2026-05-31',
      CaKham: 1,
      STT_HangDoi: 1,
      ThoiGianCheckIn: '08:05',
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_DR_002',
      MaBenhAn: 'BN004',
      MaDichVu: 'DV_KHAM_GIA_DINH',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS001',
      NgayKham: '2026-05-31',
      CaKham: 1,
      STT_HangDoi: 2,
      ThoiGianCheckIn: '08:14',
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_DR_003',
      MaBenhAn: 'BN005',
      MaDichVu: 'DV_KHAM_TIEU_HOA',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS001',
      NgayKham: '2026-05-31',
      CaKham: 1,
      STT_HangDoi: 3,
      ThoiGianCheckIn: '08:21',
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_DR_004',
      MaBenhAn: 'BN003',
      MaDichVu: 'DV_KHAM_RANG',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS002',
      NgayKham: '2026-05-31',
      CaKham: 2,
      STT_HangDoi: 1,
      ThoiGianCheckIn: '09:02',
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_DR_005',
      MaLuotKham: 'LK_001',
      MaBenhAn: 'BN001',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS001',
      NgayKham: '2026-05-10',
      CaKham: 1,
      ThoiGianCheckIn: '08:10',
      TrangThai: 'Đã khám',
    },
    {
      MaLichHen: 'LH_DR_006',
      MaLuotKham: 'LK_002',
      MaBenhAn: 'BN001',
      MaDichVu: 'DV_KHAM_TIEU_HOA',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS001',
      NgayKham: '2026-04-18',
      CaKham: 2,
      ThoiGianCheckIn: '14:05',
      TrangThai: 'Đã khám',
    },
    {
      MaLichHen: 'LH_DR_007',
      MaLuotKham: 'LK_003',
      MaBenhAn: 'BN004',
      MaDichVu: 'DV_KHAM_TIM_MACH',
      MaChiNhanh: 'CN_CG',
      MaBacSi: 'BS001',
      NgayKham: '2026-03-22',
      CaKham: 1,
      ThoiGianCheckIn: '09:30',
      TrangThai: 'Đã khám',
    },
  ])
  const [diseases] = useState([
    { MaBenh: 'K29', TenBenh: 'Viêm dạ dày và tá tràng' },
    { MaBenh: 'K21', TenBenh: 'Trào ngược dạ dày thực quản' },
    { MaBenh: 'J01', TenBenh: 'Viêm xoang cấp' },
    { MaBenh: 'K05', TenBenh: 'Viêm nướu và bệnh nha chu' },
  ])
  const [visitRecords, setVisitRecords] = useState([
    {
      MaLuotKham: 'LK_001',
      MaBenhAn: 'BN001',
      NgayKham: '2026-05-10',
      MaBacSi: 'BS001',
      TrieuChung: 'Đau rát thượng vị, đầy hơi sau ăn, buồn nôn nhẹ.',
      MaBenh: 'K29',
      LoiDan: 'Ăn uống đúng giờ, kiêng đồ cay nóng, tái khám nếu đau tăng.',
    },
    {
      MaLuotKham: 'LK_002',
      MaBenhAn: 'BN001',
      NgayKham: '2026-04-18',
      MaBacSi: 'BS001',
      TrieuChung: 'Ợ nóng sau ăn, đau âm ỉ vùng thượng vị.',
      MaBenh: 'K21',
      LoiDan: 'Không nằm ngay sau ăn, chia nhỏ bữa, dùng thuốc đủ liệu trình.',
    },
    {
      MaLuotKham: 'LK_003',
      MaBenhAn: 'BN004',
      NgayKham: '2026-03-22',
      MaBacSi: 'BS001',
      TrieuChung: 'Mệt mỏi, đau đầu nhẹ, huyết áp dao động.',
      MaBenh: 'K29',
      LoiDan: 'Theo dõi huyết áp tại nhà, ngủ đủ giấc, hạn chế rượu bia.',
    },
    {
      MaLuotKham: 'LK_004',
      MaBenhAn: 'BN003',
      NgayKham: '2026-04-02',
      MaBacSi: 'BS002',
      TrieuChung: 'Chảy máu chân răng khi đánh răng, ê buốt răng hàm dưới.',
      MaBenh: 'K05',
      LoiDan: 'Vệ sinh răng miệng đúng cách, dùng chỉ nha khoa, tái khám nha chu.',
    },
  ])
  const [medicines] = useState([
    { MaThuoc: 'TH001', TenThuoc: 'Omeprazole 20mg', DonViTinh: 'Viên' },
    { MaThuoc: 'TH002', TenThuoc: 'Phosphalugel', DonViTinh: 'Gói' },
    { MaThuoc: 'TH003', TenThuoc: 'Domperidone 10mg', DonViTinh: 'Viên' },
    { MaThuoc: 'TH004', TenThuoc: 'Loratadine 10mg', DonViTinh: 'Viên' },
  ])
  const [prescriptionDetails, setPrescriptionDetails] = useState([
    { MaDonThuoc: 'DT001', MaLuotKham: 'LK_001', MaThuoc: 'TH001', SoLuong: 14, LieuDung: 'Uống 1 viên trước ăn sáng 30 phút trong 14 ngày.' },
    { MaDonThuoc: 'DT002', MaLuotKham: 'LK_001', MaThuoc: 'TH002', SoLuong: 10, LieuDung: 'Uống 1 gói khi đau hoặc nóng rát dạ dày.' },
    { MaDonThuoc: 'DT003', MaLuotKham: 'LK_002', MaThuoc: 'TH003', SoLuong: 10, LieuDung: 'Uống 1 viên trước bữa ăn khi buồn nôn hoặc đầy hơi.' },
    { MaDonThuoc: 'DT004', MaLuotKham: 'LK_003', MaThuoc: 'TH004', SoLuong: 7, LieuDung: 'Uống 1 viên mỗi tối trong 7 ngày.' },
  ])
  const [labDetails, setLabDetails] = useState([
    {
      MaChiTietXN: 'CTXN_001',
      MaLuotKham: 'LK_001',
      MaDichVu: 'XN_MAU',
      KetQuaXetNghiem: 'Bạch cầu trong giới hạn bình thường, Hemoglobin 145 g/L.',
      MaXNV: 'XNV001',
      TrangThaiXetNghiem: 'Đã có kết quả',
    },
    {
      MaChiTietXN: 'CTXN_002',
      MaLuotKham: 'LK_002',
      MaDichVu: 'SA_O_BUNG',
      KetQuaXetNghiem: 'Gan không to, nhu mô gan hơi tăng âm, túi mật không sỏi.',
      MaXNV: 'XNV001',
      TrangThaiXetNghiem: 'Đã có kết quả',
    },
    {
      MaChiTietXN: 'CTXN_003',
      MaLuotKham: 'LK_003',
      MaDichVu: 'XN_SINH_HOA',
      KetQuaXetNghiem: 'Men gan AST/ALT trong giới hạn, chức năng thận bình thường.',
      MaXNV: 'XNV001',
      TrangThaiXetNghiem: 'Đã có kết quả',
    },
  ])
  const [treatmentSchedules, setTreatmentSchedules] = useState([
    {
      MaLichTrinh: 'LTDT_OLD_001',
      MaLuotKham: 'LK_001',
      TenDichVu: 'Liệu trình Điều trị tủy răng sinh học',
      TongSoBuoi: 5,
      SoBuoiDaLam: 2,
      TrangThai: 'Đang tiến hành',
      GhiChuDieuTri: 'Răng đỡ đau, tiếp tục theo dõi và hàn kín vào buổi tới.',
    },
    {
      MaLichTrinh: 'LTDT_OLD_002',
      MaLuotKham: 'LK_003',
      TenDichVu: 'Vật lý trị liệu phục hồi chức năng',
      TongSoBuoi: 3,
      SoBuoiDaLam: 3,
      TrangThai: 'Đã hoàn thành',
      GhiChuDieuTri: 'Răng đỡ đau, tiếp tục theo dõi và hàn kín vào buổi tới.',
    },
  ])

  const getPatient = (maBenhAn) =>
    patients.find((patient) => patient.MaBenhAn === maBenhAn) || {
      MaBenhAn: maBenhAn,
      HoTen: 'Chưa rõ',
      SDT: 'Chưa cập nhật',
    }

  const getService = (maDichVu) =>
    services.find((service) => service.MaDichVu === maDichVu) || {
      MaDichVu: maDichVu,
      TenDichVu: maDichVu,
    }

  const getDisease = (maBenh) =>
    diseases.find((disease) => disease.MaBenh === maBenh) || {
      MaBenh: maBenh,
      TenBenh: 'Chưa xác định',
    }

  const getMedicine = (maThuoc) =>
    medicines.find((medicine) => medicine.MaThuoc === maThuoc) || {
      MaThuoc: maThuoc,
      TenThuoc: maThuoc,
      DonViTinh: '',
    }

  const getShiftLabel = (caTruc) => {
    const labels = {
      1: 'Ca 1 (07:30 - 10:15)',
      2: 'Ca 2 (10:15 - 12:00)',
      3: 'Ca 3 (13:30 - 16:30)',
      4: 'Ca 4 (16:30 - 19:30)',
    }
    return labels[Number(caTruc)] || `Ca ${caTruc}`
  }

  const formatDateKey = (date) => date.toISOString().slice(0, 10)

  const addDays = (date, days) => {
    const nextDate = new Date(date)
    nextDate.setUTCDate(nextDate.getUTCDate() + days)
    return nextDate
  }

  const getWeekStart = (dateKey) => {
    const date = new Date(`${dateKey}T00:00:00Z`)
    const day = date.getUTCDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    return addDays(date, diffToMonday)
  }

  const getWeekdayLabel = (date) => {
    const labels = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    return labels[date.getUTCDay()]
  }

  const getShortBranchName = (maChiNhanh) =>
    maChiNhanh === 'CN_CG'
      ? 'Cơ sở Cầu Giấy'
      : maChiNhanh === 'CN_HBT'
        ? 'Cơ sở Hai Bà Trưng'
        : maChiNhanh

  const buildCurrentVisitId = (booking) =>
    booking ? `LK_${booking.MaLichHen.replace(/\D/g, '').padStart(3, '0')}` : ''

  const labServices = services.filter((service) => service.LoaiDichVu === 'Xét nghiệm')
  const treatmentServices = services.filter((service) => service.LoaiDichVu === 'Điều trị')
  const mySchedules = doctorSchedules
    .filter(
      (schedule) =>
        schedule.MaBacSi === doctorProfile.MaBacSi &&
        schedule.NgayTruc >= '2026-05-31',
    )
    .sort((a, b) => `${a.NgayTruc}-${a.CaTruc}`.localeCompare(`${b.NgayTruc}-${b.CaTruc}`))
  const weeklyScheduleGroups = (() => {
    const groupMap = new Map()

    mySchedules.forEach((schedule) => {
      const weekStartKey = formatDateKey(getWeekStart(schedule.NgayTruc))
      const current = groupMap.get(weekStartKey) || []
      groupMap.set(weekStartKey, [...current, schedule])
    })

    return Array.from(groupMap.entries())
      .map(([weekStartKey, schedules]) => {
        const weekStart = new Date(`${weekStartKey}T00:00:00Z`)
        const days = Array.from({ length: 7 }, (_, index) => {
          const date = addDays(weekStart, index)
          return {
            date,
            dateKey: formatDateKey(date),
            label: getWeekdayLabel(date),
          }
        })

        return {
          weekStartKey,
          weekEndKey: formatDateKey(addDays(weekStart, 6)),
          days,
          schedules,
        }
      })
      .sort((a, b) => a.weekStartKey.localeCompare(b.weekStartKey))
  })()
  const doctorQueue = bookings
    .filter(
      (booking) =>
        booking.TrangThai === 'Chờ khám' &&
        booking.MaBacSi === doctorProfile.MaBacSi &&
        booking.MaChiNhanh === doctorProfile.MaChiNhanh,
    )
    .sort((a, b) => Number(a.STT_HangDoi || 0) - Number(b.STT_HangDoi || 0))

  const activeBooking = bookings.find((booking) => booking.MaLichHen === activeBookingId)
  const activePatient = activeBooking ? getPatient(activeBooking.MaBenhAn) : null
  const patientVisits = activePatient
    ? visitRecords
        .filter((visit) => visit.MaBenhAn === activePatient.MaBenhAn)
        .sort((a, b) => b.NgayKham.localeCompare(a.NgayKham))
    : []
  const selectedVisit =
    patientVisits.find((visit) => visit.MaLuotKham === selectedVisitId) || patientVisits[0] || null
  const selectedPrescriptions = selectedVisit
    ? prescriptionDetails.filter((item) => item.MaLuotKham === selectedVisit.MaLuotKham)
    : []
  const selectedLabs = selectedVisit
    ? labDetails.filter((item) => item.MaLuotKham === selectedVisit.MaLuotKham)
    : []
  const selectedTreatments = selectedVisit
    ? treatmentSchedules.filter((item) => item.MaLuotKham === selectedVisit.MaLuotKham)
    : []
  const currentVisitId = buildCurrentVisitId(activeBooking)
  const currentLabOrders = activeBooking
    ? labDetails.filter((lab) => lab.MaLuotKham === currentVisitId)
    : []
  const currentTreatments = activeBooking
    ? treatmentSchedules.filter((item) => item.MaLuotKham === currentVisitId)
    : []
  const waitingConclusionBookings = bookings
    .filter(
      (booking) =>
        booking.TrangThai === 'Chờ kết luận' &&
        booking.MaBacSi === doctorProfile.MaBacSi &&
        booking.MaChiNhanh === doctorProfile.MaChiNhanh,
    )
    .sort((a, b) => Number(a.STT_HangDoi || 0) - Number(b.STT_HangDoi || 0))
  const allCurrentLabResultsReady =
    currentLabOrders.length === 0 ||
    currentLabOrders.every((lab) => lab.TrangThaiXetNghiem === 'Đã có kết quả')
  const completedEncounterRows = bookings
    .filter(
      (booking) =>
        booking.MaBacSi === doctorProfile.MaBacSi &&
        booking.TrangThai === 'Đã khám' &&
        booking.MaLuotKham,
    )
    .map((booking) => {
      const visit = visitRecords.find((item) => item.MaLuotKham === booking.MaLuotKham)
      const patient = getPatient(booking.MaBenhAn)
      const disease = visit ? getDisease(visit.MaBenh) : getDisease('')
      return { booking, visit, patient, disease }
    })
    .filter((row) => row.visit)
    .sort((a, b) => b.booking.NgayKham.localeCompare(a.booking.NgayKham))

  const handleUpdatePhone = (event) => {
    event.preventDefault()
    setDoctorProfile((current) => ({ ...current, SDT: contactForm.SDT.trim() }))
    setFeedback('Đã cập nhật số điện thoại liên hệ.')
  }

  const handleChangePassword = (event) => {
    event.preventDefault()
    if (passwordForm.oldPassword !== doctorProfile.MatKhau) {
      alert('Mật khẩu cũ không chính xác.')
      return
    }

    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp.')
      return
    }

    setDoctorProfile((current) => ({ ...current, MatKhau: passwordForm.newPassword }))
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordForm(false)
    alert('Đổi mật khẩu thành công!')
    setFeedback('Thông tin bảo mật tài khoản đã được cập nhật.')
  }

  const handleInvitePatient = (booking) => {
    setBookings((current) =>
      current.map((item) =>
        item.MaLichHen === booking.MaLichHen ? { ...item, TrangThai: 'Đang khám' } : item,
      ),
    )
    setActiveBookingId(booking.MaLichHen)
    const patientHistoricalVisits = visitRecords
      .filter((visit) => visit.MaBenhAn === booking.MaBenhAn)
      .sort((a, b) => b.NgayKham.localeCompare(a.NgayKham))
    setSelectedVisitId(patientHistoricalVisits[0]?.MaLuotKham || '')
    setFeedback(`Đã mời ${getPatient(booking.MaBenhAn).HoTen} vào khám.`)
  }

  const handleClinicalFormChange = (field, value) => {
    setClinicalForm((current) => ({ ...current, [field]: value }))
  }

  const handleAddLabOrder = () => {
    if (!activeBooking) {
      alert('Vui lòng mời bệnh nhân vào khám trước khi chỉ định xét nghiệm.')
      return
    }

    const newLabOrder = {
      MaChiTietXN: `CTXN_DR_${String(labDetails.length + 1).padStart(3, '0')}`,
      MaLuotKham: currentVisitId,
      MaDichVu: clinicalForm.MaXetNghiem,
      KetQuaXetNghiem: '',
      MaXNV: '',
      TrangThaiXetNghiem: 'Chưa thực hiện',
      PaymentToken: null,
    }
    setLabDetails((current) => [...current, newLabOrder])
    setFeedback(`Đã thêm chỉ định ${getService(clinicalForm.MaXetNghiem).TenDichVu}.`)
  }

  const handleMockLabResult = (maChiTietXN) => {
    setLabDetails((current) =>
      current.map((lab) =>
        lab.MaChiTietXN === maChiTietXN
          ? {
              ...lab,
              KetQuaXetNghiem: 'Kết quả đã được phòng Lab trả: các chỉ số trong giới hạn tham chiếu.',
              MaXNV: 'XNV001',
              TrangThaiXetNghiem: 'Đã có kết quả',
              PaymentToken: lab.PaymentToken || 'PAY_LAB_SIMULATED',
            }
          : lab,
      ),
    )
    setFeedback('Đã mô phỏng phòng Lab trả kết quả realtime.')
  }

  const handleAddTreatmentPlan = () => {
    if (!activeBooking) {
      alert('Vui lòng mời bệnh nhân vào khám trước khi chỉ định điều trị.')
      return
    }

    const totalSessions = Number(clinicalForm.TongSoBuoi)
    if (!Number.isInteger(totalSessions) || totalSessions <= 0) {
      alert('Tổng số buổi điều trị phải là số nguyên dương.')
      return
    }

    const newTreatment = {
      MaLichTrinh: `LTDT_DR_${String(treatmentSchedules.length + 1).padStart(3, '0')}`,
      MaLuotKham: currentVisitId,
      MaDichVu: clinicalForm.MaDieuTri,
      TongSoBuoi: totalSessions,
      SoBuoiDaLam: 0,
      TrangThai: 'Chưa thực hiện',
    }
    setTreatmentSchedules((current) => [...current, newTreatment])
    setFeedback(`Đã chỉ định liệu trình ${getService(clinicalForm.MaDieuTri).TenDichVu}.`)
  }

  const handlePauseForLab = () => {
    if (!activeBooking) return
    if (currentLabOrders.length === 0) {
      alert('Chưa có chỉ định xét nghiệm nào để chuyển ca sang trạng thái chờ kết quả.')
      return
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.MaLichHen === activeBooking.MaLichHen
          ? { ...booking, TrangThai: 'Chờ kết luận' }
          : booking,
      ),
    )
    setActiveBookingId('')
    setFeedback('Đã tạm hoãn ca khám và chuyển bệnh nhân sang danh sách chờ kết luận.')
  }

  const handleRecallPatient = (booking) => {
    setBookings((current) =>
      current.map((item) =>
        item.MaLichHen === booking.MaLichHen ? { ...item, TrangThai: 'Đang khám' } : item,
      ),
    )
    setActiveBookingId(booking.MaLichHen)
    const patientHistoricalVisits = visitRecords
      .filter((visit) => visit.MaBenhAn === booking.MaBenhAn)
      .sort((a, b) => b.NgayKham.localeCompare(a.NgayKham))
    setSelectedVisitId(patientHistoricalVisits[0]?.MaLuotKham || '')
    setFeedback(`Đã gọi lại ${getPatient(booking.MaBenhAn).HoTen} vào phòng để kết luận.`)
  }

  const handleCompleteExam = () => {
    if (!activeBooking || !activePatient) return
    if (!allCurrentLabResultsReady) {
      alert('Chưa có đủ kết quả xét nghiệm để hoàn thành lượt khám.')
      return
    }

    const finalVisit = {
      MaLuotKham: currentVisitId,
      MaBenhAn: activePatient.MaBenhAn,
      NgayKham: activeBooking.NgayKham,
      MaBacSi: doctorProfile.MaBacSi,
      TrieuChung: clinicalForm.TrieuChung.trim() || 'Bác sĩ chưa ghi nhận triệu chứng chi tiết.',
      MaBenh: clinicalForm.MaBenh,
      LoiDan: clinicalForm.LoiDan.trim() || 'Theo dõi tại nhà và tái khám khi có dấu hiệu bất thường.',
    }
    const hasVisit = visitRecords.some((visit) => visit.MaLuotKham === currentVisitId)
    if (!hasVisit) {
      setVisitRecords((current) => [finalVisit, ...current])
    }

    if (clinicalForm.LieuDung.trim()) {
      setPrescriptionDetails((current) => [
        ...current,
        {
          MaDonThuoc: `DT_DR_${String(current.length + 1).padStart(3, '0')}`,
          MaLuotKham: currentVisitId,
          MaThuoc: clinicalForm.MaThuoc,
          SoLuong: Number(clinicalForm.SoLuong) || 1,
          LieuDung: clinicalForm.LieuDung.trim(),
        },
      ])
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.MaLichHen === activeBooking.MaLichHen
          ? { ...booking, MaLuotKham: currentVisitId, TrangThai: 'Đã khám' }
          : booking,
      ),
    )
    setActiveBookingId('')
    setClinicalForm((current) => ({
      ...current,
      TrieuChung: '',
      LoiDan: '',
      LieuDung: '',
      SoLuong: '10',
      TongSoBuoi: '3',
    }))
    setFeedback(`Đã hoàn thành lượt khám ${currentVisitId} và lưu vào sổ khám bệnh.`)
  }

  return (
    <main className="doctor-shell">
      <header className="doctor-topbar">
        <div>
          <span className="doctor-kicker">Smart Clinic Doctor Workspace</span>
          <h1>Xin chào, Bác sĩ {doctorProfile.HoTen}</h1>
          <p>
            Chuyên khoa: <strong>{doctorProfile.ChuyenKhoa}</strong> · Chi nhánh:{' '}
            <strong>{doctorProfile.TenChiNhanh}</strong>
          </p>
        </div>
        <button type="button" className="doctor-logout-button" onClick={onLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </header>

      {feedback && <p className="doctor-feedback">{feedback}</p>}

      <nav className="doctor-tab-row">
        <button
          type="button"
          className={activeDoctorTab === 'clinic' ? 'active' : ''}
          onClick={() => setActiveDoctorTab('clinic')}
        >
          🩺 Phòng khám
        </button>
        <button
          type="button"
          className={activeDoctorTab === 'schedule' ? 'active' : ''}
          onClick={() => setActiveDoctorTab('schedule')}
        >
          📅 Lịch trực của tôi
        </button>
        <button
          type="button"
          className={activeDoctorTab === 'history' ? 'active' : ''}
          onClick={() => setActiveDoctorTab('history')}
        >
          📚 Lịch sử đợt khám
        </button>
      </nav>

      {activeDoctorTab === 'clinic' ? (
        <>
          <section className="doctor-grid">
        <article className="doctor-card">
          <div className="doctor-section-header">
            <div>
              <h2>Cài đặt tài khoản</h2>
              <p>Cập nhật thông tin liên hệ và bảo mật cá nhân.</p>
            </div>
          </div>
          <form className="doctor-settings-form" onSubmit={handleUpdatePhone}>
            <label>
              Mã bác sĩ
              <input value={doctorProfile.MaBacSi} disabled />
            </label>
            <label>
              Chuyên khoa
              <input value={doctorProfile.ChuyenKhoa} disabled />
            </label>
            <label>
              Số điện thoại
              <input
                value={contactForm.SDT}
                onChange={(event) => setContactForm({ SDT: event.target.value })}
              />
            </label>
            <button type="submit" className="doctor-primary-button">
              Lưu số điện thoại
            </button>
          </form>
          <button
            type="button"
            className="doctor-secondary-button"
            onClick={() => setShowPasswordForm((current) => !current)}
          >
            Đổi mật khẩu
          </button>
          {showPasswordForm && (
            <form className="doctor-password-form" onSubmit={handleChangePassword}>
              <label>
                Mật khẩu cũ
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, oldPassword: event.target.value }))
                  }
                />
              </label>
              <label>
                Mật khẩu mới
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                  }
                />
              </label>
              <label>
                Xác nhận mật khẩu mới
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
              </label>
              <button type="submit" className="doctor-primary-button">
                Xác nhận đổi mật khẩu
              </button>
            </form>
          )}
        </article>

        <article className="doctor-card">
          <div className="doctor-section-header">
            <div>
              <h2>Danh sách bệnh nhân đang chờ</h2>
              <p>Hàng đợi lọc theo bác sĩ và chi nhánh đang đăng nhập.</p>
            </div>
            <strong>{doctorQueue.length} ca chờ</strong>
          </div>
          <div className="doctor-table-wrap">
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>STT hàng đợi</th>
                  <th>Họ tên</th>
                  <th>Ca khám</th>
                  <th>Dịch vụ đăng ký</th>
                  <th>Thời gian check-in</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {doctorQueue.map((booking) => {
                  const patient = getPatient(booking.MaBenhAn)
                  const service = getService(booking.MaDichVu)
                  return (
                    <tr key={booking.MaLichHen}>
                      <td>{booking.STT_HangDoi}</td>
                      <td>
                        <strong>{patient.HoTen}</strong>
                        <span>{patient.MaBenhAn}</span>
                      </td>
                      <td>Ca {booking.CaKham}</td>
                      <td>{service.TenDichVu}</td>
                      <td>{booking.ThoiGianCheckIn}</td>
                      <td>
                        <button
                          type="button"
                          className="doctor-primary-button compact"
                          onClick={() => handleInvitePatient(booking)}
                        >
                          🩺 Mời vào khám
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {doctorQueue.length === 0 && (
                  <tr>
                    <td colSpan="6" className="doctor-empty-cell">
                      Không còn bệnh nhân nào đang chờ bác sĩ.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="doctor-card">
        <div className="doctor-section-header">
          <div>
            <h2>Danh sách chờ kết luận</h2>
            <p>Bệnh nhân đã khám vòng 1 và đang chờ đủ kết quả cận lâm sàng.</p>
          </div>
          <strong>{waitingConclusionBookings.length} ca chờ kết luận</strong>
        </div>
        <div className="doctor-table-wrap">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Ca khám</th>
                <th>Dịch vụ</th>
                <th>Trạng thái xét nghiệm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {waitingConclusionBookings.map((booking) => {
                const patient = getPatient(booking.MaBenhAn)
                const currentLabs = labDetails.filter((lab) => lab.MaLuotKham === buildCurrentVisitId(booking))
                const readyCount = currentLabs.filter((lab) => lab.TrangThaiXetNghiem === 'Đã có kết quả').length
                return (
                  <tr key={booking.MaLichHen}>
                    <td>{booking.STT_HangDoi}</td>
                    <td>
                      <strong>{patient.HoTen}</strong>
                      <span>{patient.MaBenhAn}</span>
                    </td>
                    <td>Ca {booking.CaKham}</td>
                    <td>{getService(booking.MaDichVu).TenDichVu}</td>
                    <td>
                      {readyCount}/{currentLabs.length} kết quả
                    </td>
                    <td>
                      <button
                        type="button"
                        className="doctor-secondary-button compact"
                        onClick={() => handleRecallPatient(booking)}
                      >
                        Gọi lại vào phòng
                      </button>
                    </td>
                  </tr>
                )
              })}
              {waitingConclusionBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="doctor-empty-cell">
                    Không có bệnh nhân đang chờ kết luận.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doctor-card">
        <div className="doctor-section-header">
          <div>
            <h2>Hồ sơ thăm khám</h2>
            <p>Truy cập lịch sử khám bệnh, đơn thuốc và xét nghiệm cũ của bệnh nhân đang khám.</p>
          </div>
        </div>

        {!activePatient ? (
          <div className="doctor-empty-state">Chọn một bệnh nhân từ hàng đợi để mở hồ sơ thăm khám.</div>
        ) : (
          <div className="doctor-record-layout">
            <aside className="doctor-patient-summary">
              <span>Đang khám</span>
              <h3>{activePatient.HoTen}</h3>
              <p>
                {activePatient.MaBenhAn} · CCCD {activePatient.CCCD}
              </p>
              <p>
                SĐT {activePatient.SDT} · {activePatient.DiaChi}
              </p>
              <strong>Trạng thái: Đang khám</strong>
            </aside>

            <div className="doctor-record-main">
              <div className="doctor-command-panel">
                <h3>Lệnh lâm sàng lượt khám hiện tại</h3>
                <div className="doctor-command-grid">
                  <label>
                    Triệu chứng
                    <textarea
                      value={clinicalForm.TrieuChung}
                      onChange={(event) => handleClinicalFormChange('TrieuChung', event.target.value)}
                      placeholder="Nhập triệu chứng lâm sàng hiện tại..."
                    />
                  </label>
                  <label>
                    Mã bệnh ICD-10
                    <select
                      value={clinicalForm.MaBenh}
                      onChange={(event) => handleClinicalFormChange('MaBenh', event.target.value)}
                    >
                      {diseases.map((disease) => (
                        <option key={disease.MaBenh} value={disease.MaBenh}>
                          {disease.MaBenh} - {disease.TenBenh}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Lời dặn
                    <textarea
                      value={clinicalForm.LoiDan}
                      onChange={(event) => handleClinicalFormChange('LoiDan', event.target.value)}
                      placeholder="Nhập lời dặn, hướng theo dõi hoặc lịch tái khám..."
                    />
                  </label>
                  <label>
                    Kê thuốc nhanh
                    <select
                      value={clinicalForm.MaThuoc}
                      onChange={(event) => handleClinicalFormChange('MaThuoc', event.target.value)}
                    >
                      {medicines.map((medicine) => (
                        <option key={medicine.MaThuoc} value={medicine.MaThuoc}>
                          {medicine.TenThuoc}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Số lượng
                    <input
                      type="number"
                      min="1"
                      value={clinicalForm.SoLuong}
                      onChange={(event) => handleClinicalFormChange('SoLuong', event.target.value)}
                    />
                  </label>
                  <label className="doctor-command-wide">
                    Liều dùng
                    <input
                      value={clinicalForm.LieuDung}
                      onChange={(event) => handleClinicalFormChange('LieuDung', event.target.value)}
                      placeholder="Ví dụ: Uống 1 viên sau ăn sáng trong 7 ngày"
                    />
                  </label>
                </div>

                <div className="doctor-order-grid">
                  <section>
                    <h3>Chỉ định xét nghiệm cận lâm sàng</h3>
                    <div className="doctor-inline-order">
                      <select
                        value={clinicalForm.MaXetNghiem}
                        onChange={(event) => handleClinicalFormChange('MaXetNghiem', event.target.value)}
                      >
                        {labServices.map((service) => (
                          <option key={service.MaDichVu} value={service.MaDichVu}>
                            {service.TenDichVu}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="doctor-secondary-button" onClick={handleAddLabOrder}>
                        Thêm chỉ định CLS
                      </button>
                    </div>
                    <div className="doctor-lab-grid">
                      {currentLabOrders.map((lab) => (
                        <article key={lab.MaChiTietXN} className="doctor-lab-card">
                          <span>{getService(lab.MaDichVu).TenDichVu}</span>
                          <strong className={lab.TrangThaiXetNghiem === 'Đã có kết quả' ? 'done' : 'pending'}>
                            {lab.TrangThaiXetNghiem === 'Đã có kết quả'
                              ? 'Đã có kết quả'
                              : 'Chờ phòng Lab/Thanh toán'}
                          </strong>
                          <p>{lab.KetQuaXetNghiem || 'Chưa có kết quả từ phòng Lab.'}</p>
                          {lab.TrangThaiXetNghiem === 'Chưa thực hiện' && (
                            <button
                              type="button"
                              className="doctor-secondary-button compact"
                              onClick={() => handleMockLabResult(lab.MaChiTietXN)}
                            >
                              Mô phỏng Lab trả kết quả
                            </button>
                          )}
                        </article>
                      ))}
                      {currentLabOrders.length === 0 && (
                        <p className="doctor-empty-state compact">Chưa có chỉ định xét nghiệm mới.</p>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3>Chỉ định Liệu trình Điều trị Chuyên sâu</h3>
                    <div className="doctor-inline-order">
                      <select
                        value={clinicalForm.MaDieuTri}
                        onChange={(event) => handleClinicalFormChange('MaDieuTri', event.target.value)}
                      >
                        {treatmentServices.map((service) => (
                          <option key={service.MaDichVu} value={service.MaDichVu}>
                            {service.TenDichVu}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={clinicalForm.TongSoBuoi}
                        onChange={(event) => handleClinicalFormChange('TongSoBuoi', event.target.value)}
                        aria-label="Tổng số buổi chỉ định"
                      />
                      <button type="button" className="doctor-secondary-button" onClick={handleAddTreatmentPlan}>
                        ➕ Xác nhận chỉ định điều trị
                      </button>
                    </div>
                    <div className="doctor-treatment-list">
                      {currentTreatments.map((item) => (
                        <article key={item.MaLichTrinh}>
                          <strong>{getService(item.MaDichVu).TenDichVu}</strong>
                          <span>
                            {item.SoBuoiDaLam}/{item.TongSoBuoi} buổi - {item.TrangThai}
                          </span>
                        </article>
                      ))}
                      {currentTreatments.length === 0 && (
                        <p className="doctor-empty-state compact">Chưa chỉ định liệu trình điều trị.</p>
                      )}
                    </div>
                  </section>
                </div>

                <div className="doctor-exam-actions">
                  <button type="button" className="doctor-warning-button" onClick={handlePauseForLab}>
                    ⏳ Tạm hoãn - Chờ kết quả Xét nghiệm
                  </button>
                  <button type="button" className="doctor-finish-button" onClick={handleCompleteExam}>
                    🏁 Hoàn thành lượt khám
                  </button>
                </div>
              </div>

              <div className="doctor-history-grid">
              <div className="doctor-visit-list">
                <h3>Lịch sử đợt khám</h3>
                {patientVisits.map((visit) => {
                  const disease = getDisease(visit.MaBenh)
                  return (
                    <button
                      key={visit.MaLuotKham}
                      type="button"
                      className={selectedVisit?.MaLuotKham === visit.MaLuotKham ? 'active' : ''}
                      onClick={() => setSelectedVisitId(visit.MaLuotKham)}
                    >
                      <span>{visit.NgayKham}</span>
                      <strong>{visit.MaLuotKham}</strong>
                      <small>{disease.TenBenh}</small>
                    </button>
                  )
                })}
                {patientVisits.length === 0 && (
                  <p className="doctor-empty-state compact">Chưa có lịch sử khám cũ.</p>
                )}
              </div>

              <div className="doctor-visit-detail">
                {selectedVisit ? (
                  <>
                    <div className="doctor-clinical-box">
                      <h3>Chẩn đoán lâm sàng</h3>
                      <p>
                        <strong>Triệu chứng:</strong> {selectedVisit.TrieuChung}
                      </p>
                      <p>
                        <strong>ICD-10:</strong> {selectedVisit.MaBenh} -{' '}
                        {getDisease(selectedVisit.MaBenh).TenBenh}
                      </p>
                      <p>
                        <strong>Lời dặn:</strong> {selectedVisit.LoiDan}
                      </p>
                    </div>

                    <div className="doctor-subsection">
                      <h3>Đơn thuốc cũ</h3>
                      <table className="doctor-table compact">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên thuốc</th>
                            <th>Số lượng</th>
                            <th>Đơn vị</th>
                            <th>Liều dùng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPrescriptions.map((item, index) => {
                            const medicine = getMedicine(item.MaThuoc)
                            return (
                              <tr key={item.MaDonThuoc}>
                                <td>{index + 1}</td>
                                <td>{medicine.TenThuoc}</td>
                                <td>{item.SoLuong}</td>
                                <td>{medicine.DonViTinh}</td>
                                <td>{item.LieuDung}</td>
                              </tr>
                            )
                          })}
                          {selectedPrescriptions.length === 0 && (
                            <tr>
                              <td colSpan="5" className="doctor-empty-cell">
                                Không có đơn thuốc trong lượt khám này.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="doctor-subsection">
                      <h3>Kết quả xét nghiệm cũ</h3>
                      <div className="doctor-lab-grid">
                        {selectedLabs.map((lab) => (
                          <article key={lab.MaChiTietXN} className="doctor-lab-card">
                            <span>{getService(lab.MaDichVu).TenDichVu}</span>
                            <strong>{lab.TrangThaiXetNghiem}</strong>
                            <p>{lab.KetQuaXetNghiem || 'Chưa có kết quả.'}</p>
                          </article>
                        ))}
                        {selectedLabs.length === 0 && (
                          <p className="doctor-empty-state compact">Không có xét nghiệm trong lượt khám này.</p>
                        )}
                      </div>
                    </div>

                    <div className="doctor-subsection">
                      <h3>Liệu trình điều trị cũ</h3>
                      <div className="doctor-treatment-history-list">
                        {selectedTreatments.map((treatment) => (
                          <article key={treatment.MaLichTrinh}>
                            <strong>{treatment.TenDichVu || getService(treatment.MaDichVu).TenDichVu}</strong>
                            <div>
                              <span>Tổng số buổi: {treatment.TongSoBuoi}</span>
                              <span>Đã làm: {treatment.SoBuoiDaLam}</span>
                              <span>{treatment.TrangThai}</span>
                            </div>
                            <p>{treatment.GhiChuDieuTri}</p>
                          </article>
                        ))}
                        {selectedTreatments.length === 0 && (
                          <p className="doctor-empty-state compact">Không có liệu trình điều trị trong lượt khám này.</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="doctor-empty-state">Chưa chọn đợt khám lịch sử.</div>
                )}
	              </div>
              </div>
            </div>
          </div>
        )}
      </section>
        </>
      ) : activeDoctorTab === 'schedule' ? (
        <section className="doctor-card">
          <div className="doctor-section-header">
            <div>
              <h2>Lịch trực cá nhân theo tuần</h2>
              <p>Chỉ hiển thị lịch từ ngày 2026-05-31 trở đi, gồm đủ 4 ca vận hành. Nghỉ trưa: 12:00 - 13:30.</p>
            </div>
            <strong>{mySchedules.length} ca trực</strong>
          </div>
          {weeklyScheduleGroups.length > 0 ? (
            <div className="doctor-weekly-stack">
              {weeklyScheduleGroups.map((week, index) => (
                <section key={week.weekStartKey} className="doctor-weekly-card">
                  <header>
                    <h3>{index === 0 ? 'Tuần hiện tại' : `Tuần ${index + 1}`}</h3>
                    <span>
                      {week.weekStartKey} đến {week.weekEndKey}
                    </span>
                  </header>
                  <div className="doctor-week-grid">
                    <div className="doctor-week-cell header shift">Ca trực</div>
                    {week.days.map((day) => (
                      <div key={day.dateKey} className="doctor-week-cell header">
                        <strong>{day.label}</strong>
                        <span>{day.dateKey.slice(5)}</span>
                      </div>
                    ))}
                    {[1, 2, 3, 4].map((shift) => (
                      <div key={shift} className="doctor-week-row">
                        <div className="doctor-week-cell shift-label">{getShiftLabel(shift)}</div>
                        {week.days.map((day) => {
                          const schedule = week.schedules.find(
                            (item) =>
                              item.NgayTruc === day.dateKey &&
                              Number(item.CaTruc) === Number(shift),
                          )
                          return (
                            <div key={`${day.dateKey}-${shift}`} className="doctor-week-cell">
                              {schedule ? (
                                <span className="doctor-schedule-badge">
                                  {getShortBranchName(schedule.MaChiNhanh)} ({schedule.MaChiNhanh})
                                </span>
                              ) : (
                                <span className="doctor-week-empty">-</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="doctor-empty-state">Chưa có lịch trực tương lai nào được phân cho bác sĩ.</div>
          )}
        </section>
      ) : (
        <section className="doctor-card">
          <div className="doctor-section-header">
            <div>
              <h2>Lịch sử đợt khám</h2>
              <p>Các lượt khám đã hoàn thành của bác sĩ, có thể mở chi tiết đơn thuốc và xét nghiệm.</p>
            </div>
            <strong>{completedEncounterRows.length} lượt khám</strong>
          </div>
          <div className="doctor-table-wrap">
            <table className="doctor-table doctor-history-table">
              <thead>
                <tr>
                  <th>Ngày khám</th>
                  <th>Mã lượt khám</th>
                  <th>Họ tên bệnh nhân</th>
                  <th>Chẩn đoán</th>
                  <th>Triệu chứng</th>
                  <th>Lời dặn</th>
                </tr>
              </thead>
              <tbody>
                {completedEncounterRows.map((row) => (
                  <tr
                    key={row.visit.MaLuotKham}
                    className="doctor-clickable-row"
                    onClick={() => setHistoryDetail(row)}
                  >
                    <td>{row.booking.NgayKham}</td>
                    <td>{row.visit.MaLuotKham}</td>
                    <td>
                      <strong>{row.patient.HoTen}</strong>
                      <span>{row.patient.MaBenhAn}</span>
                    </td>
                    <td>
                      {row.visit.MaBenh} - {row.disease.TenBenh}
                    </td>
                    <td>{row.visit.TrieuChung}</td>
                    <td>{row.visit.LoiDan}</td>
                  </tr>
                ))}
                {completedEncounterRows.length === 0 && (
                  <tr>
                    <td colSpan="6" className="doctor-empty-cell">
                      Chưa có lượt khám đã hoàn thành.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {historyDetail && (
        <div className="doctor-history-modal-overlay">
          <section className="doctor-history-modal">
            <button
              type="button"
              className="doctor-history-modal-close"
              onClick={() => setHistoryDetail(null)}
              aria-label="Đóng chi tiết lịch sử khám"
            >
              ×
            </button>
            <span className="doctor-kicker">Chi tiết lượt khám</span>
            <h2>
              {historyDetail.visit.MaLuotKham} - {historyDetail.patient.HoTen}
            </h2>
            <div className="doctor-history-modal-grid">
              <section>
                <h3>Đơn thuốc cũ</h3>
                <table className="doctor-table compact">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên thuốc</th>
                      <th>Số lượng</th>
                      <th>Đơn vị</th>
                      <th>Liều dùng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptionDetails
                      .filter((item) => item.MaLuotKham === historyDetail.visit.MaLuotKham)
                      .map((item, index) => {
                        const medicine = getMedicine(item.MaThuoc)
                        return (
                          <tr key={item.MaDonThuoc}>
                            <td>{index + 1}</td>
                            <td>{medicine.TenThuoc}</td>
                            <td>{item.SoLuong}</td>
                            <td>{medicine.DonViTinh}</td>
                            <td>{item.LieuDung}</td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </section>
              <section>
                <h3>Kết quả xét nghiệm cũ</h3>
                <div className="doctor-lab-grid">
                  {labDetails
                    .filter((lab) => lab.MaLuotKham === historyDetail.visit.MaLuotKham)
                    .map((lab) => (
                      <article key={lab.MaChiTietXN} className="doctor-lab-card">
                        <span>{getService(lab.MaDichVu).TenDichVu}</span>
                        <strong className="done">{lab.TrangThaiXetNghiem}</strong>
                        <p>{lab.KetQuaXetNghiem || 'Chưa có kết quả.'}</p>
                      </article>
                    ))}
                  {labDetails.filter((lab) => lab.MaLuotKham === historyDetail.visit.MaLuotKham).length === 0 && (
                    <p className="doctor-empty-state compact">Không có xét nghiệm trong lượt khám này.</p>
                  )}
                </div>
              </section>
              <section>
                <h3>Liệu trình điều trị cũ</h3>
                <div className="doctor-treatment-history-list">
                  {treatmentSchedules
                    .filter((treatment) => treatment.MaLuotKham === historyDetail.visit.MaLuotKham)
                    .map((treatment) => (
                      <article key={treatment.MaLichTrinh}>
                        <strong>{treatment.TenDichVu || getService(treatment.MaDichVu).TenDichVu}</strong>
                        <div>
                          <span>Tổng số buổi: {treatment.TongSoBuoi}</span>
                          <span>Đã làm: {treatment.SoBuoiDaLam}</span>
                          <span>{treatment.TrangThai}</span>
                        </div>
                        <p>{treatment.GhiChuDieuTri}</p>
                      </article>
                    ))}
                  {treatmentSchedules.filter((treatment) => treatment.MaLuotKham === historyDetail.visit.MaLuotKham).length === 0 && (
                    <p className="doctor-empty-state compact">Không có liệu trình điều trị trong lượt khám này.</p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

function ReceptionistDashboard({ user, onLogout }) {
  const TODAY = '2026-05-31'
  const [activeQueueTab, setActiveQueueTab] = useState('prebooked')
  const [searchTerm, setSearchTerm] = useState('')
  const [feedback, setFeedback] = useState('')
  const [branches] = useState([
    {
      MaChiNhanh: 'CN_CG',
      TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      DiaChi: 'Số 1 Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    },
    {
      MaChiNhanh: 'CN_HBT',
      TenChiNhanh: 'Smart Clinic - Cơ sở Hai Bà Trưng',
      DiaChi: 'Số 99 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    },
  ])
  const [services] = useState([
    { MaDichVu: 'DV_KHAM_NOI', TenDichVu: 'Khám Nội Tổng Quát', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_GIA_DINH', TenDichVu: 'Khám Sức Khỏe Gia Đình', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 250000 },
    { MaDichVu: 'DV_KHAM_LAO_KHOA', TenDichVu: 'Khám Tư Vấn Sức Khỏe Lão Khoa', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_TIM_MACH', TenDichVu: 'Khám Sàng Lọc Tim Mạch - Huyết Áp', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_KHAM_TIEU_HOA', TenDichVu: 'Khám Tiêu Hóa - Gan Mật', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_HO_HAP', TenDichVu: 'Khám Bệnh Lý Đường Hô Hấp', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 170000 },
    { MaDichVu: 'DV_KHAM_NOI_TIET', TenDichVu: 'Khám Sàng Lọc Tiểu Đường & Nội Tiết', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 220000 },
    { MaDichVu: 'DV_KHAM_DINH_DUONG', TenDichVu: 'Khám Tư Vấn Dinh Dưỡng Chuyên Sâu', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_RANG', TenDichVu: 'Khám Răng Hàm Mặt Định Kỳ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_LAY_CAO', TenDichVu: 'Lấy Cao Răng Và Đánh Bóng Thẩm Mỹ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_NIENG_RANG', TenDichVu: 'Khám Tư Vấn Chỉnh Nha/Niềng Răng', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 300000 },
    { MaDichVu: 'DV_KHAM_IMPLANT', TenDichVu: 'Khám Tư Vấn Trồng Răng Implant', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 300000 },
    { MaDichVu: 'DV_KHAM_TMH', TenDichVu: 'Khám Tai Mũi Họng Thông Thường', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_NOI_SOI_TMH', TenDichVu: 'Nội Soi Tai Mũi Họng Ống Mềm', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 250000 },
    { MaDichVu: 'DV_KHAM_THINH_LUC', TenDichVu: 'Khám Đo Thính Lực Đơn Âm', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
  ])
  const [staffList] = useState([
    { MaBacSi: 'BS001', HoTen: 'Nguyễn Văn An', ChuyenKhoa: 'Nội tổng quát', SDT: '0911222333' },
    { MaBacSi: 'BS002', HoTen: 'Lê Thị Bình', ChuyenKhoa: 'Răng hàm mặt', SDT: '0922333444' },
    { MaBacSi: 'BS003', HoTen: 'Phạm Hoàng Long', ChuyenKhoa: 'Tai mũi họng', SDT: '0933444555' },
    { MaBacSi: 'BS004', HoTen: 'Trần Trần Đức', ChuyenKhoa: 'Nội tổng quát', SDT: '0944555666' },
    { MaBacSi: 'BS005', HoTen: 'Nguyễn Thị Minh', ChuyenKhoa: 'Nội tổng quát', SDT: '0912345678' },
    { MaBacSi: 'BS006', HoTen: 'Phan Văn Khải', ChuyenKhoa: 'Răng hàm mặt', SDT: '0923456789' },
    { MaBacSi: 'BS007', HoTen: 'Hoàng Lê Giang', ChuyenKhoa: 'Tai mũi họng', SDT: '0934567890' },
    { MaBacSi: 'BS008', HoTen: 'Vũ Ngô Hùng', ChuyenKhoa: 'Răng hàm mặt', SDT: '0945678901' },
    { MaBacSi: 'BS009', HoTen: 'Đỗ Thúy Hạnh', ChuyenKhoa: 'Nội tổng quát', SDT: '0913456789' },
    { MaBacSi: 'BS010', HoTen: 'Bùi Chí Kiên', ChuyenKhoa: 'Răng hàm mặt', SDT: '0924567890' },
    { MaBacSi: 'BS011', HoTen: 'Lý Thu Thảo', ChuyenKhoa: 'Tai mũi họng', SDT: '0935678901' },
    { MaBacSi: 'BS012', HoTen: 'Đặng Quốc Bảo', ChuyenKhoa: 'Tai mũi họng', SDT: '0946789012' },
    { MaBacSi: 'BS013', HoTen: 'Ngô Bảo Ngọc', ChuyenKhoa: 'Nội tổng quát', SDT: '0914567890' },
    { MaBacSi: 'BS014', HoTen: 'Dương Văn Lâm', ChuyenKhoa: 'Răng hàm mặt', SDT: '0925678901' },
    { MaBacSi: 'BS015', HoTen: 'Võ Thị Sáu', ChuyenKhoa: 'Tai mũi họng', SDT: '0936789012' },
    { MaBacSi: 'BS016', HoTen: 'Tống Phước Hải', ChuyenKhoa: 'Nội tổng quát', SDT: '0947890123' },
    { MaBacSi: 'BS017', HoTen: 'Đinh Công Mạnh', ChuyenKhoa: 'Nội tổng quát', SDT: '0915678901' },
    { MaBacSi: 'BS018', HoTen: 'Mai Phương Thảo', ChuyenKhoa: 'Răng hàm mặt', SDT: '0926789012' },
    { MaBacSi: 'BS019', HoTen: 'Hồ Tiến Dũng', ChuyenKhoa: 'Tai mũi họng', SDT: '0937890123' },
    { MaBacSi: 'BS020', HoTen: 'Trịnh Đình Quang', ChuyenKhoa: 'Răng hàm mặt', SDT: '0948901234' },
    { MaBacSi: 'BS021', HoTen: 'Vương Kim Chi', ChuyenKhoa: 'Nội tổng quát', SDT: '0916789012' },
    { MaBacSi: 'BS022', HoTen: 'Đoàn Nguyên Đức', ChuyenKhoa: 'Răng hàm mặt', SDT: '0927890123' },
    { MaBacSi: 'BS023', HoTen: 'Lưu Hồng Quang', ChuyenKhoa: 'Tai mũi họng', SDT: '0938901234' },
  ])
  const [patients] = useState([
    {
      MaBenhAn: 'BN001',
      HoTen: 'Trần Quang Hải',
      CCCD: '001095012345',
      SDT: '0901234567',
      DiaChi: 'Cầu Giấy, Hà Nội',
      MaSoBHYT: 'DN4010123456789',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN002',
      HoTen: 'Nguyễn Thị Mai',
      CCCD: '001200054321',
      SDT: '0907654321',
      DiaChi: 'Hai Bà Trưng, Hà Nội',
      MaSoBHYT: '',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN003',
      HoTen: 'Phạm Lê Minh',
      CCCD: '001221098765',
      SDT: '0911999888',
      DiaChi: 'Đống Đa, Hà Nội',
      MaSoBHYT: 'TE1010999888777',
      KyTuDauBHYT: 'TE',
    },
    {
      MaBenhAn: 'BN004',
      HoTen: 'Lê Hoàng Nam',
      CCCD: '001186000004',
      SDT: '0904000004',
      DiaChi: 'Nam Từ Liêm, Hà Nội',
      MaSoBHYT: 'DN401000000004',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN005',
      HoTen: 'Đỗ Minh Châu',
      CCCD: '001187000005',
      SDT: '0905000005',
      DiaChi: 'Thanh Xuân, Hà Nội',
      MaSoBHYT: '',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN006',
      HoTen: 'Vũ Gia Hân',
      CCCD: '001188000006',
      SDT: '0906000006',
      DiaChi: 'Ba Đình, Hà Nội',
      MaSoBHYT: 'HT401000000006',
      KyTuDauBHYT: 'HT',
    },
    {
      MaBenhAn: 'BN007',
      HoTen: 'Hoàng Đức Anh',
      CCCD: '001189000007',
      SDT: '0907000007',
      DiaChi: 'Cầu Giấy, Hà Nội',
      MaSoBHYT: 'DN401000000007',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN008',
      HoTen: 'Phan Ngọc Linh',
      CCCD: '001190000008',
      SDT: '0908000008',
      DiaChi: 'Đống Đa, Hà Nội',
      MaSoBHYT: '',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN009',
      HoTen: 'Bùi Quang Huy',
      CCCD: '001191000009',
      SDT: '0909000009',
      DiaChi: 'Long Biên, Hà Nội',
      MaSoBHYT: 'DN401000000009',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN010',
      HoTen: 'Đặng Khánh Vy',
      CCCD: '001192000010',
      SDT: '0910000010',
      DiaChi: 'Hai Bà Trưng, Hà Nội',
      MaSoBHYT: 'TE101000000010',
      KyTuDauBHYT: 'TE',
    },
    {
      MaBenhAn: 'BN011',
      HoTen: 'Ngô Tuấn Kiệt',
      CCCD: '001193000011',
      SDT: '0911000011',
      DiaChi: 'Hoàn Kiếm, Hà Nội',
      MaSoBHYT: '',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN012',
      HoTen: 'Mai Phương Anh',
      CCCD: '001194000012',
      SDT: '0912000012',
      DiaChi: 'Tây Hồ, Hà Nội',
      MaSoBHYT: 'DN401000000012',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN013',
      HoTen: 'Cao Nhật Minh',
      CCCD: '001195000013',
      SDT: '0913000013',
      DiaChi: 'Hoàng Mai, Hà Nội',
      MaSoBHYT: '',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN014',
      HoTen: 'Tạ Thu Trang',
      CCCD: '001196000014',
      SDT: '0914000014',
      DiaChi: 'Hà Đông, Hà Nội',
      MaSoBHYT: 'DN401000000014',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN015',
      HoTen: 'Lương Quốc Hưng',
      CCCD: '001197000015',
      SDT: '0915000015',
      DiaChi: 'Gia Lâm, Hà Nội',
      MaSoBHYT: 'HT401000000015',
      KyTuDauBHYT: 'HT',
    },
  ])
  const [bookings, setBookings] = useState([
    {
      MaLichHen: 'LH_RT_001',
      MaBenhAn: 'BN001',
      MaCauHinh: 'CH_CG_DV_KHAM_NOI',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 1,
      MaBacSi: 'BS001',
      PaymentToken: 'PAY_MOCK_310501',
      STT_HangDoi: 1,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_002',
      MaBenhAn: 'BN004',
      MaCauHinh: 'CH_CG_DV_KHAM_NOI',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 1,
      MaBacSi: 'BS001',
      PaymentToken: 'PAY_MOCK_310502',
      STT_HangDoi: 2,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_003',
      MaBenhAn: 'BN005',
      MaCauHinh: 'CH_CG_DV_KHAM_GIA_DINH',
      MaDichVu: 'DV_KHAM_GIA_DINH',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 1,
      MaBacSi: 'BS001',
      PaymentToken: 'PAY_MOCK_310503',
      STT_HangDoi: 3,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_004',
      MaBenhAn: 'BN006',
      MaCauHinh: 'CH_CG_DV_KHAM_TIM_MACH',
      MaDichVu: 'DV_KHAM_TIM_MACH',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 1,
      MaBacSi: 'BS001',
      PaymentToken: 'PAY_MOCK_310504',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_005',
      MaBenhAn: 'BN007',
      MaCauHinh: 'CH_CG_DV_KHAM_TIEU_HOA',
      MaDichVu: 'DV_KHAM_TIEU_HOA',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 1,
      MaBacSi: 'BS001',
      PaymentToken: 'PAY_MOCK_310505',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_006',
      MaBenhAn: 'BN003',
      MaCauHinh: 'CH_CG_DV_KHAM_RANG',
      MaDichVu: 'DV_KHAM_RANG',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 2,
      MaBacSi: 'BS002',
      PaymentToken: 'PAY_MOCK_310506',
      STT_HangDoi: 1,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_007',
      MaBenhAn: 'BN008',
      MaCauHinh: 'CH_CG_DV_LAY_CAO',
      MaDichVu: 'DV_LAY_CAO',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 2,
      MaBacSi: 'BS002',
      PaymentToken: 'PAY_MOCK_310507',
      STT_HangDoi: 2,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_008',
      MaBenhAn: 'BN009',
      MaCauHinh: 'CH_CG_DV_KHAM_NIENG_RANG',
      MaDichVu: 'DV_KHAM_NIENG_RANG',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 2,
      MaBacSi: 'BS002',
      PaymentToken: 'PAY_MOCK_310508',
      STT_HangDoi: 3,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_009',
      MaBenhAn: 'BN010',
      MaCauHinh: 'CH_CG_DV_KHAM_IMPLANT',
      MaDichVu: 'DV_KHAM_IMPLANT',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 2,
      MaBacSi: 'BS002',
      PaymentToken: 'PAY_MOCK_310509',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_010',
      MaBenhAn: 'BN011',
      MaCauHinh: 'CH_CG_DV_KHAM_RANG',
      MaDichVu: 'DV_KHAM_RANG',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 2,
      MaBacSi: 'BS002',
      PaymentToken: 'PAY_MOCK_310510',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_011',
      MaBenhAn: 'BN012',
      MaCauHinh: 'CH_CG_DV_KHAM_TMH',
      MaDichVu: 'DV_KHAM_TMH',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 3,
      MaBacSi: 'BS003',
      PaymentToken: 'PAY_MOCK_310511',
      STT_HangDoi: 1,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_012',
      MaBenhAn: 'BN013',
      MaCauHinh: 'CH_CG_DV_NOI_SOI_TMH',
      MaDichVu: 'DV_NOI_SOI_TMH',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 3,
      MaBacSi: 'BS003',
      PaymentToken: 'PAY_MOCK_310512',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_013',
      MaBenhAn: 'BN014',
      MaCauHinh: 'CH_CG_DV_KHAM_HO_HAP',
      MaDichVu: 'DV_KHAM_HO_HAP',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 4,
      MaBacSi: 'BS004',
      PaymentToken: 'PAY_MOCK_310513',
      STT_HangDoi: 1,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_014',
      MaBenhAn: 'BN015',
      MaCauHinh: 'CH_CG_DV_KHAM_NOI_TIET',
      MaDichVu: 'DV_KHAM_NOI_TIET',
      MaChiNhanh: 'CN_CG',
      NgayKham: TODAY,
      CaKham: 4,
      MaBacSi: 'BS004',
      PaymentToken: 'PAY_MOCK_310514',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_015',
      MaBenhAn: 'BN002',
      MaCauHinh: 'CH_HBT_DV_KHAM_TMH',
      MaDichVu: 'DV_KHAM_TMH',
      MaChiNhanh: 'CN_HBT',
      NgayKham: TODAY,
      CaKham: 1,
      MaBacSi: 'BS015',
      PaymentToken: 'PAY_MOCK_310515',
      STT_HangDoi: 1,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_016',
      MaBenhAn: 'BN004',
      MaCauHinh: 'CH_HBT_DV_KHAM_GIA_DINH',
      MaDichVu: 'DV_KHAM_GIA_DINH',
      MaChiNhanh: 'CN_HBT',
      NgayKham: TODAY,
      CaKham: 1,
      MaBacSi: 'BS013',
      PaymentToken: 'PAY_MOCK_310516',
      STT_HangDoi: 1,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_017',
      MaBenhAn: 'BN005',
      MaCauHinh: 'CH_HBT_DV_KHAM_RANG',
      MaDichVu: 'DV_KHAM_RANG',
      MaChiNhanh: 'CN_HBT',
      NgayKham: TODAY,
      CaKham: 2,
      MaBacSi: 'BS014',
      PaymentToken: 'PAY_MOCK_310517',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_018',
      MaBenhAn: 'BN006',
      MaCauHinh: 'CH_HBT_DV_KHAM_TIEU_HOA',
      MaDichVu: 'DV_KHAM_TIEU_HOA',
      MaChiNhanh: 'CN_HBT',
      NgayKham: TODAY,
      CaKham: 3,
      MaBacSi: 'BS016',
      PaymentToken: 'PAY_MOCK_310518',
      TrangThai: 'Đã xác nhận',
    },
    {
      MaLichHen: 'LH_RT_019',
      MaBenhAn: 'BN007',
      MaCauHinh: 'CH_HBT_DV_KHAM_IMPLANT',
      MaDichVu: 'DV_KHAM_IMPLANT',
      MaChiNhanh: 'CN_HBT',
      NgayKham: TODAY,
      CaKham: 4,
      MaBacSi: 'BS018',
      PaymentToken: 'PAY_MOCK_310519',
      STT_HangDoi: 1,
      TrangThai: 'Chờ khám',
    },
    {
      MaLichHen: 'LH_RT_020',
      MaBenhAn: 'BN001',
      MaCauHinh: 'CH_CG_DV_KHAM_TIEU_HOA',
      MaDichVu: 'DV_KHAM_TIEU_HOA',
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-05-30',
      CaKham: 2,
      MaBacSi: 'BS004',
      PaymentToken: 'PAY_MOCK_300501',
      TrangThai: 'Hoàn thành',
    },
  ])

  const maChiNhanh = user?.MaChiNhanh || 'CN_CG'
  const currentBranch = branches.find((branch) => branch.MaChiNhanh === maChiNhanh) || branches[0]
  const matchedPatient = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return null

    return patients.find((patient) =>
      [patient.CCCD, patient.SDT, patient.MaBenhAn, patient.HoTen]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    )
  }, [patients, searchTerm])
  const matchedPatientBookings = matchedPatient
    ? bookings.filter(
        (booking) =>
          booking.MaBenhAn === matchedPatient.MaBenhAn &&
          booking.MaChiNhanh === maChiNhanh &&
          booking.NgayKham === TODAY,
      )
    : []
  const confirmedMatchedBookings = matchedPatientBookings.filter(
    (booking) => booking.TrangThai === 'Đã xác nhận',
  )
  const waitingReceptionBookings = bookings.filter(
    (booking) =>
      booking.MaChiNhanh === maChiNhanh &&
      booking.NgayKham === TODAY &&
      booking.TrangThai === 'Đã xác nhận',
  )
  const queueBookings = bookings
    .filter(
      (booking) =>
        booking.MaChiNhanh === maChiNhanh &&
        booking.NgayKham === TODAY &&
        booking.TrangThai === 'Chờ khám',
    )
    .sort((a, b) => Number(a.STT_HangDoi || 0) - Number(b.STT_HangDoi || 0))

  const getPatient = (maBenhAn) =>
    patients.find((patient) => patient.MaBenhAn === maBenhAn) || {
      MaBenhAn: maBenhAn,
      HoTen: 'Chưa rõ',
      SDT: 'Chưa cập nhật',
    }

  const getService = (maDichVu) =>
    services.find((service) => service.MaDichVu === maDichVu) || {
      MaDichVu: maDichVu,
      TenDichVu: maDichVu,
      ChuyenKhoa: '',
      GiaGoc: 0,
    }

  const getDoctor = (maBacSi) =>
    staffList.find((doctor) => doctor.MaBacSi === maBacSi) || {
      MaBacSi: maBacSi,
      HoTen: 'Đang điều phối',
      ChuyenKhoa: 'Chưa rõ',
    }

  const queueGroups = (() => {
    const groupMap = new Map()

    queueBookings.forEach((booking) => {
      const current = groupMap.get(booking.MaBacSi) || []
      groupMap.set(booking.MaBacSi, [...current, booking])
    })

    return Array.from(groupMap.entries())
      .map(([maBacSi, items]) => ({
        doctor: getDoctor(maBacSi),
        items: items.sort((a, b) => Number(a.STT_HangDoi || 0) - Number(b.STT_HangDoi || 0)),
      }))
      .sort((a, b) => a.doctor.HoTen.localeCompare(b.doctor.HoTen, 'vi'))
  })()

  const getNextQueueNumber = (maBacSi) => {
    const todayQueueNumbers = bookings
      .filter(
        (booking) =>
          booking.MaChiNhanh === maChiNhanh &&
          booking.NgayKham === TODAY &&
          booking.MaBacSi === maBacSi &&
          booking.TrangThai === 'Chờ khám',
      )
      .map((booking) => Number(booking.STT_HangDoi || 0))

    return Math.max(0, ...todayQueueNumbers) + 1
  }

  const handleCheckIn = (maLichHen) => {
    const targetBooking = bookings.find((booking) => booking.MaLichHen === maLichHen)
    if (!targetBooking) return

    const queueNumber = getNextQueueNumber(targetBooking.MaBacSi)
    setBookings((current) =>
      current.map((booking) =>
        booking.MaLichHen === maLichHen
          ? {
              ...booking,
              STT_HangDoi: queueNumber,
              TrangThai: 'Chờ khám',
            }
          : booking,
      ),
    )
    setFeedback(`Đã check-in lịch hẹn ${maLichHen}, cấp STT hàng đợi ${queueNumber}.`)
    setActiveQueueTab('queue')
  }

  return (
    <main className="reception-shell">
      <header className="reception-topbar">
        <div>
          <span className="reception-kicker">Smart Clinic Reception</span>
          <h1>HỆ THỐNG TIẾP ĐÓN & ĐIỀU PHỐI HÀNG ĐỢI - {currentBranch.TenChiNhanh}</h1>
          <p>
            Lễ tân phụ trách: <strong>{user?.name || user?.id || 'Lễ tân'}</strong> · Ngày vận hành:{' '}
            <strong>{TODAY}</strong>
          </p>
        </div>
        <button type="button" className="reception-logout-button" onClick={onLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </header>

      {feedback && <p className="reception-feedback">{feedback}</p>}

      <section className="reception-card">
        <div className="reception-section-header">
          <div>
            <h2>Tra cứu bệnh nhân & tiếp đón nhanh</h2>
            <p>Nhập CCCD, SĐT, mã bệnh án hoặc họ tên để kiểm tra lịch đặt trước trong ngày.</p>
          </div>
        </div>

        <input
          className="reception-search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm theo CCCD, số điện thoại, mã bệnh án hoặc họ tên..."
        />

        {searchTerm.trim() && !matchedPatient && (
          <div className="reception-empty-state">
            Không tìm thấy bệnh nhân trong danh mục mock. Vui lòng kiểm tra lại thông tin định danh.
          </div>
        )}

        {matchedPatient && (
          <div className="reception-patient-result">
            <div>
              <span>Bệnh nhân</span>
              <strong>{matchedPatient.HoTen}</strong>
              <small>
                {matchedPatient.MaBenhAn} · CCCD {matchedPatient.CCCD} · SĐT {matchedPatient.SDT}
              </small>
            </div>
            {confirmedMatchedBookings.length > 0 ? (
              <div className="reception-booking-cards">
                {confirmedMatchedBookings.map((booking) => {
                  const service = getService(booking.MaDichVu)
                  const doctor = getDoctor(booking.MaBacSi)
                  return (
                    <article key={booking.MaLichHen} className="reception-booking-card">
                      <div>
                        <strong>{service.TenDichVu}</strong>
                        <span>
                          Ca {booking.CaKham} · Bác sĩ {doctor.HoTen} · {booking.MaLichHen}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="reception-primary-button"
                        onClick={() => handleCheckIn(booking.MaLichHen)}
                      >
                        ⚡ Xác nhận tiếp đón (Vào hàng đợi)
                      </button>
                    </article>
                  )
                })}
              </div>
            ) : matchedPatientBookings.length > 0 ? (
              <div className="reception-direct-box">
                <p>
                  Bệnh nhân đã có lịch hôm nay tại chi nhánh này với trạng thái:{' '}
                  {matchedPatientBookings.map((booking) => booking.TrangThai).join(', ')}.
                </p>
              </div>
            ) : (
              <div className="reception-direct-box">
                <p>
                  Bệnh nhân chưa đặt lịch trực tuyến tại chi nhánh này trong ngày hôm nay. Quy trình hiện tại yêu cầu bệnh nhân đặt lịch online và thanh toán trước từ nhà.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="reception-card">
        <div className="reception-section-header">
          <div>
            <h2>Quản lý luồng hàng đợi phòng khám trong ngày</h2>
            <p>Dữ liệu được lọc cứng theo chi nhánh {currentBranch.MaChiNhanh}.</p>
          </div>
          <div className="reception-tab-row">
            <button
              type="button"
              className={activeQueueTab === 'prebooked' ? 'active' : ''}
              onClick={() => setActiveQueueTab('prebooked')}
            >
              Chờ tiếp đón ({waitingReceptionBookings.length})
            </button>
            <button
              type="button"
              className={activeQueueTab === 'queue' ? 'active' : ''}
              onClick={() => setActiveQueueTab('queue')}
            >
              Hàng đợi khám ({queueBookings.length})
            </button>
          </div>
        </div>

        {activeQueueTab === 'prebooked' ? (
          <div className="reception-table-wrap">
            <table className="reception-table">
              <thead>
                <tr>
                  <th>STT đặt trước</th>
                  <th>Mã bệnh án</th>
                  <th>Họ tên</th>
                  <th>Số điện thoại</th>
                  <th>Ca khám</th>
                  <th>Dịch vụ khám</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {waitingReceptionBookings.map((booking, index) => {
                  const patient = getPatient(booking.MaBenhAn)
                  const service = getService(booking.MaDichVu)
                  return (
                    <tr key={booking.MaLichHen}>
                      <td>{index + 1}</td>
                      <td>{patient.MaBenhAn}</td>
                      <td>{patient.HoTen}</td>
                      <td>{patient.SDT}</td>
                      <td>Ca {booking.CaKham}</td>
                      <td>{service.TenDichVu}</td>
                      <td>
                        <button
                          type="button"
                          className="reception-primary-button compact"
                          onClick={() => handleCheckIn(booking.MaLichHen)}
                        >
                          Check-in Tiếp Đón
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {waitingReceptionBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="reception-empty-cell">
                      Không còn lịch đặt trước đang chờ tiếp đón.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : queueGroups.length > 0 ? (
          <div className="reception-doctor-queue-grid">
            {queueGroups.map((group) => (
              <article key={group.doctor.MaBacSi} className="reception-doctor-queue-card">
                <header>
                  <div>
                    <span>{group.doctor.MaBacSi}</span>
                    <h3>
                      Phòng khám: Bác sĩ {group.doctor.HoTen} - Khoa {group.doctor.ChuyenKhoa}
                    </h3>
                  </div>
                  <strong>{group.items.length} bệnh nhân</strong>
                </header>
                <div className="reception-table-wrap">
                  <table className="reception-table compact">
                    <thead>
                      <tr>
                        <th>STT hàng đợi</th>
                        <th>Họ tên bệnh nhân</th>
                        <th>Ca khám</th>
                        <th>Dịch vụ lâm sàng</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((booking, index) => {
                        const patient = getPatient(booking.MaBenhAn)
                        const service = getService(booking.MaDichVu)
                        return (
                          <tr key={booking.MaLichHen}>
                            <td>{index + 1}</td>
                            <td>{patient.HoTen}</td>
                            <td>Ca {booking.CaKham}</td>
                            <td>{service.TenDichVu}</td>
                            <td>
                              <span className="reception-status-pill">Chờ khám</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="reception-empty-state">Chưa có bệnh nhân nào trong hàng đợi khám.</div>
        )}
      </section>
    </main>
  )
}

function TechnicianDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('pending')
  const [paymentModal, setPaymentModal] = useState(null)
  const [resultModal, setResultModal] = useState(null)
  const [resultText, setResultText] = useState('')
  const [feedback, setFeedback] = useState('')
  const [branches] = useState([
    {
      MaChiNhanh: 'CN_CG',
      TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      DiaChi: 'Số 1 Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    },
    {
      MaChiNhanh: 'CN_HBT',
      TenChiNhanh: 'Smart Clinic - Cơ sở Hai Bà Trưng',
      DiaChi: 'Số 99 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    },
  ])
  const [patients] = useState([
    {
      MaBenhAn: 'BN001',
      HoTen: 'Trần Quang Hải',
      CCCD: '001095012345',
      SDT: '0901234567',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN002',
      HoTen: 'Nguyễn Thị Mai',
      CCCD: '001200054321',
      SDT: '0907654321',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN003',
      HoTen: 'Phạm Lê Minh',
      CCCD: '001221098765',
      SDT: '0911999888',
      KyTuDauBHYT: 'TE',
    },
    {
      MaBenhAn: 'BN004',
      HoTen: 'Lê Hoàng Nam',
      CCCD: '001186000004',
      SDT: '0904000004',
      KyTuDauBHYT: 'DN',
    },
    {
      MaBenhAn: 'BN005',
      HoTen: 'Đỗ Minh Châu',
      CCCD: '001187000005',
      SDT: '0905000005',
      KyTuDauBHYT: '',
    },
    {
      MaBenhAn: 'BN006',
      HoTen: 'Vũ Gia Hân',
      CCCD: '001188000006',
      SDT: '0906000006',
      KyTuDauBHYT: 'HT',
    },
  ])
  const [services] = useState([
    { MaDichVu: 'DV_KHAM_NOI', TenDichVu: 'Khám Nội Tổng Quát', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_TMH', TenDichVu: 'Khám Tai Mũi Họng Thông Thường', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_RANG', TenDichVu: 'Khám Răng Hàm Mặt Định Kỳ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'XN_MAU', TenDichVu: 'Xét Nghiệm Công Thức Máu 24 Chỉ Số', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 250000 },
    { MaDichVu: 'SA_O_BUNG', TenDichVu: 'Siêu Âm Ổ Bụng Tổng Quát', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 300000 },
    { MaDichVu: 'XN_NUOC_TIEU', TenDichVu: 'Xét Nghiệm Nước Tiểu Toàn Bộ (10 Thông Số)', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 120000 },
    { MaDichVu: 'XN_SINH_HOA', TenDichVu: 'Xét Nghiệm Sinh Hóa Máu (Gan, Thận, Mỡ Máu)', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 350000 },
    { MaDichVu: 'XN_DUONG_HUYET', TenDichVu: 'Xét Nghiệm Đường Huyết Nhanh', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 80000 },
  ])
  const [bookings] = useState([
    {
      MaLichHen: 'LH_LAB_001',
      MaBenhAn: 'BN001',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-05-31',
      CaKham: 1,
      MaBacSi: 'BS001',
      TrangThai: 'Đang khám',
    },
    {
      MaLichHen: 'LH_LAB_002',
      MaBenhAn: 'BN003',
      MaDichVu: 'DV_KHAM_RANG',
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-05-31',
      CaKham: 2,
      MaBacSi: 'BS002',
      TrangThai: 'Đang khám',
    },
    {
      MaLichHen: 'LH_LAB_003',
      MaBenhAn: 'BN004',
      MaDichVu: 'DV_KHAM_TMH',
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-05-31',
      CaKham: 3,
      MaBacSi: 'BS003',
      TrangThai: 'Đang khám',
    },
    {
      MaLichHen: 'LH_LAB_004',
      MaBenhAn: 'BN002',
      MaDichVu: 'DV_KHAM_TMH',
      MaChiNhanh: 'CN_HBT',
      NgayKham: '2026-05-31',
      CaKham: 1,
      MaBacSi: 'BS015',
      TrangThai: 'Đang khám',
    },
    {
      MaLichHen: 'LH_LAB_005',
      MaBenhAn: 'BN005',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_HBT',
      NgayKham: '2026-05-31',
      CaKham: 2,
      MaBacSi: 'BS016',
      TrangThai: 'Đang khám',
    },
    {
      MaLichHen: 'LH_LAB_006',
      MaBenhAn: 'BN006',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-05-31',
      CaKham: 4,
      MaBacSi: 'BS004',
      TrangThai: 'Đang khám',
    },
  ])
  const [visitRecords] = useState([
    { MaLuotKham: 'LK_001', MaLichHen: 'LH_LAB_001', ChanDoanSoBo: 'Theo dõi thiếu máu, đau thượng vị' },
    { MaLuotKham: 'LK_002', MaLichHen: 'LH_LAB_002', ChanDoanSoBo: 'Đau răng, cần kiểm tra chỉ số viêm' },
    { MaLuotKham: 'LK_003', MaLichHen: 'LH_LAB_003', ChanDoanSoBo: 'Viêm mũi xoang, cần xét nghiệm máu' },
    { MaLuotKham: 'LK_004', MaLichHen: 'LH_LAB_004', ChanDoanSoBo: 'Theo dõi viêm đường hô hấp' },
    { MaLuotKham: 'LK_005', MaLichHen: 'LH_LAB_005', ChanDoanSoBo: 'Tầm soát chuyển hóa' },
    { MaLuotKham: 'LK_006', MaLichHen: 'LH_LAB_006', ChanDoanSoBo: 'Đánh giá chức năng gan thận' },
  ])
  const [labDetails, setLabDetails] = useState([
    {
      MaChiTietXN: 'CTXN_001',
      MaLuotKham: 'LK_001',
      MaDichVu: 'XN_MAU',
      PaymentToken: null,
      KetQuaXetNghiem: '',
      MaXNV: '',
      TrangThaiXetNghiem: 'Chưa thực hiện',
    },
    {
      MaChiTietXN: 'CTXN_002',
      MaLuotKham: 'LK_001',
      MaDichVu: 'SA_O_BUNG',
      PaymentToken: 'PAY_LAB_100002',
      KetQuaXetNghiem: '',
      MaXNV: '',
      TrangThaiXetNghiem: 'Chưa thực hiện',
    },
    {
      MaChiTietXN: 'CTXN_003',
      MaLuotKham: 'LK_002',
      MaDichVu: 'XN_MAU',
      PaymentToken: null,
      KetQuaXetNghiem: '',
      MaXNV: '',
      TrangThaiXetNghiem: 'Chưa thực hiện',
    },
    {
      MaChiTietXN: 'CTXN_004',
      MaLuotKham: 'LK_003',
      MaDichVu: 'XN_SINH_HOA',
      PaymentToken: null,
      KetQuaXetNghiem: '',
      MaXNV: '',
      TrangThaiXetNghiem: 'Chưa thực hiện',
    },
    {
      MaChiTietXN: 'CTXN_005',
      MaLuotKham: 'LK_004',
      MaDichVu: 'XN_NUOC_TIEU',
      PaymentToken: null,
      KetQuaXetNghiem: '',
      MaXNV: '',
      TrangThaiXetNghiem: 'Chưa thực hiện',
    },
    {
      MaChiTietXN: 'CTXN_006',
      MaLuotKham: 'LK_005',
      MaDichVu: 'XN_DUONG_HUYET',
      PaymentToken: 'PAY_LAB_100006',
      KetQuaXetNghiem: 'Glucose máu mao mạch 5.8 mmol/L.',
      MaXNV: 'XNV002',
      TrangThaiXetNghiem: 'Đã có kết quả',
    },
    {
      MaChiTietXN: 'CTXN_007',
      MaLuotKham: 'LK_006',
      MaDichVu: 'XN_SINH_HOA',
      PaymentToken: null,
      KetQuaXetNghiem: '',
      MaXNV: '',
      TrangThaiXetNghiem: 'Chưa thực hiện',
    },
    {
      MaChiTietXN: 'CTXN_008',
      MaLuotKham: 'LK_003',
      MaDichVu: 'XN_DUONG_HUYET',
      PaymentToken: 'PAY_LAB_100008',
      KetQuaXetNghiem: 'Glucose máu nhanh 5.4 mmol/L, trong giới hạn bình thường.',
      MaXNV: 'XNV001',
      TrangThaiXetNghiem: 'Đã có kết quả',
    },
  ])
  const bhytCategories = [
    { KyTuDauBHYT: 'TE', DoiTuongChinhSach: 'Trẻ em dưới 6 tuổi', TyLeHuong: 1 },
    { KyTuDauBHYT: 'HT', DoiTuongChinhSach: 'Cán bộ Hưu trí', TyLeHuong: 0.95 },
    { KyTuDauBHYT: 'DN', DoiTuongChinhSach: 'Người lao động doanh nghiệp', TyLeHuong: 0.8 },
  ]

  const maChiNhanh = user?.MaChiNhanh || 'CN_CG'
  const currentBranch = branches.find((branch) => branch.MaChiNhanh === maChiNhanh) || branches[0]

  const getPatient = (maBenhAn) =>
    patients.find((patient) => patient.MaBenhAn === maBenhAn) || {
      MaBenhAn: maBenhAn,
      HoTen: 'Chưa rõ',
      KyTuDauBHYT: '',
    }

  const getService = (maDichVu) =>
    services.find((service) => service.MaDichVu === maDichVu) || {
      MaDichVu: maDichVu,
      TenDichVu: maDichVu,
      GiaGoc: 0,
    }

  const getVisit = (maLuotKham) => visitRecords.find((visit) => visit.MaLuotKham === maLuotKham)

  const getBooking = (maLichHen) => bookings.find((booking) => booking.MaLichHen === maLichHen)

  const getBhytRate = (patient) =>
    bhytCategories.find((category) => category.KyTuDauBHYT === patient.KyTuDauBHYT)?.TyLeHuong || 0

  const formatMoney = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const buildLabRows = () =>
    labDetails
      .map((lab) => {
        const visit = getVisit(lab.MaLuotKham)
        const booking = getBooking(visit?.MaLichHen)
        const patient = getPatient(booking?.MaBenhAn)
        const service = getService(lab.MaDichVu)
        const bhytRate = getBhytRate(patient)
        const bhytAmount = Math.round(service.GiaGoc * bhytRate)
        const finalAmount = Math.max(0, service.GiaGoc - bhytAmount)

        return {
          lab,
          visit,
          booking,
          patient,
          service,
          bhytRate,
          bhytAmount,
          finalAmount,
        }
      })
      .filter((row) => row.booking?.MaChiNhanh === maChiNhanh)

  const labRows = buildLabRows()
  const currentTechnicianId = user?.id || 'XNV001'
  const pendingRows = labRows.filter((row) => row.lab.TrangThaiXetNghiem === 'Chưa thực hiện')
  const completedRows = labRows.filter(
    (row) =>
      row.lab.TrangThaiXetNghiem === 'Đã có kết quả' &&
      row.lab.MaXNV === currentTechnicianId &&
      row.booking?.NgayKham === '2026-05-31',
  )

  const handleOpenPayment = (row) => {
    setPaymentModal(row)
  }

  const handleConfirmPayment = () => {
    if (!paymentModal) return

    const paymentToken = `PAY_LAB_${Math.floor(100000 + Math.random() * 900000)}`
    setLabDetails((current) =>
      current.map((lab) =>
        lab.MaChiTietXN === paymentModal.lab.MaChiTietXN
          ? { ...lab, PaymentToken: paymentToken }
          : lab,
      ),
    )
    setFeedback(`Đã ghi nhận thanh toán ${paymentToken} cho ${paymentModal.service.TenDichVu}.`)
    setPaymentModal(null)
  }

  const handleOpenResultModal = (row) => {
    setResultModal(row)
    setResultText(row.lab.KetQuaXetNghiem || '')
  }

  const handleCloseResultModal = () => {
    setResultModal(null)
    setResultText('')
  }

  const handleSaveResult = () => {
    if (!resultModal) return

    const trimmedResult = resultText.trim()
    if (!trimmedResult) {
      alert('Vui lòng nhập nội dung kết quả xét nghiệm.')
      return
    }

    setLabDetails((current) =>
      current.map((lab) =>
        lab.MaChiTietXN === resultModal.lab.MaChiTietXN
          ? {
              ...lab,
              KetQuaXetNghiem: trimmedResult,
              MaXNV: currentTechnicianId,
              TrangThaiXetNghiem: 'Đã có kết quả',
            }
          : lab,
      ),
    )
    alert('Đã trả kết quả xét nghiệm lên hệ thống thành công!')
    setFeedback(`Đã trả kết quả xét nghiệm cho lượt khám ${resultModal.lab.MaLuotKham}.`)
    setActiveTab('completed')
    handleCloseResultModal()
  }

  return (
    <main className="technician-shell">
      <header className="technician-topbar">
        <div>
          <span className="technician-kicker">Smart Clinic Laboratory</span>
          <h1>TRUNG TÂM XÉT NGHIỆM & CHẨN ĐOÁN HÌNH ẢNH - Smart Clinic {currentBranch.TenChiNhanh}</h1>
          <p>
            Xét nghiệm viên: <strong>{user?.name || user?.id || 'Xét nghiệm viên'}</strong> · Chi nhánh:{' '}
            <strong>{currentBranch.MaChiNhanh}</strong>
          </p>
        </div>
        <button type="button" className="technician-logout-button" onClick={onLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </header>

      {feedback && <p className="technician-feedback">{feedback}</p>}

      <section className="technician-card">
        <div className="technician-section-header">
          <div>
            <h2>Quản lý chỉ định cận lâm sàng</h2>
            <p>Dữ liệu được lọc theo chi nhánh của lượt khám gốc và tính giá cuối sau giảm trừ BHYT tại chỗ.</p>
          </div>
          <div className="technician-tab-row">
            <button
              type="button"
              className={activeTab === 'pending' ? 'active' : ''}
              onClick={() => setActiveTab('pending')}
            >
              Chỉ định chờ thực hiện ({pendingRows.length})
            </button>
            <button
              type="button"
              className={activeTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTab('completed')}
            >
              Nhật ký đã trả kết quả ({completedRows.length})
            </button>
          </div>
        </div>

        {activeTab === 'pending' ? (
          <div className="technician-table-wrap">
            <table className="technician-table">
              <thead>
                <tr>
                  <th>Mã lượt khám</th>
                  <th>Họ tên bệnh nhân</th>
                  <th>Tên dịch vụ</th>
                  <th>Giá gốc</th>
                  <th>BHYT giảm trừ</th>
                  <th>Giá cuối thực trả</th>
                  <th>Trạng thái thanh toán</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingRows.map((row) => (
                  <tr key={row.lab.MaChiTietXN}>
                    <td>
                      <strong>{row.lab.MaLuotKham}</strong>
                      <span>{row.visit?.ChanDoanSoBo}</span>
                    </td>
                    <td>
                      <strong>{row.patient.HoTen}</strong>
                      <span>{row.patient.MaBenhAn}</span>
                    </td>
                    <td>{row.service.TenDichVu}</td>
                    <td>{formatMoney(row.service.GiaGoc)}</td>
                    <td>
                      {formatMoney(row.bhytAmount)}
                      <span>{Math.round(row.bhytRate * 100)}%</span>
                    </td>
                    <td>
                      <strong>{formatMoney(row.finalAmount)}</strong>
                    </td>
                    <td>
                      <span className={`technician-payment-pill ${row.lab.PaymentToken ? 'paid' : 'unpaid'}`}>
                        {row.lab.PaymentToken ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                      {row.lab.PaymentToken && <small>{row.lab.PaymentToken}</small>}
                    </td>
                    <td>
                      {row.lab.PaymentToken ? (
                        <button
                          type="button"
                          className="technician-primary-button compact"
                          onClick={() => handleOpenResultModal(row)}
                        >
                          📝 Nhập kết quả
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="technician-pay-button compact"
                          onClick={() => handleOpenPayment(row)}
                        >
                          💳 Quét QR Thanh toán
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pendingRows.length === 0 && (
                  <tr>
                    <td colSpan="8" className="technician-empty-cell">
                      Không còn chỉ định chờ thực hiện tại chi nhánh này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="technician-table-wrap">
            <table className="technician-table technician-result-table">
              <thead>
                <tr>
                  <th>Mã lượt khám</th>
                  <th>Họ tên bệnh nhân</th>
                  <th>Tên dịch vụ</th>
                  <th>Nội dung kết quả đã trả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {completedRows.map((row) => (
                  <tr key={row.lab.MaChiTietXN}>
                    <td>
                      <strong>{row.lab.MaLuotKham}</strong>
                      <span>{row.booking?.NgayKham}</span>
                    </td>
                    <td>
                      <strong>{row.patient.HoTen}</strong>
                      <span>{row.patient.MaBenhAn}</span>
                    </td>
                    <td>{row.service.TenDichVu}</td>
                    <td className="technician-result-text">{row.lab.KetQuaXetNghiem}</td>
                    <td>
                      <button
                        type="button"
                        className="technician-secondary-button compact"
                        onClick={() => handleOpenResultModal(row)}
                      >
                        ✏️ Sửa kết quả
                      </button>
                    </td>
                  </tr>
                ))}
                {completedRows.length === 0 && (
                  <tr>
                    <td colSpan="5" className="technician-empty-cell">
                      Chưa có kết quả nào do tài khoản này trả trong ngày hôm nay.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {paymentModal && (
        <div className="technician-modal-overlay">
          <section className="technician-payment-modal">
            <button
              type="button"
              className="technician-modal-close"
              onClick={() => setPaymentModal(null)}
              aria-label="Đóng modal thanh toán"
            >
              ×
            </button>
            <span className="technician-kicker">Cổng thanh toán phòng Lab</span>
            <h2>QR thanh toán xét nghiệm</h2>
            <div className="technician-invoice-grid">
              <span>Bệnh nhân</span>
              <strong>{paymentModal.patient.HoTen}</strong>
              <span>Dịch vụ</span>
              <strong>{paymentModal.service.TenDichVu}</strong>
              <span>Giá gốc</span>
              <strong>{formatMoney(paymentModal.service.GiaGoc)}</strong>
              <span>BHYT giảm</span>
              <strong>{formatMoney(paymentModal.bhytAmount)}</strong>
              <span>Giá cuối thực trả</span>
              <strong>{formatMoney(paymentModal.finalAmount)}</strong>
            </div>
            <div className="technician-qr-box">
              <div className="technician-qr-pattern" />
              <span>QR Smart Clinic Lab</span>
            </div>
            <button type="button" className="technician-pay-button" onClick={handleConfirmPayment}>
              Xác nhận đã chuyển khoản
            </button>
          </section>
        </div>
      )}

      {resultModal && (
        <div className="technician-modal-overlay">
          <section className="technician-result-modal">
            <button
              type="button"
              className="technician-modal-close"
              onClick={handleCloseResultModal}
              aria-label="Đóng form nhập kết quả"
            >
              ×
            </button>
            <span className="technician-kicker">Cập nhật kết quả</span>
            <h2>Cập nhật kết quả cận lâm sàng - Bệnh nhân {resultModal.patient.HoTen}</h2>
            <div className="technician-result-summary">
              <span>{resultModal.lab.MaLuotKham}</span>
              <strong>{resultModal.service.TenDichVu}</strong>
            </div>
            <textarea
              value={resultText}
              onChange={(event) => setResultText(event.target.value)}
              placeholder="Nhập kết quả chi tiết bằng văn bản (Ví dụ: Bạch cầu trong giới hạn bình thường, hình ảnh siêu âm gan thô...)."
              autoFocus
            />
            <div className="technician-result-actions">
              <button type="button" className="technician-primary-button" onClick={handleSaveResult}>
                💾 Xác nhận & Trả kết quả
              </button>
              <button type="button" className="technician-secondary-button" onClick={handleCloseResultModal}>
                Hủy bỏ
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

function PatientDashboard({ user, onLogout, onUpdateUser }) {
  const [activeMenu, setActiveMenu] = useState('booking')
  const [serviceSearch, setServiceSearch] = useState('')
  const [branches] = useState([
    {
      MaChiNhanh: 'CN_CG',
      TenChiNhanh: 'Smart Clinic - Cơ sở Cầu Giấy',
      DiaChi: 'Số 1 Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    },
    {
      MaChiNhanh: 'CN_HBT',
      TenChiNhanh: 'Smart Clinic - Cơ sở Hai Bà Trưng',
      DiaChi: 'Số 99 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    },
  ])
  const [services] = useState([
    { MaDichVu: 'DV_KHAM_NOI', TenDichVu: 'Khám Nội Tổng Quát', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_GIA_DINH', TenDichVu: 'Khám Sức Khỏe Gia Đình', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 250000 },
    { MaDichVu: 'DV_KHAM_LAO_KHOA', TenDichVu: 'Khám Tư Vấn Sức Khỏe Lão Khoa', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_TIM_MACH', TenDichVu: 'Khám Sàng Lọc Tim Mạch - Huyết Áp', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_KHAM_TIEU_HOA', TenDichVu: 'Khám Tiêu Hóa - Gan Mật', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_KHAM_HO_HAP', TenDichVu: 'Khám Bệnh Lý Đường Hô Hấp', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 170000 },
    { MaDichVu: 'DV_KHAM_NOI_TIET', TenDichVu: 'Khám Sàng Lọc Tiểu Đường & Nội Tiết', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 220000 },
    { MaDichVu: 'DV_KHAM_DINH_DUONG', TenDichVu: 'Khám Tư Vấn Dinh Dưỡng Chuyên Sâu', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DT_TRUYEN_DICH', TenDichVu: 'Liệu trình truyền dịch giải độc, bù nước', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Điều trị', GiaGoc: 250000 },
    { MaDichVu: 'DT_TIEM_KHANG_SINH', TenDichVu: 'Dịch vụ tiêm thuốc/kháng sinh theo chỉ định', ChuyenKhoa: 'Nội tổng quát', LoaiDichVu: 'Điều trị', GiaGoc: 80000 },
    { MaDichVu: 'DV_KHAM_RANG', TenDichVu: 'Khám Răng Hàm Mặt Định Kỳ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DV_LAY_CAO', TenDichVu: 'Lấy Cao Răng Và Đánh Bóng Thẩm Mỹ', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 150000 },
    { MaDichVu: 'DV_KHAM_NIENG_RANG', TenDichVu: 'Khám Tư Vấn Chỉnh Nha/Niềng Răng', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 300000 },
    { MaDichVu: 'DV_KHAM_IMPLANT', TenDichVu: 'Khám Tư Vấn Trồng Răng Implant', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 300000 },
    { MaDichVu: 'DT_HAN_RANG', TenDichVu: 'Hàn Răng Composite Thẩm Mỹ (1 Răng)', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 300000 },
    { MaDichVu: 'DT_RANG_TUY', TenDichVu: 'Liệu Trình Điều Trị Tủy Răng Toàn Diện', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 1200000 },
    { MaDichVu: 'DT_NHO_RANG_KHON', TenDichVu: 'Phẫu Thuật Nhổ Răng Khôn Mọc Lệch', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 1000000 },
    { MaDichVu: 'DT_TAY_TRANG', TenDichVu: 'Tẩy Trắng Răng Công Nghệ Laser', ChuyenKhoa: 'Răng hàm mặt', LoaiDichVu: 'Điều trị', GiaGoc: 2000000 },
    { MaDichVu: 'DV_KHAM_TMH', TenDichVu: 'Khám Tai Mũi Họng Thông Thường', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 180000 },
    { MaDichVu: 'DV_NOI_SOI_TMH', TenDichVu: 'Nội Soi Tai Mũi Họng Ống Mềm', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 250000 },
    { MaDichVu: 'DV_KHAM_THINH_LUC', TenDichVu: 'Khám Đo Thính Lực Đơn Âm', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Khám lâm sàng', GiaGoc: 200000 },
    { MaDichVu: 'DT_KHIDUNG', TenDichVu: 'Liệu Trình Khí Dung Mũi Họng', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 450000 },
    { MaDichVu: 'DT_VIEM_AMIDAN', TenDichVu: 'Liệu Trình Điều Trị Viêm Amidan Hạt', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 600000 },
    { MaDichVu: 'DT_RUA_XOANG', TenDichVu: 'Hút Mủ Và Chọc Rửa Xoang Điều Trị', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 350000 },
    { MaDichVu: 'DT_LAY_DI_VAT', TenDichVu: 'Thủ Thuật Lấy Dị Vật Vùng Tai/Mũi/Họng', ChuyenKhoa: 'Tai mũi họng', LoaiDichVu: 'Điều trị', GiaGoc: 400000 },
    { MaDichVu: 'XN_MAU', TenDichVu: 'Xét Nghiệm Công Thức Máu 24 Chỉ Số', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 250000 },
    { MaDichVu: 'SA_O_BUNG', TenDichVu: 'Siêu Âm Ổ Bụng Tổng Quát', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 300000 },
    { MaDichVu: 'XN_NUOC_TIEU', TenDichVu: 'Xét Nghiệm Nước Tiểu Toàn Bộ (10 Thông Số)', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 120000 },
    { MaDichVu: 'XN_SINH_HOA', TenDichVu: 'Xét Nghiệm Sinh Hóa Máu (Gan, Thận, Mỡ Máu)', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 350000 },
    { MaDichVu: 'XN_DUONG_HUYET', TenDichVu: 'Xét Nghiệm Đường Huyết Nhanh', ChuyenKhoa: 'Xét nghiệm', LoaiDichVu: 'Xét nghiệm', GiaGoc: 80000 },
  ])
  const [branchServices] = useState(() =>
    ['CN_CG', 'CN_HBT'].flatMap((maChiNhanh) =>
      services.map((service) => ({
        MaCauHinh: `${maChiNhanh === 'CN_CG' ? 'CH_CG' : 'CH_HBT'}_${service.MaDichVu}`,
        MaChiNhanh: maChiNhanh,
        MaDichVu: service.MaDichVu,
        SlotGioiHan: 15,
      })),
    ),
  )
  const [staffList] = useState([
    { MaBacSi: 'BS001', HoTen: 'Nguyễn Văn An', ChuyenKhoa: 'Nội tổng quát', SDT: '0911222333' },
    { MaBacSi: 'BS002', HoTen: 'Lê Thị Bình', ChuyenKhoa: 'Răng hàm mặt', SDT: '0922333444' },
    { MaBacSi: 'BS003', HoTen: 'Phạm Hoàng Long', ChuyenKhoa: 'Tai mũi họng', SDT: '0933444555' },
    { MaBacSi: 'BS004', HoTen: 'Trần Trần Đức', ChuyenKhoa: 'Nội tổng quát', SDT: '0944555666' },
    { MaBacSi: 'BS005', HoTen: 'Nguyễn Thị Minh', ChuyenKhoa: 'Nội tổng quát', SDT: '0912345678' },
    { MaBacSi: 'BS006', HoTen: 'Phan Văn Khải', ChuyenKhoa: 'Răng hàm mặt', SDT: '0923456789' },
    { MaBacSi: 'BS007', HoTen: 'Hoàng Lê Giang', ChuyenKhoa: 'Tai mũi họng', SDT: '0934567890' },
    { MaBacSi: 'BS008', HoTen: 'Vũ Ngô Hùng', ChuyenKhoa: 'Răng hàm mặt', SDT: '0945678901' },
    { MaBacSi: 'BS009', HoTen: 'Đỗ Thúy Hạnh', ChuyenKhoa: 'Nội tổng quát', SDT: '0913456789' },
    { MaBacSi: 'BS010', HoTen: 'Bùi Chí Kiên', ChuyenKhoa: 'Răng hàm mặt', SDT: '0924567890' },
    { MaBacSi: 'BS011', HoTen: 'Lý Thu Thảo', ChuyenKhoa: 'Tai mũi họng', SDT: '0935678901' },
    { MaBacSi: 'BS012', HoTen: 'Đặng Quốc Bảo', ChuyenKhoa: 'Tai mũi họng', SDT: '0946789012' },
    { MaBacSi: 'BS013', HoTen: 'Ngô Bảo Ngọc', ChuyenKhoa: 'Nội tổng quát', SDT: '0914567890' },
    { MaBacSi: 'BS014', HoTen: 'Dương Văn Lâm', ChuyenKhoa: 'Răng hàm mặt', SDT: '0925678901' },
    { MaBacSi: 'BS015', HoTen: 'Võ Thị Sáu', ChuyenKhoa: 'Tai mũi họng', SDT: '0936789012' },
    { MaBacSi: 'BS016', HoTen: 'Tống Phước Hải', ChuyenKhoa: 'Nội tổng quát', SDT: '0947890123' },
    { MaBacSi: 'BS017', HoTen: 'Đinh Công Mạnh', ChuyenKhoa: 'Nội tổng quát', SDT: '0915678901' },
    { MaBacSi: 'BS018', HoTen: 'Mai Phương Thảo', ChuyenKhoa: 'Răng hàm mặt', SDT: '0926789012' },
    { MaBacSi: 'BS019', HoTen: 'Hồ Tiến Dũng', ChuyenKhoa: 'Tai mũi họng', SDT: '0937890123' },
    { MaBacSi: 'BS020', HoTen: 'Trịnh Đình Quang', ChuyenKhoa: 'Răng hàm mặt', SDT: '0948901234' },
    { MaBacSi: 'BS021', HoTen: 'Vương Kim Chi', ChuyenKhoa: 'Nội tổng quát', SDT: '0916789012' },
    { MaBacSi: 'BS022', HoTen: 'Đoàn Nguyên Đức', ChuyenKhoa: 'Răng hàm mặt', SDT: '0927890123' },
    { MaBacSi: 'BS023', HoTen: 'Lưu Hồng Quang', ChuyenKhoa: 'Tai mũi họng', SDT: '0938901234' },
  ])
  const generateMockSchedules = () => {
    const cauGiayDoctors = staffList.slice(0, 12)
    const haiBaTrungDoctors = staffList.slice(12)
    const generatedSchedules = []
    let runningIndex = 1

    for (let time = Date.UTC(2026, 5, 1), dayIndex = 0; time <= Date.UTC(2026, 6, 1); time += 86400000, dayIndex += 1) {
      const ngayTruc = new Date(time).toISOString().slice(0, 10)

      for (let ca = 1; ca <= 4; ca += 1) {
        const doctor = cauGiayDoctors[(dayIndex * 4 + ca - 1) % cauGiayDoctors.length]
        generatedSchedules.push({
          MaLichTruc: `LT_${String(runningIndex).padStart(3, '0')}`,
          MaBacSi: doctor.MaBacSi,
          MaChiNhanh: 'CN_CG',
          NgayTruc: ngayTruc,
          CaTruc: ca,
          TrangThai: 'Đang hoạt động',
        })
        runningIndex += 1
      }

      for (let ca = 1; ca <= 4; ca += 1) {
        const doctor = haiBaTrungDoctors[(dayIndex * 4 + ca - 1) % haiBaTrungDoctors.length]
        generatedSchedules.push({
          MaLichTruc: `LT_${String(runningIndex).padStart(3, '0')}`,
          MaBacSi: doctor.MaBacSi,
          MaChiNhanh: 'CN_HBT',
          NgayTruc: ngayTruc,
          CaTruc: ca,
          TrangThai: 'Đang hoạt động',
        })
        runningIndex += 1
      }
    }

    return generatedSchedules
  }
  const [doctorSchedules] = useState(generateMockSchedules())
	  const initialPatientProfile = {
	    MaBenhAn: user?.MaBenhAn || 'BN001',
	    HoTen: user?.HoTen || user?.name || 'Trần Quang Hải',
	    NgaySinh: user?.NgaySinh || '1995-04-12',
	    GioiTinh: user?.GioiTinh || 'Nam',
	    SDT: user?.SDT || '0901234567',
	    DiaChi: user?.DiaChi || 'Cầu Giấy, Hà Nội',
	    CCCD: user?.CCCD || user?.id || '001095012345',
	    MaSoBHYT: user?.MaSoBHYT || 'DN4010123456789',
	    KyTuDauBHYT: user?.KyTuDauBHYT || 'DN',
	    MatKhau: user?.MatKhau || '123456',
	  }
	  const [patient, setPatient] = useState(initialPatientProfile)
	  const [, setPatientDirectory] = useState([initialPatientProfile])
	  const [bookings, setBookings] = useState([
    {
      MaLichHen: 'LH_001',
      MaBenhAn: 'BN001',
      MaCauHinh: 'CH_CG_DV_KHAM_NOI',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-06-01',
      CaKham: 1,
      MaBacSi: 'BS001',
      PaymentToken: 'PAY_MOCK_100001',
      TrangThai: 'Hoàn thành',
    },
	    {
	      MaLichHen: 'LH_003',
	      MaBenhAn: 'BN001',
      MaCauHinh: 'CH_CG_DV_KHAM_NOI',
      MaDichVu: 'DV_KHAM_NOI',
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-06-01',
      CaKham: 4,
      MaBacSi: 'BS004',
      PaymentToken: 'PAY_MOCK_100002',
	      TrangThai: 'Chờ khám',
	    },
	    {
	      MaLichHen: 'LH_004',
	      MaBenhAn: 'BN001',
	      MaCauHinh: 'CH_CG_DV_KHAM_TIEU_HOA',
	      MaDichVu: 'DV_KHAM_TIEU_HOA',
	      MaChiNhanh: 'CN_CG',
	      NgayKham: '2026-05-18',
	      CaKham: 2,
	      MaBacSi: 'BS005',
	      PaymentToken: 'PAY_MOCK_100004',
	      TrangThai: 'Hoàn thành',
	    },
	    {
	      MaLichHen: 'LH_005',
	      MaBenhAn: 'BN001',
	      MaCauHinh: 'CH_HBT_DV_KHAM_TMH',
	      MaDichVu: 'DV_KHAM_TMH',
	      MaChiNhanh: 'CN_HBT',
	      NgayKham: '2026-04-22',
	      CaKham: 1,
	      MaBacSi: 'BS015',
	      PaymentToken: 'PAY_MOCK_100005',
	      TrangThai: 'Hoàn thành',
	    },
	    {
	      MaLichHen: 'LH_006',
	      MaBenhAn: 'BN001',
	      MaCauHinh: 'CH_CG_DV_KHAM_RANG',
	      MaDichVu: 'DV_KHAM_RANG',
	      MaChiNhanh: 'CN_CG',
	      NgayKham: '2026-03-30',
	      CaKham: 3,
	      MaBacSi: 'BS006',
	      PaymentToken: 'PAY_MOCK_100006',
	      TrangThai: 'Hoàn thành',
	    },
	  ])
	  const [diseases] = useState([
		    { MaBenh: 'K29', TenBenh: 'Viêm dạ dày và tá tràng' },
		    { MaBenh: 'J30', TenBenh: 'Viêm mũi dị ứng' },
		    { MaBenh: 'K02', TenBenh: 'Sâu răng' },
		    { MaBenh: 'K21', TenBenh: 'Trào ngược dạ dày thực quản' },
		    { MaBenh: 'J01', TenBenh: 'Viêm xoang cấp' },
		    { MaBenh: 'K05', TenBenh: 'Viêm nướu và bệnh nha chu' },
		  ])
	  const [visitRecords] = useState([
	    {
	      MaLuotKham: 'LK_001',
	      MaLichHen: 'LH_001',
	      TrieuChung: 'Đau rát vùng thượng vị theo chu kỳ, đầy hơi sau ăn, buồn nôn nhẹ vào buổi sáng.',
		      LoiDan: 'Ăn uống đúng giờ, kiêng đồ chua cay, hạn chế cà phê, tái khám sau 14 ngày nếu còn đau.',
		      MaBenh: 'K29',
		    },
		    {
		      MaLuotKham: 'LK_002',
		      MaLichHen: 'LH_004',
		      TrieuChung: 'Ợ nóng sau ăn, đau âm ỉ vùng thượng vị, cảm giác nghẹn nhẹ khi nằm sau bữa tối.',
		      LoiDan: 'Không nằm ngay sau ăn, chia nhỏ bữa, theo dõi triệu chứng ợ nóng và tái khám sau 3 tuần.',
		      MaBenh: 'K21',
		    },
		    {
		      MaLuotKham: 'LK_003',
		      MaLichHen: 'LH_005',
		      TrieuChung: 'Nghẹt mũi kéo dài, đau vùng trán, chảy dịch mũi vàng xanh, giảm ngửi.',
		      LoiDan: 'Rửa mũi bằng nước muối sinh lý, tránh khói bụi, quay lại nếu sốt hoặc đau tăng.',
		      MaBenh: 'J01',
		    },
		    {
		      MaLuotKham: 'LK_004',
		      MaLichHen: 'LH_006',
		      TrieuChung: 'Chảy máu chân răng khi đánh răng, ê buốt răng hàm dưới, mảng bám nhiều.',
		      LoiDan: 'Vệ sinh răng miệng đúng cách, dùng chỉ nha khoa, tái khám nha chu sau 1 tháng.',
		      MaBenh: 'K05',
		    },
		  ])
	  const [medicines] = useState([
		    { MaThuoc: 'TH001', TenThuoc: 'Omeprazole 20mg', DonViTinh: 'Viên' },
		    { MaThuoc: 'TH002', TenThuoc: 'Phosphalugel', DonViTinh: 'Gói' },
		    { MaThuoc: 'TH003', TenThuoc: 'Domperidone 10mg', DonViTinh: 'Viên' },
		    { MaThuoc: 'TH004', TenThuoc: 'Esomeprazole 40mg', DonViTinh: 'Viên' },
		    { MaThuoc: 'TH005', TenThuoc: 'Loratadine 10mg', DonViTinh: 'Viên' },
		    { MaThuoc: 'TH006', TenThuoc: 'Nước muối xịt mũi', DonViTinh: 'Chai' },
		    { MaThuoc: 'TH007', TenThuoc: 'Chlorhexidine súc miệng', DonViTinh: 'Chai' },
		  ])
	  const [prescriptionDetails] = useState([
		    { MaDonThuoc: 'DT001', MaLuotKham: 'LK_001', MaThuoc: 'TH001', SoLuong: 14, LieuDung: 'Uống 1 viên trước ăn sáng 30 phút trong 14 ngày.' },
		    { MaDonThuoc: 'DT002', MaLuotKham: 'LK_001', MaThuoc: 'TH002', SoLuong: 10, LieuDung: 'Uống 1 gói khi đau hoặc nóng rát dạ dày, tối đa 3 gói/ngày.' },
		    { MaDonThuoc: 'DT003', MaLuotKham: 'LK_001', MaThuoc: 'TH003', SoLuong: 10, LieuDung: 'Uống 1 viên trước bữa ăn khi buồn nôn hoặc đầy hơi.' },
		    { MaDonThuoc: 'DT004', MaLuotKham: 'LK_002', MaThuoc: 'TH004', SoLuong: 21, LieuDung: 'Uống 1 viên trước ăn sáng 30 phút trong 21 ngày.' },
		    { MaDonThuoc: 'DT005', MaLuotKham: 'LK_002', MaThuoc: 'TH002', SoLuong: 12, LieuDung: 'Uống 1 gói khi ợ nóng hoặc đau thượng vị.' },
		    { MaDonThuoc: 'DT006', MaLuotKham: 'LK_003', MaThuoc: 'TH005', SoLuong: 10, LieuDung: 'Uống 1 viên mỗi tối trong 10 ngày.' },
		    { MaDonThuoc: 'DT007', MaLuotKham: 'LK_003', MaThuoc: 'TH006', SoLuong: 1, LieuDung: 'Xịt mỗi bên mũi 2 lần, ngày 3 lần.' },
		    { MaDonThuoc: 'DT008', MaLuotKham: 'LK_004', MaThuoc: 'TH007', SoLuong: 1, LieuDung: 'Súc miệng 15ml sau đánh răng, ngày 2 lần trong 7 ngày.' },
		  ])
	  const [labDetails] = useState([
	    {
	      MaChiTietXN: 'CTXN_001',
	      MaLuotKham: 'LK_001',
	      MaDichVu: 'XN_MAU',
	      KetQuaXetNghiem: 'Bạch cầu trong giới hạn bình thường, Hemoglobin 145 g/L.',
	      MaXNV: 'XNV001',
	      GiaCuoi: 50000,
	      PaymentToken: 'PAY_MOCK_XN001',
	      TrangThaiXetNghiem: 'Đã có kết quả',
	    },
	    {
	      MaChiTietXN: 'CTXN_002',
	      MaLuotKham: 'LK_001',
	      MaDichVu: 'SA_O_BUNG',
	      KetQuaXetNghiem: '',
	      MaXNV: '',
	      GiaCuoi: 60000,
	      PaymentToken: 'PAY_MOCK_XN002',
		      TrangThaiXetNghiem: 'Chưa thực hiện',
		    },
		    {
		      MaChiTietXN: 'CTXN_003',
		      MaLuotKham: 'LK_002',
		      MaDichVu: 'XN_SINH_HOA',
		      KetQuaXetNghiem: 'Men gan AST/ALT trong giới hạn, chức năng thận bình thường.',
		      MaXNV: 'XNV002',
		      GiaCuoi: 70000,
		      PaymentToken: 'PAY_MOCK_XN003',
		      TrangThaiXetNghiem: 'Đã có kết quả',
		    },
		    {
		      MaChiTietXN: 'CTXN_004',
		      MaLuotKham: 'LK_003',
		      MaDichVu: 'XN_MAU',
		      KetQuaXetNghiem: 'Bạch cầu tăng nhẹ, gợi ý tình trạng viêm cấp.',
		      MaXNV: 'XNV001',
		      GiaCuoi: 50000,
		      PaymentToken: 'PAY_MOCK_XN004',
		      TrangThaiXetNghiem: 'Đã có kết quả',
		    },
		    {
		      MaChiTietXN: 'CTXN_005',
		      MaLuotKham: 'LK_004',
		      MaDichVu: 'XN_DUONG_HUYET',
		      KetQuaXetNghiem: '',
		      MaXNV: '',
		      GiaCuoi: 16000,
		      PaymentToken: 'PAY_MOCK_XN005',
		      TrangThaiXetNghiem: 'Chưa thực hiện',
		    },
		  ])
	  const [labTechnicians] = useState([
	    { MaXNV: 'XNV001', HoTen: 'Trần Văn Cường' },
	    { MaXNV: 'XNV002', HoTen: 'Vũ Hồng Ngọc' },
	  ])
	  const [treatmentSchedules, setTreatmentSchedules] = useState([
    {
      MaLichTrinh: 'LTDT_001',
      MaLuotKham: 'LK_001',
      MaDichVu: 'DT_RANG_TUY',
      BuoiSo: 1,
      NgayThucHien: '2026-06-02',
      CaKham: 3,
      TrangThai: 'Hoàn thành',
    },
    {
      MaLichTrinh: 'LTDT_002',
      MaLuotKham: 'LK_001',
      MaDichVu: 'DT_RANG_TUY',
      BuoiSo: 2,
      NgayThucHien: '',
      CaKham: '',
      TrangThai: 'Chưa đặt lịch',
    },
	    {
	      MaLichTrinh: 'LTDT_003',
	      MaLuotKham: 'LK_001',
      MaDichVu: 'DT_RANG_TUY',
      BuoiSo: 3,
      NgayThucHien: '',
	      CaKham: '',
	      TrangThai: 'Chưa đặt lịch',
	    },
	    {
	      MaLichTrinh: 'LTDT_004',
	      MaLuotKham: 'LK_002',
	      MaDichVu: 'DT_TRUYEN_DICH',
	      BuoiSo: 1,
	      NgayThucHien: '2026-05-20',
	      CaKham: 2,
	      TrangThai: 'Hoàn thành',
	    },
	    {
	      MaLichTrinh: 'LTDT_005',
	      MaLuotKham: 'LK_002',
	      MaDichVu: 'DT_TRUYEN_DICH',
	      BuoiSo: 2,
	      NgayThucHien: '2026-05-23',
	      CaKham: 1,
	      TrangThai: 'Đã đặt lịch',
	    },
	    {
	      MaLichTrinh: 'LTDT_006',
	      MaLuotKham: 'LK_003',
	      MaDichVu: 'DT_KHIDUNG',
	      BuoiSo: 1,
	      NgayThucHien: '2026-04-24',
	      CaKham: 3,
	      TrangThai: 'Hoàn thành',
	    },
	    {
	      MaLichTrinh: 'LTDT_007',
	      MaLuotKham: 'LK_003',
	      MaDichVu: 'DT_KHIDUNG',
	      BuoiSo: 2,
	      NgayThucHien: '',
	      CaKham: '',
	      TrangThai: 'Chưa đặt lịch',
	    },
	    {
	      MaLichTrinh: 'LTDT_008',
	      MaLuotKham: 'LK_004',
	      MaDichVu: 'DT_HAN_RANG',
	      BuoiSo: 1,
	      NgayThucHien: '2026-04-01',
	      CaKham: 4,
	      TrangThai: 'Hoàn thành',
	    },
	    {
	      MaLichTrinh: 'LTDT_009',
	      MaLuotKham: 'LK_004',
	      MaDichVu: 'DT_HAN_RANG',
	      BuoiSo: 2,
	      NgayThucHien: '',
	      CaKham: '',
	      TrangThai: 'Chưa đặt lịch',
	    },
	  ])
  const [bookingForm, setBookingForm] = useState({
    MaChiNhanh: 'CN_CG',
    MaDichVu: 'DV_KHAM_NOI',
    NgayKham: '2026-06-01',
    CaKham: '1',
    MaBacSi: 'BS001',
  })
	  const [treatmentDrafts, setTreatmentDrafts] = useState({})
	  const [activeTreatmentId, setActiveTreatmentId] = useState('')
	  const [selectedVisitId, setSelectedVisitId] = useState('LK_001')
	  const [paymentModal, setPaymentModal] = useState(null)
	  const [appointmentSearch, setAppointmentSearch] = useState('')
	  const [isEditingContact, setIsEditingContact] = useState(false)
	  const [contactForm, setContactForm] = useState({
	    SDT: initialPatientProfile.SDT,
	    DiaChi: initialPatientProfile.DiaChi,
	  })
	  const [showPasswordForm, setShowPasswordForm] = useState(false)
	  const [passwordForm, setPasswordForm] = useState({
	    currentPassword: '',
	    newPassword: '',
	    confirmPassword: '',
	  })

  const bhytCategories = [
    { KyTuDauBHYT: 'TE', DoiTuongChinhSach: 'Trẻ em dưới 6 tuổi', TyLeHuong: 1 },
    { KyTuDauBHYT: 'HT', DoiTuongChinhSach: 'Cán bộ Hưu trí', TyLeHuong: 0.95 },
    { KyTuDauBHYT: 'DN', DoiTuongChinhSach: 'Người lao động doanh nghiệp', TyLeHuong: 0.8 },
  ]

  const clinicalServices = services.filter((service) => service.LoaiDichVu === 'Khám lâm sàng')
  const filteredClinicalServices = clinicalServices.filter((service) => {
    const keyword = serviceSearch.trim().toLowerCase()
    if (!keyword) return true
    return [service.MaDichVu, service.TenDichVu, service.ChuyenKhoa]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
  })
  const groupedClinicalServices = ['Nội tổng quát', 'Răng hàm mặt', 'Tai mũi họng']
    .map((department) => ({
      department,
      services: filteredClinicalServices.filter((service) => service.ChuyenKhoa === department),
    }))
    .filter((group) => group.services.length > 0)

  const getService = (maDichVu) =>
    services.find((service) => service.MaDichVu === maDichVu) || {
      MaDichVu: maDichVu,
      TenDichVu: maDichVu,
      ChuyenKhoa: '',
      LoaiDichVu: '',
      GiaGoc: 0,
    }

  const getBranchName = (maChiNhanh) =>
    branches.find((branch) => branch.MaChiNhanh === maChiNhanh)?.TenChiNhanh || maChiNhanh

  const getBranchConfig = (maChiNhanh, maDichVu) =>
    branchServices.find((config) => config.MaChiNhanh === maChiNhanh && config.MaDichVu === maDichVu)

	  const getDoctorInfo = (maBacSi) =>
	    staffList.find((doctor) => doctor.MaBacSi === maBacSi) || {
	      MaBacSi: maBacSi,
	      HoTen: maBacSi,
	      ChuyenKhoa: '',
	      SDT: 'Chưa cập nhật',
	    }

	  const formatDoctorFullInfo = (doctor) =>
	    `Bác sĩ ${doctor.HoTen} - Khoa: ${doctor.ChuyenKhoa || 'Chưa cập nhật'} (SĐT: ${doctor.SDT || 'Chưa cập nhật'})`

	  const formatDoctorAssignedInfo = (doctor) =>
	    `Bác sĩ phụ trách: Bác sĩ ${doctor.HoTen} | Chuyên khoa: ${doctor.ChuyenKhoa || 'Chưa cập nhật'} | SĐT: ${doctor.SDT || 'Chưa cập nhật'}`

	  const getDiseaseInfo = (maBenh) =>
	    diseases.find((disease) => disease.MaBenh === maBenh) || {
	      MaBenh: maBenh,
	      TenBenh: 'Chưa xác định',
	    }

	  const getMedicineInfo = (maThuoc) =>
	    medicines.find((medicine) => medicine.MaThuoc === maThuoc) || {
	      MaThuoc: maThuoc,
	      TenThuoc: maThuoc,
	      DonViTinh: '',
	    }

	  const getLabTechnicianName = (maXNV) =>
	    labTechnicians.find((technician) => technician.MaXNV === maXNV)?.HoTen || 'Chưa phân công'

  const getBhytRate = () =>
    bhytCategories.find((category) => category.KyTuDauBHYT === patient.KyTuDauBHYT)?.TyLeHuong || 0

  const formatMoney = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const buildInvoice = ({ maDichVu, maChiNhanh, ngayKham, caKham }) => {
    const service = getService(maDichVu)
    const tyLeHuong = getBhytRate()
    const bhytAmount = Math.round(service.GiaGoc * tyLeHuong)
    const finalAmount = Math.max(0, service.GiaGoc - bhytAmount)

    return {
      maDichVu,
      tenDichVu: service.TenDichVu,
      maChiNhanh,
      tenChiNhanh: getBranchName(maChiNhanh),
      ngayKham,
      caKham,
      giaGoc: service.GiaGoc,
      bhytAmount,
      finalAmount,
    }
  }

  const normalizeScheduleParams = (params) => ({
    maChiNhanh: params.maChiNhanh ?? params.MaChiNhanh ?? '',
    maDichVu: params.maDichVu ?? params.MaDichVu ?? '',
    ngayKham: params.ngayKham ?? params.NgayKham ?? '',
    caKham: params.caKham ?? params.CaKham ?? '',
  })

  const getBookedCountForSlot = (params) => {
    const { maChiNhanh, ngayKham, caKham } = normalizeScheduleParams(params)
    return bookings.filter(
      (booking) =>
        booking.MaChiNhanh === maChiNhanh &&
        booking.NgayKham === ngayKham &&
        Number(booking.CaKham) === Number(caKham) &&
        booking.TrangThai !== 'Đã hủy',
    ).length
  }

  const getSlotLimit = (params) => {
    const { maChiNhanh, maDichVu } = normalizeScheduleParams(params)
    return Number(getBranchConfig(maChiNhanh, maDichVu)?.SlotGioiHan || 15)
  }

  const getRemainingSlots = (params) =>
    Math.max(0, getSlotLimit(params) - getBookedCountForSlot(params))

  const getAvailableShifts = (params) => {
    const { maChiNhanh, maDichVu, ngayKham } = normalizeScheduleParams(params)
    console.log('LOG_LỌC_CA:', { maChiNhanh, ngayKham, tổng_lịch_trực: doctorSchedules.length })

    const result = [1, 2, 3, 4].filter((shift) => {
      const hasWorkingDoctor = doctorSchedules.some(
        (schedule) =>
          schedule.MaChiNhanh === maChiNhanh &&
          schedule.NgayTruc === ngayKham &&
          Number(schedule.CaTruc) === Number(shift) &&
          schedule.TrangThai === 'Đang hoạt động',
      )
      const bookedCount = getBookedCountForSlot({
        maChiNhanh,
        maDichVu,
        ngayKham,
        caKham: shift,
      })
      const slotLimit = getSlotLimit({ maChiNhanh, maDichVu })

      return hasWorkingDoctor && bookedCount < slotLimit
    })

    console.log('LOG_KẾT_QUẢ_CA:', result)
    return result
  }

  const getShiftTimeLabel = (shift) => {
    const shiftTimes = {
      1: 'Ca 1 (07:30 - 10:15)',
      2: 'Ca 2 (10:15 - 12:00)',
      3: 'Ca 3 (13:30 - 16:30)',
      4: 'Ca 4 (16:30 - 19:30)',
    }

    return shiftTimes[Number(shift)] || `Ca ${shift}`
  }

  const getAvailableDoctorsForShift = (params) => {
    const { maChiNhanh, maDichVu, ngayKham, caKham } = normalizeScheduleParams(params)
    const service = getService(maDichVu)
    const selectedDoctorIds = new Set()

    return doctorSchedules
      .filter((schedule) => {
        const doctor = getDoctorInfo(schedule.MaBacSi)
        const isMatched =
          schedule.MaChiNhanh === maChiNhanh &&
          schedule.NgayTruc === ngayKham &&
          Number(schedule.CaTruc) === Number(caKham) &&
          schedule.TrangThai === 'Đang hoạt động' &&
          doctor.ChuyenKhoa === service.ChuyenKhoa &&
          !selectedDoctorIds.has(schedule.MaBacSi)

        if (isMatched) selectedDoctorIds.add(schedule.MaBacSi)
        return isMatched
      })
      .map((schedule) => {
        const doctor = getDoctorInfo(schedule.MaBacSi)
	        return {
	          MaBacSi: schedule.MaBacSi,
	          TenBacSi: doctor.HoTen,
	          ChuyenKhoa: doctor.ChuyenKhoa,
	          SDT: doctor.SDT,
	        }
      })
      .sort((first, second) => first.TenBacSi.localeCompare(second.TenBacSi, 'vi'))
  }

  const getDefaultSlotSelection = (params) => {
    const { maChiNhanh, maDichVu, ngayKham } = normalizeScheduleParams(params)
    const shifts = getAvailableShifts({ maChiNhanh, maDichVu, ngayKham })
    const shiftWithDoctor = shifts.find((shift) =>
      getAvailableDoctorsForShift({
        maChiNhanh,
        maDichVu,
        ngayKham,
        caKham: shift,
      }).length > 0,
    )
    const selectedShift = shiftWithDoctor || shifts[0]
    const doctorsForShift = selectedShift
      ? getAvailableDoctorsForShift({
          maChiNhanh,
          maDichVu,
          ngayKham,
          caKham: selectedShift,
        })
      : []

    return {
      CaKham: selectedShift ? String(selectedShift) : '',
      MaBacSi: doctorsForShift[0]?.MaBacSi || '',
    }
  }

  const bookingAvailableShifts = getAvailableShifts(bookingForm)
  const bookingAvailableDoctors = getAvailableDoctorsForShift({
    maChiNhanh: bookingForm.MaChiNhanh,
    maDichVu: bookingForm.MaDichVu,
    ngayKham: bookingForm.NgayKham,
    caKham: bookingForm.CaKham,
  })
  const filteredBookings = bookings.filter((booking) => {
    const keyword = appointmentSearch.trim().toLowerCase()
    if (!keyword) return true

    return [
      booking.MaLichHen,
      getService(booking.MaDichVu).TenDichVu,
      getBranchName(booking.MaChiNhanh),
      booking.NgayKham,
      booking.TrangThai,
    ]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
  })

  const handleBookingFormChange = (field, value) => {
    setBookingForm((current) => {
      const next = { ...current, [field]: value }
      if (field !== 'CaKham') {
        const nextSelection = getDefaultSlotSelection(next)
        next.CaKham = nextSelection.CaKham
        next.MaBacSi = nextSelection.MaBacSi
      }
      return next
    })
  }

  const handleBookingShiftChange = (value) => {
    const doctorsForShift = getAvailableDoctorsForShift({
      maChiNhanh: bookingForm.MaChiNhanh,
      maDichVu: bookingForm.MaDichVu,
      ngayKham: bookingForm.NgayKham,
      caKham: value,
    })
    setBookingForm((current) => ({
      ...current,
      CaKham: value,
      MaBacSi: doctorsForShift[0]?.MaBacSi || '',
    }))
  }

	  const handleBookingDoctorChange = (value) => {
	    setBookingForm((current) => ({
	      ...current,
	      MaBacSi: value,
	    }))
	  }

	  const handleStartEditContact = () => {
	    setContactForm({
	      SDT: patient.SDT,
	      DiaChi: patient.DiaChi,
	    })
	    setIsEditingContact(true)
	  }

	  const handleCancelEditContact = () => {
	    setContactForm({
	      SDT: patient.SDT,
	      DiaChi: patient.DiaChi,
	    })
	    setIsEditingContact(false)
	  }

	  const handleSaveContact = () => {
	    const nextPatient = {
	      ...patient,
	      SDT: contactForm.SDT.trim(),
	      DiaChi: contactForm.DiaChi.trim(),
	    }

	    setPatient(nextPatient)
	    setPatientDirectory((current) =>
	      current.map((item) => (item.MaBenhAn === nextPatient.MaBenhAn ? nextPatient : item)),
	    )
	    onUpdateUser?.({
	      SDT: nextPatient.SDT,
	      DiaChi: nextPatient.DiaChi,
	      id: nextPatient.SDT,
	    })
	    setIsEditingContact(false)
	    alert('Cập nhật thông tin liên hệ thành công!')
	  }

	  const handlePasswordFormChange = (field, value) => {
	    setPasswordForm((current) => ({
	      ...current,
	      [field]: value,
	    }))
	  }

	  const handleCancelPasswordChange = () => {
	    setPasswordForm({
	      currentPassword: '',
	      newPassword: '',
	      confirmPassword: '',
	    })
	    setShowPasswordForm(false)
	  }

	  const handleConfirmPasswordChange = () => {
	    if (passwordForm.currentPassword !== patient.MatKhau) {
	      alert('Mật khẩu hiện tại không chính xác.')
	      return
	    }

	    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
	      alert('Mật khẩu mới và xác nhận mật khẩu không khớp.')
	      return
	    }

	    const nextPatient = {
	      ...patient,
	      MatKhau: passwordForm.newPassword,
	    }

	    setPatient(nextPatient)
	    setPatientDirectory((current) =>
	      current.map((item) => (item.MaBenhAn === nextPatient.MaBenhAn ? nextPatient : item)),
	    )
	    onUpdateUser?.({ MatKhau: passwordForm.newPassword })
	    handleCancelPasswordChange()
	    alert('Đổi mật khẩu thành công!')
	  }

	  const handleTreatmentDraftChange = (maLichTrinh, field, value) => {
    setTreatmentDrafts((current) => {
      const currentDraft = current[maLichTrinh] || {
        MaChiNhanh: 'CN_CG',
        NgayKham: '2026-06-05',
        CaKham: '',
        MaBacSi: '',
      }
      const nextDraft = { ...currentDraft, [field]: value }
      const treatment = treatmentSchedules.find((item) => item.MaLichTrinh === maLichTrinh)

      if (field !== 'CaKham' && treatment) {
        const nextSelection = getDefaultSlotSelection({
          maChiNhanh: nextDraft.MaChiNhanh,
          maDichVu: treatment.MaDichVu,
          ngayKham: nextDraft.NgayKham,
        })
        nextDraft.CaKham = nextSelection.CaKham
        nextDraft.MaBacSi = nextSelection.MaBacSi
      }

      return { ...current, [maLichTrinh]: nextDraft }
    })
  }

  const handleTreatmentShiftChange = (maLichTrinh, value) => {
    const currentDraft = treatmentDrafts[maLichTrinh]
    const treatment = treatmentSchedules.find((item) => item.MaLichTrinh === maLichTrinh)
    const doctorsForShift = treatment
      ? getAvailableDoctorsForShift({
          maChiNhanh: currentDraft?.MaChiNhanh || 'CN_CG',
          maDichVu: treatment.MaDichVu,
          ngayKham: currentDraft?.NgayKham || '2026-06-05',
          caKham: value,
        })
      : []

    setTreatmentDrafts((current) => ({
      ...current,
      [maLichTrinh]: {
        ...current[maLichTrinh],
        CaKham: value,
        MaBacSi: doctorsForShift[0]?.MaBacSi || '',
      },
    }))
  }

  const handleTreatmentDoctorChange = (maLichTrinh, value) => {
    setTreatmentDrafts((current) => ({
      ...current,
      [maLichTrinh]: {
        ...current[maLichTrinh],
        MaBacSi: value,
      },
    }))
  }

  const startTreatmentBooking = (treatment) => {
    const initialDraft = {
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-06-05',
      CaKham: '',
      MaBacSi: '',
    }
    const initialSelection = getDefaultSlotSelection({
      maChiNhanh: initialDraft.MaChiNhanh,
      maDichVu: treatment.MaDichVu,
      ngayKham: initialDraft.NgayKham,
    })
    setTreatmentDrafts((current) => ({
      ...current,
      [treatment.MaLichTrinh]: {
        ...initialDraft,
        CaKham: initialSelection.CaKham,
        MaBacSi: initialSelection.MaBacSi,
      },
    }))
    setActiveTreatmentId(treatment.MaLichTrinh)
  }

  const openBookingPayment = () => {
    if (!bookingForm.CaKham || !bookingForm.MaBacSi) {
      alert('Hiện chưa có ca trống phù hợp. Vui lòng chọn ngày hoặc chi nhánh khác.')
      return
    }

    const config = getBranchConfig(bookingForm.MaChiNhanh, bookingForm.MaDichVu)
    if (!config) {
      alert('Dịch vụ này chưa được phân phối tại chi nhánh đã chọn.')
      return
    }

    setPaymentModal({
      type: 'new-booking',
      invoice: buildInvoice({
        maDichVu: bookingForm.MaDichVu,
        maChiNhanh: bookingForm.MaChiNhanh,
        ngayKham: bookingForm.NgayKham,
        caKham: Number(bookingForm.CaKham),
      }),
      payload: {
        ...bookingForm,
        MaCauHinh: config.MaCauHinh,
        CaKham: Number(bookingForm.CaKham),
        MaBacSi: bookingForm.MaBacSi,
      },
    })
  }

  const openTreatmentPayment = (treatment) => {
    const draft = treatmentDrafts[treatment.MaLichTrinh]
    if (!draft?.CaKham || !draft?.MaBacSi) {
      alert('Hiện chưa có ca điều trị trống phù hợp. Vui lòng chọn ngày hoặc chi nhánh khác.')
      return
    }

    const config = getBranchConfig(draft.MaChiNhanh, treatment.MaDichVu)
    if (!config) {
      alert('Dịch vụ điều trị này chưa được phân phối tại chi nhánh đã chọn.')
      return
    }

    setPaymentModal({
      type: 'treatment-booking',
      invoice: buildInvoice({
        maDichVu: treatment.MaDichVu,
        maChiNhanh: draft.MaChiNhanh,
        ngayKham: draft.NgayKham,
        caKham: Number(draft.CaKham),
      }),
      payload: {
        MaLichTrinh: treatment.MaLichTrinh,
        MaDichVu: treatment.MaDichVu,
        MaCauHinh: config.MaCauHinh,
        MaChiNhanh: draft.MaChiNhanh,
        NgayKham: draft.NgayKham,
        CaKham: Number(draft.CaKham),
        MaBacSi: draft.MaBacSi,
      },
    })
  }

  const confirmMockPayment = () => {
    if (!paymentModal) return

    const paymentToken = `PAY_MOCK_${Math.floor(100000 + Math.random() * 900000)}`
    const newBooking = {
      MaLichHen: `LH_${String(bookings.length + 1).padStart(3, '0')}`,
      MaBenhAn: patient.MaBenhAn,
      MaCauHinh: paymentModal.payload.MaCauHinh,
      MaDichVu: paymentModal.invoice.maDichVu,
      MaChiNhanh: paymentModal.invoice.maChiNhanh,
      NgayKham: paymentModal.invoice.ngayKham,
      CaKham: paymentModal.invoice.caKham,
      MaBacSi: paymentModal.payload.MaBacSi,
      PaymentToken: paymentToken,
      TrangThai: 'Đã xác nhận',
    }

    setBookings((current) => [...current, newBooking])

    if (paymentModal.type === 'treatment-booking') {
      setTreatmentSchedules((current) =>
        current.map((item) =>
          item.MaLichTrinh === paymentModal.payload.MaLichTrinh
	            ? {
	                ...item,
	                NgayThucHien: paymentModal.invoice.ngayKham,
	                CaKham: paymentModal.invoice.caKham,
	                MaBacSi: paymentModal.payload.MaBacSi,
	                TrangThai: 'Đã đặt lịch',
	              }
            : item,
        ),
      )
      setActiveTreatmentId('')
    }

    setPaymentModal(null)
    alert('Thanh toán thành công! Lịch hẹn của bạn đã được hệ thống xác nhận.')
  }

  const renderPaymentModal = () => {
    if (!paymentModal) return null

    return (
      <div className="payment-overlay">
        <div className="payment-modal">
          <div className="payment-modal-header">
            <div>
              <span>Cổng thanh toán QR</span>
              <h2>Xác nhận thanh toán</h2>
            </div>
            <button type="button" onClick={() => setPaymentModal(null)}>
              Đóng
            </button>
          </div>

          <div className="payment-invoice">
            <div>
              <span>Dịch vụ</span>
              <strong>{paymentModal.invoice.tenDichVu}</strong>
            </div>
            <div>
              <span>Chi nhánh</span>
              <strong>{paymentModal.invoice.tenChiNhanh}</strong>
            </div>
            <div>
              <span>Ngày/Ca khám</span>
              <strong>
                {paymentModal.invoice.ngayKham} - Ca {paymentModal.invoice.caKham}
              </strong>
            </div>
            <div>
              <span>Giá gốc</span>
              <strong>{formatMoney(paymentModal.invoice.giaGoc)}</strong>
            </div>
            <div>
              <span>BHYT giảm</span>
              <strong>{formatMoney(paymentModal.invoice.bhytAmount)}</strong>
            </div>
            <div>
              <span>Giá cuối thực trả</span>
              <strong>{formatMoney(paymentModal.invoice.finalAmount)}</strong>
            </div>
          </div>

          <div className="qr-box">
            <div className="qr-grid" />
            <span>QR chuyển khoản giả lập</span>
          </div>

          <button type="button" className="payment-confirm-button" onClick={confirmMockPayment}>
            Bấm vào đây để giả lập đã chuyển khoản thành công
          </button>
        </div>
      </div>
    )
  }

  const renderBooking = () => {
    const invoice = buildInvoice({
      maDichVu: bookingForm.MaDichVu,
      maChiNhanh: bookingForm.MaChiNhanh,
      ngayKham: bookingForm.NgayKham,
      caKham: Number(bookingForm.CaKham || 0),
    })

    return (
      <div className="patient-card">
        <h2>Đặt lịch khám mới</h2>
        <p>Chọn dịch vụ khám lâm sàng, chi nhánh, ngày và ca trống phù hợp với lịch trực bác sĩ.</p>

        <div className="patient-service-picker">
          <div className="patient-service-picker-head">
            <div>
              <span>Dịch vụ khám lâm sàng</span>
              <strong>{getService(bookingForm.MaDichVu).TenDichVu}</strong>
            </div>
            <input
              type="search"
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
              placeholder="Tìm mã, tên dịch vụ hoặc chuyên khoa"
            />
          </div>
          <div className="patient-service-groups">
            {groupedClinicalServices.length === 0 && <div className="patient-empty-service">Không tìm thấy dịch vụ phù hợp</div>}
            {groupedClinicalServices.map((group) => (
              <section key={group.department} className="patient-service-group">
                <h3>Khoa {group.department}</h3>
                <div className="patient-service-list">
                  {group.services.map((service) => (
                    <button
                      type="button"
                      key={service.MaDichVu}
                      className={`patient-service-option ${bookingForm.MaDichVu === service.MaDichVu ? 'active' : ''}`}
                      onClick={() => handleBookingFormChange('MaDichVu', service.MaDichVu)}
                    >
                      <span>{service.MaDichVu}</span>
                      <strong>{service.TenDichVu}</strong>
                      <em>{formatMoney(service.GiaGoc)}</em>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="patient-form-grid">
          <label>
            Chi nhánh
            <select
              value={bookingForm.MaChiNhanh}
              onChange={(event) => handleBookingFormChange('MaChiNhanh', event.target.value)}
            >
              {branches.map((branch) => (
                <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
                  {branch.TenChiNhanh}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ngày khám
            <input
              type="date"
              value={bookingForm.NgayKham}
              onChange={(event) => handleBookingFormChange('NgayKham', event.target.value)}
            />
          </label>
          <label>
            Ca khám
            <select value={bookingForm.CaKham} onChange={(event) => handleBookingShiftChange(event.target.value)}>
	              {bookingAvailableShifts.length === 0 && <option value="">Không có ca trống</option>}
	              {bookingAvailableShifts.map((shift) => (
	                <option key={shift} value={shift}>
	                  {getShiftTimeLabel(shift)} - còn{' '}
	                  {getRemainingSlots({
	                    maChiNhanh: bookingForm.MaChiNhanh,
	                    maDichVu: bookingForm.MaDichVu,
	                    ngayKham: bookingForm.NgayKham,
	                    caKham: shift,
	                  })}{' '}
	                  slot
	                </option>
	              ))}
            </select>
          </label>
          <label>
            Bác sĩ phụ trách
            {bookingAvailableDoctors.length > 1 ? (
	              <select value={bookingForm.MaBacSi} onChange={(event) => handleBookingDoctorChange(event.target.value)}>
	                {bookingAvailableDoctors.map((doctor) => (
	                  <option key={doctor.MaBacSi} value={doctor.MaBacSi}>
	                    {formatDoctorFullInfo({
	                      HoTen: doctor.TenBacSi,
	                      ChuyenKhoa: doctor.ChuyenKhoa,
	                      SDT: doctor.SDT,
	                    })}
	                  </option>
	                ))}
	              </select>
            ) : (
	              <div className="patient-doctor-note">
	                {bookingAvailableDoctors[0]
	                  ? formatDoctorAssignedInfo({
	                      HoTen: bookingAvailableDoctors[0].TenBacSi,
	                      ChuyenKhoa: bookingAvailableDoctors[0].ChuyenKhoa,
	                      SDT: bookingAvailableDoctors[0].SDT,
	                    })
	                  : 'Ca này không có bác sĩ chuyên khoa phù hợp, vui lòng chọn ca khác'}
	              </div>
            )}
          </label>
        </div>

        <div className="patient-invoice-preview">
          <strong>Xem trước hóa đơn</strong>
          <span>Giá gốc: {formatMoney(invoice.giaGoc)}</span>
          <span>BHYT giảm: {formatMoney(invoice.bhytAmount)}</span>
          <span>Giá cuối: {formatMoney(invoice.finalAmount)}</span>
        </div>

        <button type="button" className="patient-primary-button" onClick={openBookingPayment}>
          Tiến hành thanh toán
        </button>
      </div>
    )
  }

	  const renderMyBookings = () => (
	    <div className="patient-card">
	      <h2>Lịch hẹn của tôi</h2>
	      <div className="patient-appointment-toolbar">
	        <input
	          type="search"
	          value={appointmentSearch}
	          onChange={(event) => setAppointmentSearch(event.target.value)}
	          placeholder="Tìm kiếm theo mã lịch hẹn, dịch vụ, chi nhánh, ngày, trạng thái..."
	        />
	        <span>{filteredBookings.length} lịch hẹn</span>
	      </div>
	      <div className="patient-table-wrap">
	        <table className="patient-table">
	          <thead>
	            <tr>
	              <th>Mã lịch hẹn</th>
	              <th>Dịch vụ</th>
	              <th>Chi nhánh</th>
	              <th>Bác sĩ phụ trách</th>
	              <th>Ngày</th>
	              <th>Ca</th>
	              <th>Trạng thái</th>
	              <th>PaymentToken</th>
	            </tr>
	          </thead>
	          <tbody>
	            {filteredBookings.map((booking) => (
	              <tr key={booking.MaLichHen}>
	                <td>{booking.MaLichHen}</td>
	                <td>{getService(booking.MaDichVu).TenDichVu}</td>
	                <td>{getBranchName(booking.MaChiNhanh)}</td>
	                <td>{booking.MaBacSi ? getDoctorInfo(booking.MaBacSi).HoTen : 'Đang điều phối'}</td>
	                <td>{booking.NgayKham}</td>
	                <td>Ca {booking.CaKham}</td>
	                <td>{booking.TrangThai}</td>
	                <td>{booking.PaymentToken}</td>
	              </tr>
	            ))}
	            {filteredBookings.length === 0 && (
	              <tr>
	                <td colSpan="8" className="patient-empty-row">
	                  Không tìm thấy lịch hẹn phù hợp.
	                </td>
	              </tr>
	            )}
	          </tbody>
	        </table>
	      </div>
	    </div>
  )

  const renderTreatmentBookingControl = (treatment) => {
    const draft = treatmentDrafts[treatment.MaLichTrinh] || {
      MaChiNhanh: 'CN_CG',
      NgayKham: '2026-06-05',
      CaKham: '',
      MaBacSi: '',
    }
    const shifts = getAvailableShifts({
      maChiNhanh: draft.MaChiNhanh,
      maDichVu: treatment.MaDichVu,
      ngayKham: draft.NgayKham,
    })
    const treatmentDoctors = getAvailableDoctorsForShift({
      maChiNhanh: draft.MaChiNhanh,
      maDichVu: treatment.MaDichVu,
      ngayKham: draft.NgayKham,
      caKham: draft.CaKham,
    })
    const invoice = buildInvoice({
      maDichVu: treatment.MaDichVu,
      maChiNhanh: draft.MaChiNhanh,
      ngayKham: draft.NgayKham,
      caKham: Number(draft.CaKham || 0),
    })

    if (treatment.TrangThai !== 'Chưa đặt lịch') return null

    if (activeTreatmentId !== treatment.MaLichTrinh) {
      return (
        <button
          type="button"
          className="patient-secondary-button"
          onClick={() => startTreatmentBooking(treatment)}
        >
          Đặt lịch cho buổi này
        </button>
      )
    }

    return (
      <div className="treatment-inline-form">
        <select
          value={draft.MaChiNhanh}
          onChange={(event) => handleTreatmentDraftChange(treatment.MaLichTrinh, 'MaChiNhanh', event.target.value)}
        >
          {branches.map((branch) => (
            <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
              {branch.TenChiNhanh}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={draft.NgayKham}
          onChange={(event) => handleTreatmentDraftChange(treatment.MaLichTrinh, 'NgayKham', event.target.value)}
        />
        <select
          value={draft.CaKham}
          onChange={(event) => handleTreatmentShiftChange(treatment.MaLichTrinh, event.target.value)}
        >
          {shifts.length === 0 && <option value="">Không có ca trống</option>}
          {shifts.map((shift) => (
            <option key={shift} value={shift}>
              {getShiftTimeLabel(shift)} - còn{' '}
              {getRemainingSlots({
                maChiNhanh: draft.MaChiNhanh,
                maDichVu: treatment.MaDichVu,
                ngayKham: draft.NgayKham,
                caKham: shift,
              })}{' '}
              slot
            </option>
          ))}
        </select>
        {treatmentDoctors.length > 1 ? (
          <select
            value={draft.MaBacSi}
            onChange={(event) => handleTreatmentDoctorChange(treatment.MaLichTrinh, event.target.value)}
          >
            {treatmentDoctors.map((doctor) => (
              <option key={doctor.MaBacSi} value={doctor.MaBacSi}>
                {doctor.TenBacSi} - {doctor.ChuyenKhoa}
              </option>
            ))}
          </select>
        ) : (
          <div className="patient-doctor-note compact">
            {treatmentDoctors[0]
              ? `Bác sĩ phụ trách: ${treatmentDoctors[0].TenBacSi}`
              : 'Ca này không có bác sĩ chuyên khoa phù hợp, vui lòng chọn ca khác'}
          </div>
        )}
        <div className="patient-invoice-preview compact">
          <span>Giá gốc: {formatMoney(invoice.giaGoc)}</span>
          <span>BHYT giảm: {formatMoney(invoice.bhytAmount)}</span>
          <strong>Giá cuối: {formatMoney(invoice.finalAmount)}</strong>
        </div>
        <button
          type="button"
          className="patient-primary-button"
          onClick={() => openTreatmentPayment(treatment)}
        >
          Tiến hành thanh toán
        </button>
      </div>
    )
  }

  const renderHealthRecordSection = () => {
    const completedVisits = visitRecords
      .map((visit) => ({
        ...visit,
        booking: bookings.find(
          (booking) =>
            booking.MaLichHen === visit.MaLichHen &&
            booking.MaBenhAn === patient.MaBenhAn &&
            booking.TrangThai === 'Hoàn thành',
        ),
      }))
      .filter((visit) => visit.booking)
      .sort((first, second) => new Date(second.booking.NgayKham) - new Date(first.booking.NgayKham))
    const selectedVisit = completedVisits.find((visit) => visit.MaLuotKham === selectedVisitId) || completedVisits[0]

    if (!selectedVisit) {
      return (
        <section className="patient-card">
          <h2>Sổ khám bệnh</h2>
          <p>Chưa có lượt khám hoàn thành để hiển thị hồ sơ sức khỏe.</p>
        </section>
      )
    }

    const disease = getDiseaseInfo(selectedVisit.MaBenh)
    const selectedDoctor = getDoctorInfo(selectedVisit.booking.MaBacSi)
    const selectedPrescriptions = prescriptionDetails.filter((item) => item.MaLuotKham === selectedVisit.MaLuotKham)
    const selectedLabs = labDetails.filter((item) => item.MaLuotKham === selectedVisit.MaLuotKham)
    const selectedTreatments = treatmentSchedules.filter((item) => item.MaLuotKham === selectedVisit.MaLuotKham)
    const treatmentGroups = Object.values(
      selectedTreatments.reduce((groups, item) => {
        const currentGroup = groups[item.MaDichVu] || {
          MaDichVu: item.MaDichVu,
          sessions: [],
        }
        currentGroup.sessions.push(item)
        groups[item.MaDichVu] = currentGroup
        return groups
      }, {}),
    )

    return (
      <section className="patient-card health-record-card">
        <div className="health-record-header">
          <div>
            <h2>Sổ khám bệnh</h2>
            <p>Hồ sơ sức khỏe cá nhân theo từng lượt khám đã hoàn thành.</p>
          </div>
          <span>{completedVisits.length} lượt khám</span>
        </div>

        <div className="health-record-layout">
          <aside className="health-timeline">
            {completedVisits.map((visit) => {
              const visitDisease = getDiseaseInfo(visit.MaBenh)
              const visitDoctor = getDoctorInfo(visit.booking.MaBacSi)
              return (
                <button
                  type="button"
                  key={visit.MaLuotKham}
                  className={`health-timeline-card ${selectedVisit.MaLuotKham === visit.MaLuotKham ? 'active' : ''}`}
                  onClick={() => setSelectedVisitId(visit.MaLuotKham)}
                >
                  <span>{visit.booking.NgayKham}</span>
                  <strong>{visit.MaLuotKham}</strong>
                  <em>
                    BS: {visitDoctor.HoTen} ({visitDoctor.ChuyenKhoa || 'Chưa cập nhật'})
                  </em>
                  <small>{visitDisease.TenBenh}</small>
                </button>
              )
            })}
          </aside>

          <div className="health-detail">
            <section className="health-detail-section">
              <div className="health-section-title">
                <span>Chẩn đoán lâm sàng</span>
                <strong>
                  {disease.MaBenh} - {disease.TenBenh}
                </strong>
              </div>
              <div className="clinical-grid">
                <div>
                  <span>Triệu chứng lâm sàng</span>
                  <p>{selectedVisit.TrieuChung}</p>
                </div>
                <div className="clinical-doctor-info">
                  <span>Bác sĩ chủ trị</span>
                  <p>
                    Bác sĩ chủ trị: Bác sĩ {selectedDoctor.HoTen} | Chuyên khoa:{' '}
                    {selectedDoctor.ChuyenKhoa || 'Chưa cập nhật'} | Số điện thoại liên hệ:{' '}
                    {selectedDoctor.SDT || 'Chưa cập nhật'}
                  </p>
                </div>
                <div className="clinical-advice">
                  <span>Lời dặn tái khám</span>
                  <p>{selectedVisit.LoiDan}</p>
                </div>
              </div>
            </section>

            <section className="health-detail-section">
              <div className="health-section-title">
                <span>Đơn thuốc được kê</span>
                <strong>{selectedPrescriptions.length} thuốc</strong>
              </div>
              <div className="patient-table-wrap">
                <table className="patient-table compact">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên thuốc</th>
                      <th>Số lượng</th>
                      <th>Đơn vị tính</th>
                      <th>Liều dùng & Cách dùng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrescriptions.map((item, index) => {
                      const medicine = getMedicineInfo(item.MaThuoc)
                      return (
                        <tr key={item.MaDonThuoc}>
                          <td>{index + 1}</td>
                          <td>{medicine.TenThuoc}</td>
                          <td>{item.SoLuong}</td>
                          <td>{medicine.DonViTinh}</td>
                          <td>{item.LieuDung}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="health-detail-section">
              <div className="health-section-title">
                <span>Nhật ký xét nghiệm cận lâm sàng</span>
                <strong>{selectedLabs.length} chỉ định</strong>
              </div>
              <div className="lab-card-grid">
                {selectedLabs.map((lab) => (
                  <article key={lab.MaChiTietXN} className="lab-result-card">
                    <div>
                      <strong>{getService(lab.MaDichVu).TenDichVu}</strong>
                      <span>{formatMoney(lab.GiaCuoi)}</span>
                    </div>
                    <span className={`lab-status ${lab.TrangThaiXetNghiem === 'Đã có kết quả' ? 'done' : 'pending'}`}>
                      {lab.TrangThaiXetNghiem}
                    </span>
                    {lab.TrangThaiXetNghiem === 'Đã có kết quả' && (
                      <p>
                        {lab.KetQuaXetNghiem}
                        <br />
                        Xét nghiệm viên: {getLabTechnicianName(lab.MaXNV)}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className="health-detail-section">
              <div className="health-section-title">
                <span>Liệu trình điều trị chuyên sâu</span>
                <strong>{selectedTreatments.length} buổi</strong>
              </div>
              <div className="treatment-plan-list">
                {treatmentGroups.map((group) => {
                  const orderedSessions = [...group.sessions].sort((first, second) => first.BuoiSo - second.BuoiSo)
                  const completedCount = orderedSessions.filter((item) => item.TrangThai === 'Hoàn thành').length
                  const progressPercent = Math.round((completedCount / orderedSessions.length) * 100)

                  return (
                    <article key={group.MaDichVu} className="treatment-plan-card">
                      <div className="treatment-plan-head">
                        <div>
                          <strong>{getService(group.MaDichVu).TenDichVu}</strong>
                          <span>
                            Đã đi {completedCount} / {orderedSessions.length} buổi
                          </span>
                        </div>
                        <em>{progressPercent}%</em>
                      </div>
                      <div className="treatment-progress">
                        <span style={{ width: `${progressPercent}%` }} />
                      </div>
                      <div className="treatment-session-list">
                        {orderedSessions.map((session) => (
                          <div key={session.MaLichTrinh} className="treatment-session-row">
                            <div>
                              <strong>Buổi {session.BuoiSo}</strong>
                              <span>
                                {session.NgayThucHien || 'Chưa đặt'} {session.CaKham ? `- Ca ${session.CaKham}` : ''}
                              </span>
                            </div>
                            <span className={`treatment-status ${session.TrangThai === 'Hoàn thành' ? 'done' : session.TrangThai === 'Đã đặt lịch' ? 'booked' : 'pending'}`}>
                              {session.TrangThai}
                            </span>
                            {renderTreatmentBookingControl(session)}
                          </div>
                        ))}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </section>
    )
  }

  const renderTreatment = () => (
    <div className="patient-stack">
	      <section className="patient-card patient-profile-card">
	        <div className="patient-profile-header">
	          <div>
	            <h2>Thông tin hành chính cá nhân</h2>
	            <p>Quản lý thông tin định danh và cập nhật kênh liên hệ đang sử dụng.</p>
	          </div>
	          <div className="patient-profile-actions">
	            {!isEditingContact ? (
	              <button type="button" className="patient-secondary-button" onClick={handleStartEditContact}>
	                Cập nhật thông tin liên hệ
	              </button>
	            ) : (
	              <>
	                <button type="button" className="patient-primary-button" onClick={handleSaveContact}>
	                  Lưu thay đổi
	                </button>
	                <button type="button" className="patient-plain-button" onClick={handleCancelEditContact}>
	                  Hủy bỏ
	                </button>
	              </>
	            )}
	            <button
	              type="button"
	              className="patient-secondary-button"
	              onClick={() => setShowPasswordForm((current) => !current)}
	            >
	              Đổi mật khẩu
	            </button>
	          </div>
	        </div>

	        <div className="patient-profile-form-grid">
	          <label>
	            Họ tên
	            <input type="text" value={patient.HoTen} disabled />
	          </label>
	          <label>
	            Ngày sinh
	            <input type="date" value={patient.NgaySinh} disabled />
	          </label>
	          <label>
	            Số CCCD
	            <input type="text" value={patient.CCCD} disabled />
	          </label>
	          <label>
	            Mã số BHYT
	            <input type="text" value={patient.MaSoBHYT || 'Không sử dụng'} disabled />
	          </label>
	          <label>
	            Mức hưởng BHYT
	            <input type="text" value={`${Math.round(getBhytRate() * 100)}%`} disabled />
	          </label>
	          <label>
	            Số điện thoại
	            <input
	              type="tel"
	              value={contactForm.SDT}
	              disabled={!isEditingContact}
	              onChange={(event) => setContactForm((current) => ({ ...current, SDT: event.target.value }))}
	            />
	          </label>
	          <label className="patient-profile-address">
	            Địa chỉ
	            <input
	              type="text"
	              value={contactForm.DiaChi}
	              disabled={!isEditingContact}
	              onChange={(event) => setContactForm((current) => ({ ...current, DiaChi: event.target.value }))}
	            />
	          </label>
	        </div>

	        {showPasswordForm && (
	          <div className="patient-password-panel">
	            <label>
	              Mật khẩu hiện tại
	              <input
	                type="password"
	                value={passwordForm.currentPassword}
	                onChange={(event) => handlePasswordFormChange('currentPassword', event.target.value)}
	              />
	            </label>
	            <label>
	              Mật khẩu mới
	              <input
	                type="password"
	                value={passwordForm.newPassword}
	                onChange={(event) => handlePasswordFormChange('newPassword', event.target.value)}
	              />
	            </label>
	            <label>
	              Xác nhận mật khẩu mới
	              <input
	                type="password"
	                value={passwordForm.confirmPassword}
	                onChange={(event) => handlePasswordFormChange('confirmPassword', event.target.value)}
	              />
	            </label>
	            <div className="patient-password-actions">
	              <button type="button" className="patient-primary-button" onClick={handleConfirmPasswordChange}>
	                Xác nhận đổi mật khẩu
	              </button>
	              <button type="button" className="patient-plain-button" onClick={handleCancelPasswordChange}>
	                Hủy bỏ
	              </button>
	            </div>
	          </div>
	        )}
	      </section>

      {renderHealthRecordSection()}

    </div>
  )

  const navItems = [
    { key: 'booking', label: 'Đặt lịch khám mới', icon: '🏥' },
    { key: 'appointments', label: 'Lịch hẹn của tôi', icon: '📅' },
    { key: 'treatment', label: 'Lịch trình Điều trị & Sổ khám bệnh', icon: '📑' },
  ]

  const renderContent = () => {
    if (activeMenu === 'appointments') return renderMyBookings()
    if (activeMenu === 'treatment') return renderTreatment()
    return renderBooking()
  }

  return (
    <main className="patient-shell">
      <aside className="patient-sidebar">
        <div className="patient-brand">
          <img src={medicalLogoImage} alt="Medicare" />
          <div>
            <strong>Medicare</strong>
            <span>Cổng Bệnh nhân</span>
          </div>
        </div>
        <nav className="patient-nav">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`patient-nav-button ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <button type="button" className="patient-logout-button" onClick={onLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </aside>

      <section className="patient-content">
        <header className="patient-topbar">
          <div>
            <span>Xin chào</span>
            <h1>{patient.HoTen}</h1>
          </div>
          <p>BHYT: {patient.MaSoBHYT || 'Không sử dụng'} - Mức hưởng {Math.round(getBhytRate() * 100)}%</p>
        </header>
        {renderContent()}
      </section>
      {renderPaymentModal()}
    </main>
  )
}
