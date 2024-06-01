const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//open the note homepage when the user clicks on the notes icon
app.get('/notes',(req, res)=>{
    
    res.sendFile(path.join(__dirname,'/public/notes.html'));
});

//populate the notes list on the left column of the page
app.get('/api/notes',(req, res)=>{

    res.sendFile(path.join(__dirname,'/db/db.json'));

});

//add another note to the notes list once the user has filled out the note data and selected "save note"
app.post('/api/notes',(req, res)=>{

    const { title, text, id } = req.body;

    if(title && text){
        const noteKeys = {
            title,
            text,
        }; 
        noteKeys.id = makeID(1000000, 9999999);
        readNotesFile('./db/db.json')
        .then((data)=>{
            let notesArray = data;
            notesArray.push(noteKeys);
            const notesUpload = JSON.stringify(notesArray);
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
            console.error('The Note was not saved',error);
        });
    }
    else{
        res.status(500).json('no good');
    }

});

//remove the note that the user clicked the trashcan icon on.
app.delete('/api/notes/:id',(req,res)=>{

    const deleteID = req.params.id;
    console.log(deleteID);

    readNotesFile('./db/db.json')
    .then((data)=>{
        const noteIndex = data.findIndex(data => data.id === deleteID);
        
        if(noteIndex !== -1){
            data.splice(noteIndex,1);
        }
        const noteArray = JSON.stringify(data);
        fs.writeFile('./db/db.json',noteArray,(err)=>{
            err ? console.error(err) : console.log('New Note Added');
        });
        const respond = {
            status: 'She gone!',
            body: data,
        };
        console.log(respond);
        res.status(201).json(respond);
    })
    .catch((error)=>{
        console.error('very big error',error);
        res.status(404).json({message:'big time issues'})
    });

    //res.status(200).json({message: 'She gone!'});
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

//function used to read the db.json file to get the current notes from it
const readNotesFile = async (filePath) => {

    try{
        const notes = await fs.readFile(filePath,'utf8');
        if(notes){
            const jsonNotes = JSON.parse(notes);
            console.log(notes);
            return jsonNotes;
        }
        else{
            return [];
        }
        
    } catch (error){
        console.error('There was an error', error);
    }
};

//function to create a unique id number
function makeID(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    const noteID = Math.floor(Math.random()*(max - min)) + min;
    return String(noteID);
}