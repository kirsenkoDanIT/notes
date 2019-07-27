/* eslint-disable jquery/no-ready */

"use strict";

$(document).on('click', '#saveNote', createNote)

async function createNote() {
    const titleValue = document.getElementById('note-title').value
    const textValue = document.getElementById('note-text').value
    const data = {
        title: titleValue,
        body: textValue
    }
    let req = await fetch('http://localhost:3000/create_notes' || 'http://localhost:8080/create_notes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let answer = await req.json()
    console.log(answer)
}