import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import io from 'socket.io-client'
import { GoogleLogin } from '@react-oauth/google'
import './i18n'
import './App.css'

const socket = io('http://127.0.0.1:5000')

function App() {
  const { t, i18n } = useTranslation()
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState([])
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  
  // State Seller Form
  const [pName, setPName] = useState('')
  const [pPrice, setPPrice] = useState('')
  const [pStock, setPStock] = useState('1')

  // State Admin Form
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('seller')

  // State Chat
  const [chatRoom, setChatRoom] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [chatLogs, setChatLogs] = useState([])

  useEffect(() => {
    fetchProducts()
    socket.on('receive_message', (data) => {
      setChatLogs(prev => [...prev, data])
    })
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', { username, password })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      setMessage('Login Berhasil!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal Login')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://127.0.0.1:5000/register', { username, password, role })
      setMessage(res.data.message)
      setIsRegisterMode(false)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal Mendaftar')
    }
  }

  // Handler Google OAuth Login / Register
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/google-login', {
        credential: credentialResponse.credential,
        role: role
      })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      setMessage('Login Google Berhasil!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal Login via Google')
    }
  }

  const handleAdminCreate = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('http://127.0.0.1:5000/admin/create-user', 
        { username: newUsername, password: newPassword, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal buat user')
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://127.0.0.1:5000/products', 
        { name: pName, price: pPrice, stock: pStock },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Produk berhasil ditambahkan!')
      fetchProducts()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal')
    }
  }

  const handleCheckout = async (productId, method) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('http://127.0.0.1:5000/checkout',
        { product_id: productId, payment_method: method },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message)
      fetchProducts()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Checkout gagal')
    }
  }

  const joinChat = (sellerId) => {
    const room = `chat_${user.id}_${sellerId}`
    setChatRoom(room)
    socket.emit('join', { room })
  }

  const sendChat = () => {
    if (!chatMsg) return
    socket.emit('send_message', { room: chatRoom, sender_id: user.id, content: chatMsg })
    setChatMsg('')
  }

  return (
    <div className="container">
      {/* NAVBAR */}
      <div className="navbar">
        <h2>🛒 {t('title')}</h2>
        <div>
          <button className={`lang-btn ${i18n.language === 'id' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('id')}>ID</button>
          <button className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('en')}>EN</button>
        </div>
      </div>

      {/* ALERT BANNER */}
      {message && <div className="alert-banner">🔔 {message}</div>}

      {/* FORM AUTHENTICATION CARD */}
      {!user ? (
        <div className="card">
          {!isRegisterMode ? (
            <div>
              <h3>Masuk ke Akun Anda</h3>
              <form onSubmit={handleLogin} className="form-group">
                <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                <button type="submit" className="btn-primary">Masuk</button>
              </form>
              
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Atau masuk dengan:</p>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setMessage('Google Login Gagal')}
                />
              </div>

              <p style={{ marginTop: '15px', fontSize: '14px' }}>
                Belum punya akun? <span style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsRegisterMode(true)}>Daftar Sekarang</span>
              </p>
            </div>
          ) : (
            <div>
              <h3>Daftar Akun Baru</h3>
              <form onSubmit={handleRegister} className="form-group">
                <input type="text" placeholder="Username Baru" onChange={e=>setUsername(e.target.value)} required />
                <input type="password" placeholder="Password Baru" onChange={e=>setPassword(e.target.value)} required />
                <select value={role} onChange={e=>setRole(e.target.value)}>
                  <option value="buyer">Buyer (Pembeli)</option>
                  <option value="seller">Seller (Penjual)</option>
                </select>
                <button type="submit" className="btn-success">Daftar Akun</button>
              </form>

              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Atau daftar cepat dengan:</p>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setMessage('Google Register Gagal')}
                />
              </div>

              <p style={{ marginTop: '15px', fontSize: '14px' }}>
                Sudah punya akun? <span style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsRegisterMode(false)}>Login di sini</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            Selamat datang, <strong>{user.username}</strong> <span style={{ background: '#e9ecef', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>{user.role.toUpperCase()}</span>
          </div>
          <button onClick={() => setUser(null)} className="btn-outline">Logout</button>
        </div>
      )}

      {/* ROLE ADMIN PANEL */}
      {user && user.role === 'admin' && (
        <div className="card">
          <h3>👑 {t('admin_panel')}</h3>
          <form onSubmit={handleAdminCreate} className="form-group" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Username" onChange={e=>setNewUsername(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={e=>setNewPassword(e.target.value)} required />
            <select onChange={e=>setNewRole(e.target.value)}>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
            <button type="submit" className="btn-primary">Buat Akun</button>
          </form>
        </div>
      )}

      {/* ROLE SELLER PANEL */}
      {user && user.role === 'seller' && (
        <div className="card">
          <h3>📦 {t('add_product')}</h3>
          <form onSubmit={handleAddProduct} className="form-group" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Nama Barang" onChange={e=>setPName(e.target.value)} required />
            <input type="number" placeholder="Harga (Rp)" onChange={e=>setPPrice(e.target.value)} required />
            <input type="number" placeholder="Stok" value={pStock} onChange={e=>setPStock(e.target.value)} required />
            <button type="submit" className="btn-success">Rilis Produk</button>
          </form>
        </div>
      )}

      {/* KATALOG PRODUK */}
      <div className="card">
        <h3>🛍️ Katalog Produk</h3>
        <div className="product-grid">
          {products.length === 0 ? <p style={{ color: '#999' }}>Belum ada produk yang dijual.</p> : (
            products.map(p => (
              <div key={p.id} className="product-card">
                <div>
                  <div className="product-title">{p.name}</div>
                  <div className="product-price">Rp {p.price.toLocaleString()}</div>
                  <div className="product-stock">{t('stock')}: <strong>{p.stock}</strong></div>
                </div>

                {user && user.role === 'buyer' && (
                  <div>
                    {p.stock > 0 ? (
                      <div className="payment-buttons">
                        <button className="btn-pay" onClick={()=>handleCheckout(p.id, 'GATEWAY')}>💳 Payment Gateway</button>
                        <button className="btn-pay" onClick={()=>handleCheckout(p.id, 'COD')}>🚚 Bayar COD</button>
                        <button className="btn-pay" onClick={()=>handleCheckout(p.id, 'MANUAL_TF')}>🏦 Transfer Direct</button>
                      </div>
                    ) : (
                      <div style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '13px', margin: '10px 0' }}>{t('out_of_stock')}</div>
                    )}
                    <button onClick={()=>joinChat(p.seller_id)} style={{ width: '100%', marginTop: '8px', padding: '6px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      💬 {t('chat')}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* REALTIME CHAT WIDGET */}
      {chatRoom && (
        <div className="chat-box">
          <div className="chat-header">💬 Live Chat Seller</div>
          <div className="chat-messages">
            {chatLogs.map((c, i) => (
              <div key={i} style={{ marginBottom: '8px', fontSize: '13px' }}>
                <strong>User {c.sender_id}:</strong> {c.content}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Tulis pesan..." value={chatMsg} onChange={e=>setChatMsg(e.target.value)} />
            <button onClick={sendChat}>Kirim</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App