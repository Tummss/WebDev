import React from 'react'
import MainPage from './pages/MainPage'
import Movie from './pages/Movie'
import Liked from './pages/Liked'
import Library from './pages/Library'
import Login from './pages/Login'
import Description from './pages/Description'
import Signup from './pages/Signup'
import { useEffect } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App() {

  useEffect(() => {
    fetch('http://localhost:5000/files')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/main' element={<MainPage />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path='/liked' element={<Liked />} />
        <Route path='/library' element={<Library />} />
        <Route path='/description/:id' element={<Description />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App