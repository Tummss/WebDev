import React, { useState } from 'react'
import { Link } from "react-router-dom";
import stylesLib from '../assets/css/Library.module.css'

function Library() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [categories, setCategories] = useState([])
    const [poster, setPoster] = useState(null)
    const [movieFile, setMovieFile] = useState(null);
    const API = process.env.REACT_APP_API

    const token = localStorage.getItem("token");





    const handleCategory = (e) => {
        const value = e.target.value

        if (categories.includes(value)) {
            setCategories(categories.filter(cat => cat !== value))
        } else {
            setCategories([...categories, value])
        }
    }






const handleSubmit = async (e) => {
    e.preventDefault();

    if (!poster) return alert("Select poster");
    if (!movieFile) return alert("Select movie file");

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    try {

        // build form data (IMPORTANT for file upload)
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("genre", JSON.stringify(categories));

        // files
        formData.append("poster", poster);      // raw file (NOT base64)
        formData.append("movie", movieFile);    // raw video file

        const res = await fetch(`${API}/upload`, {
             method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log(data);

        alert("Upload successful!");

        // reset
        setName("");
        setDescription("");
        setCategories([]);
        setPoster(null);
        setMovieFile(null);
        

    } catch (err) {
        console.error(err);
        alert("Upload failed");
    }
};



    return (
        <div className={stylesLib.Body}>

            <div className={stylesLib.header}>
                <Link to="/main">
                    <i className={`${stylesLib.back} fi fi-rr-arrow-small-left`}></i>
                </Link>

                <h2>Admin Panel</h2>
            </div>

            <div className={stylesLib.Main}>

                <div className={stylesLib.topText}>
                    <h1>Add New Movie</h1>
                    <p>Upload movie info</p>
                </div>

                <form
                    className={stylesLib.form}
                    onSubmit={handleSubmit}
                >

                    <div className={stylesLib.inputGroup}>
                        <label>Movie Name</label>
                        <input
                            type="text"
                            placeholder="Enter movie name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>



                    <div className={stylesLib.inputGroup}>
                        <label>Description</label>
                        <textarea
                            placeholder="Write movie description..."
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>



                    <div className={stylesLib.inputGroup}>
                        <label>Categories</label>
                        <select
                            onChange={handleCategory}
                            className={stylesLib.select}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select category
                            </option>

                            <option value="Action">Action</option>
                            <option value="Anime">Anime</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Drama">Drama</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                        </select>



                        <div className={stylesLib.categoryBox}>
                            {categories.map((cat, i) => (
                                <span
                                    key={i}
                                    className={stylesLib.categoryTag}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>



                    <div className={stylesLib.uploadSection}>
                        <div className={stylesLib.uploadBox}>
                            <label>Movie Poster</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                setPoster(e.target.files[0])} />
                        </div>
                        <div className={stylesLib.uploadBox}>
                            <label>Movie File</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setMovieFile(e.target.files[0])}/>
                        </div>
                    </div>



                    <button type="submit" className={stylesLib.addBtn}>
                        Upload Movie
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Library
