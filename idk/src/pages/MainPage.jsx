import React, { useEffect, useState } from 'react'
import styles from '../assets/css/Main.module.css'
import { Link } from 'react-router-dom'

import backdrop from '../assets/img/backdrop.webp'

    function Main_Page() {
        const [files, setFiles] = useState([])
        const user = JSON.parse(localStorage.getItem("user"));     //define the user token
        const token = localStorage.getItem("token");


    useEffect(() => {
        fetch('http://localhost:5000/movies')
        .then(res => res.json())
        .then(data => setFiles(data))
        .catch(err => console.error(err))

        if (!token) {                       //if you didnt login head back to login page
            window.location.href = "/";
        }
    }, [])

    return (
        <div className={styles.container}>

            <aside className={styles.sidebar}>
                <h2>MovieWebsite</h2>

                <nav>
                    <div className={styles.Home} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</div>
                    <Link to="/library">Add Movies</Link>
                    {/* <Link to="/liked">Liked</Link> */}
                    {user ? 
                    (<div
                        className={styles.Login}
                        onClick={() => {localStorage.removeItem("token"); 
                            localStorage.removeItem("user"); 
                            window.location.href = "/";}}>
                            {user.username}
                            </div>) : (
                    <Link to="/" className={styles.Login}>
                        Login
                    </Link>
                    )}
                </nav>
            </aside>


            <div className={styles.Content}>
                <div className={styles.Banner}>
                    <img src={backdrop} alt="banner" />
                    <div className={styles.overlay}></div>
                    <div className={styles.BannerContent}>
                        <h1>Movie Streaming Website</h1>
                        <p>Cool movies.</p>
                        <div className={styles.BannerButtons}>
                            <Link to={`/movie/1nM687Ag_Mk6s1JqbAyL75J8aAwwPJG-3`} className={styles.Button}>
                                Watch Now
                            </Link>
                        </div>
                    </div>
                </div>


                <div className={styles.MovieSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Trending</h2>
                    </div>
                    <div className={styles.movieRow}>
                        {files.map(movie => (
                            <Link key={movie._id} to={`/description/${movie.movieId}`} className={styles.Card}>
                                <div className={styles.posterWrapper}>
                                    <img src={`data:image/jpeg;base64,${movie.poster}`} alt={movie.name}/>
                                </div>
                                <div className={styles.cardInfo}>
                                    <h3>{movie.name}</h3>
                                    <p>★ 4.8</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>


                <div className={styles.MovieSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Action</h2>
                    </div>
                    <div className={styles.movieRow}>
                        {files.map(movie => (
                            <Link key={movie._id} to={`/description/${movie.movieId}`} className={styles.Card}>
                                <div className={styles.posterWrapper}>
                                    <img src={`data:image/jpeg;base64,${movie.poster}`} alt={movie.name}/>
                                </div>
                                <div className={styles.cardInfo}>
                                    <h3>{movie.name}</h3>
                                    <p>★ 4.8</p>
                                </div>
                            </Link>
                        ))}

                    </div>
                </div>
                <div className={styles.MovieSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Anime</h2>
                    </div>
                    <div className={styles.movieRow}>
                        {files.map(movie => (
                            <Link key={movie._id} to={`/description/${movie.movieId}`} className={styles.Card}>
                                <div className={styles.posterWrapper}>
                                    <img src={`data:image/jpeg;base64,${movie.poster}`} alt={movie.name}/>
                                </div>
                                <div className={styles.cardInfo}>
                                    <h3>{movie.name}</h3>
                                    <p>★ 4.8</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className={styles.Footer}>
                    <p>Stuff</p>
                </div>
            </div>

        </div>
    )
}

export default Main_Page