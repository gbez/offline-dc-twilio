// Load App
const app = require('./app');

// Configure Environment Variables
const dotenv = require('dotenv');
dotenv.config({ path:'./config.env'});

//Define Port
const port = process.env.PORT || 8000;

//Instantiate Server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});