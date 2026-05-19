import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from '../assets/css/Description.module.css'
import backdrop from '../assets/img/backdrop.webp'

function Description() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)


    const token = localStorage.getItem("token");


    const [comments, setComments] = useState([]);


    const [text, setText] = useState("")
    const [rating, setRating] = useState(5)


    useEffect(() => {
        fetch(`http://localhost:5000/movies/${id}`)
            .then(res => res.json())
            .then(setMovie);

        fetch(`http://localhost:5000/comments/${id}`)
            .then(res => res.json())
            .then(setComments);

        if (!token) {
            window.location.href = "/";
        }
    }, [id]);



    const Comment = async () => {
    if (!text.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            MovieId: id,
            Comment: text,
            ReviewStar: rating,
            UserId: user.id   // UUID
        })
    });

    const data = await res.json();

    if (data.success) {
        setComments([...comments, data.comment]);
        setText("");
        setRating(5);
    }
};
if (!movie) return <div>Loading...</div>;
    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <img src={backdrop} className={styles.bg} alt="banner" />
                <div className={styles.fade}></div>

                <div className={styles.info}>
                    <h1 className={styles.title}>{movie.name}</h1>

                    <p className={styles.Desc}>{movie.description}</p>

                    <div className={styles.buttons}>
                        <Link to={`/movie/${movie.movieId}`}>
                            <button className={styles.play}>▶ Play</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.Section}>
                <h2>User Reviews</h2>

                <div className={styles.commentSection}>
                    <input value={text}  onChange={(e) => setText(e.target.value)} placeholder="How was the movie"/>
                    { }
                    <div className={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} onClick={() => setRating(i)} className={styles.Star}>
                                {i <= rating ? "★" : "☆"}
                            </span>
                        ))}
                    </div>
                    <button onClick={Comment}>Comment</button>
                </div>

                <div className={styles.comments}>
                    {comments.map((c, i) => (
                        <div key={i} className={styles.commentCard}>
                            <strong>{c.Username}</strong>
                            <p>{c.Comment}</p>
                            <span> ★ {Number(c.ReviewStar).toFixed(1)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Description