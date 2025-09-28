import React from 'react';
import { Link } from 'react-router-dom';

const NoteItem = ({ note }) => {
    return (
        <Link to={`/note/${note.slug}`} className="note-item-link">
            <div className="note-item">
                <span className="note-category">{note.category}</span>
                <h3>{note.title}</h3>
                <p>{note.description}</p>
                <div className="note-tags">
                    {note.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default NoteItem;