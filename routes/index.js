const router = require('express').Router();
const path = require('path');
const fs = require('fs/promises');
const {readNotesFile, makeID} = require('./functions');

//populate the notes list on the left column of the page
router.get('/notes',(req, res)=>{

    res.sendFile(path.join(__dirname,'..','/db/db.json'));
});

//add another note to the notes list once the user has filled out the note data and selected "save note"
router.post('/notes',(req, res)=>{

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
router.delete('/notes/:id',(req,res)=>{

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

module.exports = router;
