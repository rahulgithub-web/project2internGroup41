const express = require('express')
const bodyParser = require('body-parser');
const route = require('./routes/route');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let url = "mongodb+srv://group41Database:fxvFyAoe7VLOVLFs@cluster0.v8xey4l.mongodb.net/test ";
let port = process.env.PORT || 3000;

mongoose.connect(url, {
    useNewUrlParser: true
}).then( () => console.log("MongoDb is connected" ))
.catch( err => console.log(err) )

app.use('/', route) 

app.listen(port, function () {
    console.log('Express app running on port' + port);
});