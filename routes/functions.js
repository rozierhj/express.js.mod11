const path = require('path');
const fs = require('fs/promises');

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
        console.error('There was an error', error);
    }
}

//function to create a unique id number
function makeID(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    const noteID = Math.floor(Math.random()*(max - min)) + min;
    return String(noteID);
}

module.exports = {readNotesFile, makeID};