const express = require('express');
const path = require('path'); //'path' is an npm built-in package
const bodyParser = require('body-parser');
const router = express.Router();

const PORT = process.env.PORT || 8080;
const IP = process.env.IP;  

const app = express();

const absPath = __dirname + '/dist';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(absPath));

router.get('*', (req,res) => {
    res.sendFile(path.resolve(absPath, '/index.html'));
});

//add the router
app.use('/', router);

//Tell Express to listen for requests (start server)
app.listen(PORT, IP, () => {
    console.log("Server listening on PORT " + PORT);
});

module.exports = app;