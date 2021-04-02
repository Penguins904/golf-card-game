const express = require('express');
const socketio = require('socketio');
const path = require('path');

const app = express();
const PORT = 80;

//set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
