const express = require('express');
const app = express();
const PORT = 5000;
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const stream = require("stream");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");







const JWT_SECRET = "super_secret_key";

app.use(cors());


//idfk this do (seems to be working without it)
const corsOptions = {
  origin: 'http://localhost:3000', 
}




app.use(cors(corsOptions));




//limit the size of files coming through the api
app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ limit: "40mb", extended: true }));

app.use((req, res, next) => {
  if (req.method !== "POST") return next();
  next();
});











//googledrive authetication or sum bs
const { google } = require('googleapis');
const CLIENT_ID = '595634120248-gtt3nhg5unkfv4bglnivde0i5us1b261.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04eOYesuGv7sKCgYIARAAGAQSNwF-L9IrQOPWVXFjvySpINr8YwTbdysFn266gd1mgXA5TqC4QiA7EKiHd2JWWRzjsLMt1r6EP1Q';

//set the variables up (idfk)
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });



//mongodb authetication or sum bs
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri_Mongo = "mongodb+srv://Tartaglia:Tartaglia89893088@cluster0.s3fwig5.mongodb.net/";

const client = new MongoClient(uri_Mongo, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let db;








//________________________________________________Multer store to disk______________________________________________________//
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
//rather than RAM storage to upload 2Gb of shit i store to disk so my server dont commit KMS
const upload = multer({
  storage: storage,
});









//____________________________________________________MONGODB FUNTIONS_________________________________________________//
async function connectMongoDB() {
  try {
    await client.connect();
    db = client.db("Streaming");

    console.log("MongoDB connected");

    await showMovies();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}



async function showMovies() {

  const movies = await db.collection("MyMovies").find().toArray()

  console.log("Movies in MongoDB:")

  movies.forEach((movie, i) => {

    console.log(`\n#${i + 1}`)
    console.log("Name:", movie.name)
    console.log("Genre:", movie.genre)
    console.log("Description:", movie.description)
    console.log("Movie ID:", movie.movieId)

  })
}









// ___________________________________________________GOOGLE DRIVE FUNCTIONSS_________________________________________________//
async function getFiles() {
  const res = await drive.files.list({
    pageSize: 100,
    fields: 'files(id, name, mimeType)',
    q: "'root' in parents and (mimeType='image/png' or mimeType='image/jpeg' or mimeType='video/mp4')"
  });
  return res.data.files || [];
}

async function listFiles() {
    try {
        const res = await drive.files.list({
            pageSize: 100,         
            fields: 'files(id, name, mimeType)',
            q: "'root' in parents"  //main folder shit
        });

        const files = res.data.files;
        if (!files || files.length === 0) {
            console.log('No files found in My Drive.');
            return;
        }

        console.log('Files in My Drive:');
        files.forEach(file => {
            console.log(`Name: ${file.name}, ID: ${file.id}, Type: ${file.mimeType}`);
        });
    } catch (err) {
        console.error('Error listing files:', err.message);
    }
}

async function makeAllPublic() {
  const files = await getFiles();

  for (const file of files) {
    try {
      await drive.permissions.create({
        fileId: file.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
        } catch (err) {
          console.error(`Error making file ${file.name} public:`, err.message);
        }
      }
}




async function uploadToDrive(file) {
  if (!file) {
    throw new Error("Invalid file received");
  }

  const fileStream = fs.createReadStream(file.path);

  try {
    const res = await drive.files.create({
      requestBody: {
        name: file.originalname,
      },
      media: {
        mimeType: file.mimetype,
        body: fileStream,
      },
      fields: "id",
    });

    return res.data.id;
  } catch (err) {
    console.error("Drive upload failed:", err.message);
    throw err;
  }
}












//____________________________________________________API___________________________________________________________________
app.get('/files', async (req, res) => {
  const files = await getFiles();
  res.json(files);
});


app.get('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    const meta = await drive.files.get({
      fileId,
      fields: 'size, mimeType'
    });

    const fileSize = Number(meta.data.size);
    const range = req.headers.range;

    res.setHeader('Content-Type', meta.data.mimeType);
    res.setHeader('Accept-Ranges', 'bytes');

    if (!range) {
      // full stream
      const file = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );
      
      return file.data.pipe(res);
    }
    // RANGE request (this enables fast forward)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;

    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', chunkSize);

    const file = await drive.files.get(
      {
        fileId,
        alt: 'media',
        headers: {
          Range: `bytes=${start}-${end}`
        }
      },
      { responseType: 'stream' }
    );

    file.data.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Video stream error");
  }
});









app.get('/movies', async (req, res) => {
  try {
    const movies = await db.collection("MyMovies").find().toArray();
    res.json(movies);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/movies/:movieId", async (req, res) => {
  const movie = await db.collection("MyMovies").findOne({
    movieId: req.params.movieId,
  });

  res.json(movie);
});







app.post("/upload", upload.fields([{ name: "poster", maxCount: 1 },{ name: "movie", maxCount: 1 },]), async (req, res) => {
    try {
      const { name, description } = req.body;
      const genre =
        typeof req.body.genre === "string"
          ? JSON.parse(req.body.genre)
          : req.body.genre;

      const posterFile = req.files?.poster?.[0];
      const movieFile = req.files?.movie?.[0];

      if (!posterFile || !movieFile) {
        return res.status(400).send("Missing files");
      }

      // 1. upload video to Google Drive
      const movieId = await uploadToDrive(movieFile);

      // 2. convert poster to base64
      const posterBase64 = fs.readFileSync(posterFile.path, "base64");

      // 3. save to MongoDB
      const result = await db.collection("MyMovies").insertOne({
        name,
        description,
        genre,
        movieId,
        poster: posterBase64,
        createdAt: new Date(),
      });

      // 4. delete temp files (IMPORTANT)
      fs.unlink(posterFile.path, () => {});
      fs.unlink(movieFile.path, () => {});

      // 5. respond ONCE
      res.json({
        success: true,
        id: result.insertedId,
        movieId,
      });

    } catch (err) {
      console.error(err);
      res.status(500).send("Upload failed");
    }
  }
);


app.use("/upload", (req, res) => {
    const size = req.headers["content-length"];
    console.log(`Incoming video file with byte size:`, size);
 
});









//________________________________________________________________________________LOGIN/SIGNUP_______________________________________________________________________//
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await db.collection("UserData").findOne({
      Username: username
    });

    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    const newUser = {
      UserId: uuidv4(),
      Username: username,
      Password: password
    };

    const result = await db.collection("UserData").insertOne(newUser);

    res.json({
      success: true,
      id: result.insertedId,
      userId: newUser.UserId 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});






app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.collection("UserData").findOne({
    Username: username
  });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (user.Password !== password) {
    return res.json({ success: false, message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user.UserId, username: user.Username }, 
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.UserId, 
      username: user.Username
    }
  });
});












//______________________________________________________________________________COMMENTS_____________________________________________________________________//
app.get("/comments/:movieId", async (req, res) => {
  try {
    const comments = await db.collection("Comments")
      .find({ MovieId: req.params.movieId })
      .toArray();

    const enriched = await Promise.all(
      comments.map(async (c) => {
        const user = await db.collection("UserData").findOne({
          UserId: c.UserId
        });

        return {
          ...c,
          Username: user ? user.Username : "Unknown"
        };
      })
    );

    res.json(enriched);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


//_____________________________________________________________________________POST COMMENT________________________________________________________________________//
app.post("/comments", async (req, res) => {
  try {
    const { MovieId, Comment, ReviewStar, UserId } = req.body;

    const newComment = {
      UserId,
      CommentId: uuidv4(),
      MovieId,
      Comment,
      ReviewStar
    };

    await db.collection("Comments").insertOne(newComment);

    res.json({
      success: true,
      comment: newComment
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});



connectMongoDB();
makeAllPublic();
listFiles();


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
