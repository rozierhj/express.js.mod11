const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3001;
//const PORT = 3001;
app.use(express.static('public'));

app.get('/notes',(req, res)=>{
    
    res.sendFile(path.join(__dirname,'/db/db.json'));
});
app.post('/notes',(req, res)=>{
    res.send('you want a piece of me');
});
app.delete('/notes/:id',(req,res)=>{

    res.send('ya gone!');
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});