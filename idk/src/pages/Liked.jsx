import React, { useEffect} from 'react'
import { Link } from "react-router-dom";
import stylesLike from '../assets/css/Liked.module.css'


function Liked() {


    const token = localStorage.getItem("token");
  useEffect(() => {
    
    if (!token) {
      window.location.href = "/";
    }
  }, []);




  return (
<>
  <div className={stylesLike.Body}>
    <div className={stylesLike.TopBar}>
        <Link to="/main"><i className={ `${stylesLike.back} fi fi-rr-arrow-small-left` }></i></Link>
        <h2>Liked Movies</h2>
    </div>
    <div className={stylesLike.MoviesGrid}>
        <div className={stylesLike.MovieBox}><p>Movie 1</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 2</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 3</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 4</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 5</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 6</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 7</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 8</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 9</p></div>
        <div className={stylesLike.MovieBox}><p>Movie 10</p></div>
    </div>

  </div>


</>
  )
}

export default Liked