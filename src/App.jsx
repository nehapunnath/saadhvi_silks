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
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation()

  // const location = useLocation();

  // Hide Header & Footer for login and all admin routes
  const hideHeaderFooter =
    location.pathname === '/login' || location.pathname.startsWith('/admin');


  return (
    <>
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/products' element={<Products />} />
        <Route path='/viewdetails/:id' element={<ViewDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/admin/dash' element={<AdminDash />} /> */}
        <Route path='/admin/products' element={<AdminProducts />} />
        <Route path='/admin/addproducts' element={<AddProducts />} />
        <Route path='/admin/editproducts/:id' element={<EditProducts />} />
        <Route path='/admin/viewproducts/:id' element={<ViewProducts />} />
        <Route path='/admin/orders' element={<Orders />} />
        <Route path='/admin/vieworders' element={<ViewOrder />} />
        <Route path='/admin/gallery' element={<Gallery />} />
        <Route path='/admin/offers' element={<Offers />} />









      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          // style: {
          //   background: '#6B2D2D',
          //   color: '#fff',
          //   fontSize: '14px',
          // },
        }}
      />
      {!hideHeaderFooter && <Footer />}
    </>
  )
}

export default App
