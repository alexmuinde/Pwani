import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Header from './components/Header'
import TruckBookingReport from './pages/TruckBookingReport'
import TruckBookingList from './pages/TruckBookingList'
import TruckDocument from './pages/TruckDocument'


export default function App() {
  return <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/truckBookingReport/:id?' element={<TruckBookingReport />} />
      <Route path='/truckBookingList/:id?' element={<TruckBookingList />} />
      <Route path='/truckDocument/:id?' element={<TruckDocument />} />
    </Routes>
  </BrowserRouter>
}
