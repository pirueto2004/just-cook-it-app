import express, { Router, static } from 'express';
import { resolve } from 'path'; //'path' is an npm built-in package
import { json, urlencoded } from 'body-parser';
const router = Router();

const PORT = process.env.PORT || 8080;
const IP = process.env.IP;  

const app = express();

const absPath = __dirname + '/dist';


app.use(json());
app.use(urlencoded({ extended: false }));

app.use(static(absPath));

router.get('*', (req,res) => {
    res.sendFile(resolve(absPath, '/index.html'));
});

//add the router
app.use('/', router);

//Tell Express to listen for requests (start server)
app.listen(PORT, IP, () => {
    console.log("Server listening on PORT " + PORT);
});

export default app;