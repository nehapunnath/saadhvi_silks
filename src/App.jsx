import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Header from './Components/Header'
import Footer from './Components/Footer'
import About from './Pages/About'
import ContactUS from './Pages/ContactUs'
import Products from './Pages/Products'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<ContactUS/>}/>
      <Route path='/products' element={<Products/>}/>



    </Routes>
    <Footer/>
      
    </>
  )
}

export default App
