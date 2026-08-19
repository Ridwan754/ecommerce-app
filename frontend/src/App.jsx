import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import io from 'socket.io-client'
import './i18n'

const socket = io('http://127.0.0.1:5000')

function App() {
  const { t, i18n } = useTranslation()
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState([])
  
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
    const res = await axios.get('http://127.0.0.1:5000/products')
    setProducts(res.data)
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
    socket.emit('send_message', { room: chatRoom, sender_id: user.id, content: chatMsg })
    setChatMsg('')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {/* HEADER & MULTI-BAHASA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h2>{t('title')}</h2>
        <div>
          <button onClick={() => i18n.changeLanguage('id')}>ID</button>
          <button onClick={() => i18n.changeLanguage('en')}>EN</button>
        </div>
      </div>

      {message && <div style={{ background: '#ffeb3b', padding: '10px', margin: '10px 0' }}>{message}</div>}

      {/* LOGIN & STATUS */}
      {!user ? (
        <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: '20px 0' }}>
          <h3>Login</h3>
          <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%', marginBottom:10}} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', marginBottom:10}} />
          <button type="submit">Masuk</button>
        </form>
      ) : (
        <div>
          <p>Logged as: <strong>{user.username}</strong> ({user.role}) | <button onClick={()=>setUser(null)}>Logout</button></p>

          {/* ROLE ADMIN: MEMBUAT SELLER / BUYER */}
          {user.role === 'admin' && (
            <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
              <h4>{t('admin_panel')}</h4>
              <form onSubmit={handleAdminCreate}>
                <input type="text" placeholder="New Username" onChange={e=>setNewUsername(e.target.value)} />
                <input type="password" placeholder="New Password" onChange={e=>setNewPassword(e.target.value)} />
                <select onChange={e=>setNewRole(e.target.value)}>
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                </select>
                <button type="submit">Buat User</button>
              </form>
            </div>
          )}

          {/* ROLE SELLER: TAMBAH BARANG */}
          {user.role === 'seller' && (
            <div style={{ border: '1px solid green', padding: '10px', margin: '10px 0' }}>
              <h4>{t('add_product')}</h4>
              <form onSubmit={handleAddProduct}>
                <input type="text" placeholder="Nama Barang" onChange={e=>setPName(e.target.value)} required />
                <input type="number" placeholder="Harga" onChange={e=>setPPrice(e.target.value)} required />
                <input type="number" placeholder="Stok" value={pStock} onChange={e=>setPStock(e.target.value)} required />
                <button type="submit">Rilis Barang</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* KATALOG BARANG & PROSES CHECKOUT */}
      <h3>Katalog Barang</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            <h4>{p.name}</h4>
            <p>Harga: Rp {p.price}</p>
            <p>{t('stock')}: {p.stock}</p>
            {user && user.role === 'buyer' && (
              <div>
                {p.stock > 0 ? (
                  <div>
                    <button onClick={()=>handleCheckout(p.id, 'GATEWAY')}>Bayar Gateway</button>
                    <button onClick={()=>handleCheckout(p.id, 'COD')}>Bayar COD</button>
                    <button onClick={()=>handleCheckout(p.id, 'MANUAL_TF')}>Transfer Direct</button>
                  </div>
                ) : <span style={{color:'red'}}>{t('out_of_stock')}</span>}
                <br/>
                <button onClick={()=>joinChat(p.seller_id)} style={{marginTop: '5px'}}>{t('chat')}</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* REALTIME CHAT */}
      {chatRoom && (
        <div style={{ border: '1px solid blue', padding: '10px', marginTop: '20px', width: '300px' }}>
          <h4>Realtime Chat Room</h4>
          <div style={{ height: '100px', overflowY: 'scroll', background: '#f9f9f9', padding: '5px' }}>
            {chatLogs.map((c, i) => <div key={i}><b>User {c.sender_id}:</b> {c.content}</div>)}
          </div>
          <input type="text" value={chatMsg} onChange={e=>setChatMsg(e.target.value)} />
          <button onClick={sendChat}>Kirim</button>
        </div>
      )}
    </div>
  )
}

export default App