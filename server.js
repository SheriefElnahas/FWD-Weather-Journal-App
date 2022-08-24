const projectData = [];

const express = require('express');

const app = express();

/* Dependencies - Bodyparser is used to parse our data */
const bodyParser = require('body-parser');

/* Middleware */
// Here we are configuring express to use boder-parser as middle-ware
// We use use method to tell body parser exatctly how we want our data to be dealt with - and we want JSON data 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Cors for cross origin allowance - cors is a package that let the browser and server talk to each other without any security interpetion
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

const server = app.listen(3000, () => {
    console.log('Listening on port 3000')
})


app.get('/all', (req,res) => {
    res.send(projectData);
    
     // empty out the array every time we send a new data
     projectData = [];
})


app.post('/renderDetails', (req,res) => {
    console.log(req.body);
    const userDetails = {
        currentDate: req.body.date,
        temp: req.body.temp,
        description: req.body.description
    }
    projectData.push(userDetails);
})

