const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
//const PORT = process.env.PORT || 3001;
const PORT = 3001;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//open the note homepage when the user clicks on the notes icon
app.get('/notes',(req, res)=>{
    
    res.sendFile(path.join(__dirname,'/public/notes.html'));
});

app.get('/api/notes',(req, res)=>{

    res.sendFile(path.join(__dirname,'/db/db.json'));

});

app.post('/api/notes',(req, res)=>{

    //const noteStuff = JSON.parse(req);
    //console.log(req.status);
    const { title, text } = req.body;
    // const text = req.body.text;
    // const title = req.body.title;
   // console.log(req.body)
    if(title && text){
        const noteKeys = {
            title,
            text,
        };
        readNotesFile('./db/db.json')
        .then((data)=>{
            let notesArray = data;
            notesArray.push(noteKeys);
            notesUpload = JSON.stringify(notesArray);
            fs.writeFile('./db/db.json',notesUpload,(err)=>{
                err ? console.error(err) : console.log('New Note Added');
            });
            const respond = {
                status: 'good to go!',
                body: noteKeys,
            };
            console.log(respond);
            res.status(201).json(respond);
        })
        .catch((error)=>{
            console.error('very biggly error',error);
        });
    }
    else{
        res.status(500).json('no good');
    }

});

app.delete('/notes/:id',(req,res)=>{

    res.send('ya gone!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

const readNotesFile = async (filePath) => {

    try{
        const notes = await fs.readFile(filePath,'utf8');
        const jsonNotes = JSON.parse(notes);
        console.log(notes);
        return jsonNotes;
    } catch (error){
        console.error('There was an error', error);
    }
};