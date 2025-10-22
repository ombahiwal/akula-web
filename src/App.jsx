// import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import EventsPage from './pages/EventsPage.jsx'
function App() {


  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage/>} />
      {/* add more routes here later */}
    </Routes>
  )
}

export default App
