const express = require('express');
const path = require('path'); //'path' is an npm built-in package

const PORT = process.env.PORT || 8080;
const IP = process.env.IP;  

const app = express();
const absPath = __dirname + '/dist';



// the __dirname is the current directory from where the script is running
// app.use(express.static(__dirname));
app.use(express.static(absPath));

// send the user to index html page inspite of the url
app.get('/', (req, res) => {
  res.sendFile(path.join(absPath +'/index.html'));
});

//Tell Express to listen for requests (start server)
app.listen(PORT, IP, () => {
    console.log("Server listening on PORT " + PORT);
});