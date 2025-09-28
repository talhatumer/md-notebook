import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes }) => {
    if (notes.length === 0) {
        return <p className="no-notes-found">Filtreye uygun not bulunamadı.</p>;
    }

    return (
        <div className="note-list">
            {notes.map(note => (
                <NoteItem key={note.id} note={note} />
            ))}
        </div>
    );
};

export default NoteList;