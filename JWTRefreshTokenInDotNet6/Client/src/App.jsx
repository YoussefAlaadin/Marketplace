import { Routes, Route, Router } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import VendorDashboard from './pages/vendor/VendorDashboard'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} ></Route>
      <Route path='/register' element={<Register />} ></Route>
      <Route path='/vendor' element={<VendorDashboard />} ></Route>
    </Routes>
  )
}

export default App
