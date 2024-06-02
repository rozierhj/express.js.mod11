const router = require('express').Router();
const path = require('path');
const fs = require('fs/promises');
const {v4: uuidv4} = require('uuid');
const {readNotesFile} = require('./functions');

//populate the notes list on the left column of the page
router.get('/notes',(req, res)=>{

    if(path.join(__dirname,'..','/db/db.json')){
        res.sendFile(path.join(__dirname,'..','/db/db.json'));
    }
    else{
        return res.status(404).json({error:'Could not find file'});
    }
    
});

//add another note to the notes list once the user has filled out the note data and selected "save note"
router.post('/notes',(req, res)=>{

    const { title, text, id } = req.body;

    if(title && text){
        const noteKeys = {
            title,
            text,
        }; 
        //create a serial number for the note
        noteKeys.id = uuidv4();

        //get current notes array
        readNotesFile('./db/db.json')
        .then((data)=>{
            let notesArray = data;

            //add note to existing notes array
            notesArray.push(noteKeys);
            const notesUpload = JSON.stringify(notesArray);

            //re-write notes db.json file with update notes array
            fs.writeFile('./db/db.json',notesUpload,(err)=>{
                err ? console.error(err) : console.log('New Note Added');
            });
            const respond = {
                status: 'A new note has been added!',
                body: noteKeys,
            };
            
            res.status(201).json(respond);
        })
        .catch((error)=>{
            console.error('The note was not saved',error);
            res.status(400).json({message:'The note was not saved'})
        });
    }
    else{
       return res.status(400).json({error: 'Error in loading note'});
    }

});

//remove the note that the user clicked the trashcan icon on.
router.delete('/notes/:id',(req,res)=>{

    //get the note chosen by the user
    const deleteID = req.params.id;
   // console.log(deleteID);

    //get the current notes array
    readNotesFile('./db/db.json')
    .then((data)=>{

        //get the index in the notes array that the specific note is at
        const noteIndex = data.findIndex(data => data.id === deleteID);
        
        if(noteIndex !== -1){
            //remove note
            data.splice(noteIndex,1);
        }
        const noteArray = JSON.stringify(data);

        //write db.json file again using the updated array
        fs.writeFile('./db/db.json',noteArray,(err)=>{
            err ? console.error(err) : console.log('Note removed, notes array updated');
        });
        const respond = {
            status: 'The note has been removed',
            body: data,
        };
        //console.log(respond);
        res.status(201).json(respond);
    })
    .catch((error)=>{
        console.error('The note could not be removed',error);
        res.status(400).json({message:'The note could note be removed'})
    });

    
});

module.exports = router;
