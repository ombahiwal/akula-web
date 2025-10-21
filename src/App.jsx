// import { useState } from 'react'
import './App.css'
import GridLayout from './components/GridLayout.jsx'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
function App() {


  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<GridLayout />} />
      {/* add more routes here later */}
    </Routes>
  )
}

export default App
