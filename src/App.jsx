// import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import TeamPage from './pages/TeamPage.jsx'
import BlogsPage from './pages/BlogsPage.jsx'
import BlogPost from './pages/BlogPost.jsx'
import EventPost from './pages/EventPost.jsx'

function App() {


  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage/>} />
      <Route path="/events/:id" element={<EventPost/>} />
      <Route path="/board" element={<TeamPage/>} />
      <Route path="/blog" element={<BlogsPage/>} />
      <Route path="/blog/:id" element={<BlogPost/>} />
      {/* add more routes here later */}
    </Routes>
  )
}

export default App
