const express = require('express');
const path = require('path');
const fs = require('fs');
const pako = require('pako');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const port = 3000;

// Function to compress and generate the Draw.io URL
function generateDrawIOUrl(xml) {
    const compress = (str) => {
        const utf8str = Buffer.from(str, 'utf-8');
        const compressed = pako.deflateRaw(utf8str);
        return Buffer.from(compressed).toString('base64');
    };

    const baseUrl = "http://127.0.0.1:8080/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=samplename.drawio";
    return `${baseUrl}#R${compress(xml)}`;
}

// Livereload setup
const liveReloadServer = livereload.createServer({
    exts: ['js', 'html', 'css', 'xml'], // Extensions to watch
    delay: 100 // Delay to avoid unnecessary reloads
});
liveReloadServer.watch(path.join(__dirname, '../'));
app.use(connectLivereload());

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Endpoint to get the Draw.io URL
app.get('/drawio-url', (req, res) => {
    // Read the XML file
    fs.readFile(path.join(__dirname, 'data.xml'), 'utf-8', (err, xmlData) => {
        if (err) {
            return res.status(500).send('Error reading XML file');
        }

        // Generate the URL based on XML content
        const drawIOUrl = generateDrawIOUrl(xmlData);
        res.json({ url: drawIOUrl });
    });
});

// Serve static files from the project root
app.use(express.static(path.join(__dirname,'../public')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
