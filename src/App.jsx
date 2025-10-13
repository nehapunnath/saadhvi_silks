import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

import Home from './Pages/Home'
import Header from './Components/Header'
import Footer from './Components/Footer'
import About from './Pages/About'
import ContactUs from './Pages/ContactUs'
import Products from './Pages/Products'
import ViewDetails from './Pages/ViewDetails'
import Cart from './Pages/Cart'
import Wishlist from './Pages/Wishlist'
import Login from './Pages/Login'
import AdminDash from './Pages/Admin/AdminDash'
import AdminProducts from './Pages/Admin/AdminProducts'
import AddProducts from './Pages/Admin/AddProducts'
import EditProducts from './Pages/Admin/EditProducts'
import ViewProducts from './Pages/Admin/ViewProducts'
import Orders from './Pages/Admin/Orders'
import ViewOrder from './Pages/Admin/ViewOrder'
import Gallery from './Pages/Admin/Gallery'
import Offers from './Pages/Admin/Offers'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation()

  const hideHeaderFooter = ['/login','/admin/dash','/admin/products','/admin/addproducts','/admin/editproducts' ,'/admin/viewproducts','/admin/orders','/admin/vieworders','/admin/gallery','/admin/offers'].includes(location.pathname)

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/products' element={<Products />} />
        <Route path='/viewdetails' element={<ViewDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/dash' element={<AdminDash />} />
        <Route path='/admin/products' element={<AdminProducts />} />
        <Route path='/admin/addproducts' element={<AddProducts />} />
        <Route path='/admin/editproducts' element={<EditProducts />} />
        <Route path='/admin/viewproducts' element={<ViewProducts />} />
        <Route path='/admin/orders' element={<Orders />} />
        <Route path='/admin/vieworders' element={<ViewOrder/>} />
        <Route path='/admin/gallery' element={<Gallery/>} />
        <Route path='/admin/offers' element={<Offers/>} />









      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  )
}

export default App
