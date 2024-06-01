const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const api = require('./routes/index');
const PORT = process.env.PORT || 3001;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', api);

//redundant command to get to homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
  );

//open the note homepage when the user clicks on the notes icon
app.get('/notes',(req, res)=>{
    
    res.sendFile(path.join(__dirname,'/public/notes.html'));
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

//function used to read the db.json file to get the current notes from it
//console.log(path.join(__dirname,'..','/db/db.json'));