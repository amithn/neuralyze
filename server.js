const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');


const upload = multer(); // memory storage

// Middleware to parse URL-encoded form data (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON (in case you need it)
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for SPA routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/classify', upload.single('file'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
