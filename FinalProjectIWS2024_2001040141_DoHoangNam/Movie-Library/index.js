const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movie');

const app = express();
const port = 5000;

//Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://HoangNam:3006@cluster0.u8cevfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connect to MongoDB Atlas")
}).catch((error) => {
    console.log("Error when connecting to MongoDB Atlas: ", error);
})

app.use(express.json());

app.use('/movies', movieRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})