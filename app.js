const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define the correct path to the auto_modules JSON file
const filePath = '/var/ood/auto_modules/my_cluster.json';

// Function to get the last modified timestamp
function getLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return new Date(stats.mtime).toLocaleString();
  } catch (error) {
    console.error('Error getting file stats:', error);
    return 'Unknown';
  }
}

// Use a Router to mount the `PASSENGER_BASE_URI`
const router = express.Router();
app.use(process.env.PASSENGER_BASE_URI || '/', router);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to display the modules
router.get('/', (req, res) => {
  try {
    const lastModified = getLastModified(filePath);
    const modules = JSON.parse(fs.readFileSync(filePath, 'utf8')); // Read and parse the JSON file

    res.render('index', { modules, lastModified });
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
