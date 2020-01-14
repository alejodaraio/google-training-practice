const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;

// This serves static files from the specified directory
app.use(express.static(__dirname));

//server
const server = app.listen(PORT, () => {
  console.log('Server online...');
});
