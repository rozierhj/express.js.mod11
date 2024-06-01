const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

console.log('I did stuff');


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});