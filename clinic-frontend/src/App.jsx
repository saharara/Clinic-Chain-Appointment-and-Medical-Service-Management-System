import { useState } from 'react'
import { Lock, Mail, Phone, UserRound } from 'lucide-react'
import medicalLogoImage from './assets/medical-logo-cutout.png'
import medicalTeamImage from './assets/medical-team-cutout.png'
import './App.css'

function InputField({ label, placeholder, icon, type = 'text' }) {
  const Icon = icon

  return (
    <label className="field-group">
      <span className="field-label">{label}</span>
      <span className="input-shell">
        <Icon size={18} />
        <input type={type} placeholder={placeholder} />
      </span>
    </label>
  )
}

export default function App() {
  const [mode, setMode] = useState('login')
  const isRegister = mode === 'register'

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
                className={`tab-button ${!isRegister ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={`tab-button ${isRegister ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Đăng ký
              </button>
            </div>

            <div className="form-copy">
              <h1>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</h1>
              <p>
                {isRegister
                  ? 'Điền thông tin để tạo tài khoản mới cho hệ thống.'
                  : 'Chào mừng bạn quay lại hệ thống chăm sóc sức khỏe.'}
              </p>
            </div>

            <form className="auth-form">
              {isRegister && (
                <InputField
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  icon={UserRound}
                />
              )}

              <InputField
                label={isRegister ? 'Số điện thoại hoặc email' : 'Email hoặc tên đăng nhập'}
                placeholder={
                  isRegister
                    ? 'Nhập số điện thoại hoặc email'
                    : 'Nhập email hoặc tên đăng nhập'
                }
                icon={isRegister ? Phone : Mail}
              />

              <InputField
                label="Mật khẩu"
                placeholder={isRegister ? 'Tạo mật khẩu' : 'Nhập mật khẩu'}
                icon={Lock}
                type="password"
              />

              {isRegister && (
                <InputField
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  icon={Lock}
                  type="password"
                />
              )}

              {!isRegister && (
                <div className="form-meta">
                  <button type="button" className="text-link">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <button type="submit" className="submit-button">
                {isRegister ? 'Đăng ký' : 'Đăng nhập'}
              </button>

              <p className="switch-text">
                {isRegister ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?'}
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setMode(isRegister ? 'login' : 'register')}
                >
                  {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                </button>
              </p>
            </form>
          </div>

          <div className="visual-panel" aria-hidden="true">
            <div className="visual-card">
              <div className="wave-shape" />
              <div className="visual-content">
                <img
                  className="visual-image"
                  src={medicalTeamImage}
                  alt="Đội ngũ y tế phòng khám"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
