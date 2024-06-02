const path = require('path');
const fs = require('fs/promises');

//get the notes objects from db.json
async function readNotesFile(filePath){

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
        console.error('Error in reading the db.json file', error);
    }
}

module.exports = {readNotesFile};