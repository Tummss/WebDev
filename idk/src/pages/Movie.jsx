import React, { useEffect} from 'react'
import { Link, useParams } from "react-router-dom";
import styleMovie from '../assets/css/Movie.module.css'



function Movie() {
const token = localStorage.getItem("token");
const API = process.env.REACT_APP_API;


useEffect(() => {
    if (!token) window.location.href = "/";
}, [token]);



const { id } = useParams();
  return (
  <>
  <div className={styleMovie.Body}>
    <div className={styleMovie.Header}>
        <Link to="/main"><i className={ `${styleMovie.back} fi fi-rr-arrow-small-left` }></i></Link>
        <p>Movie streaming website</p>
    </div>
    <div className={styleMovie.Video}>
      <video controls autoPlay className={styleMovie.VideoPlayer} >
          <source src={`${API}/files/${id}`} type="video/mp4" />
      </video>
    </div>
  </div>

</>
  )
}

export default Movie