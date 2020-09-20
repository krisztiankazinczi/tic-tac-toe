const express = require("express");
const cors = require("cors");
const path = require('path')

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))


app.get("/api/test", (req, res) => {
  res.status(200).json("The API is working")
});



// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})




app.listen(port, () => console.log(`App is running on port: ${port}`));