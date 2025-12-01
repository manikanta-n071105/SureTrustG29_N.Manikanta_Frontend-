
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Resetpassword from './pages/Resetpassword'
import Notificationpage from './pages/Notificationpage'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import Error from './pages/Error'
import Navbar from './components/Navbar'
function App() {

  return (
    <>
  <BrowserRouter>
  <Navbar/>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/resetpassword" element={<Resetpassword />} />
  <Route path="/notification" element={<Notificationpage />} />
  <Route path="/friends" element={<Friends />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="*" element={<Error />} />
</Routes>
  </BrowserRouter>
  
     </>
  )
}

export default App
