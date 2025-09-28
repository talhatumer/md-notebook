import React, { useState, useEffect, useMemo } from 'react';
import notesData from '../data/notes.json';
import Filter from '../components/Filter';
import NoteList from '../components/NoteList';

const HomePage = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        // Normalde API'den fetch edilebilir, biz direkt JSON'dan alıyoruz.
        setNotes(notesData);
    }, []);

    // Kategorileri dinamik olarak JSON'dan alalım (tekrarları önleyerek)
    const categories = useMemo(() => {
        const allCategories = notesData.map(note => note.category);
        return ['all', ...new Set(allCategories)];
    }, []);

    // Arama ve filtreleme mantığı
    const filteredNotes = useMemo(() => {
        return notes
            .filter(note => {
                // Kategori filtresi
                return selectedCategory === 'all' || note.category === selectedCategory;
            })
            .filter(note => {
                // Arama filtresi (başlık, açıklama ve etiketlerde arama)
                const searchText = searchTerm.toLowerCase();
                return (
                    note.title.toLowerCase().includes(searchText) ||
                    note.description.toLowerCase().includes(searchText) ||
                    note.tags.some(tag => tag.toLowerCase().includes(searchText))
                );
            });
    }, [notes, searchTerm, selectedCategory]);

    return (
        <div className="homepage">
            <Filter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
            />
            <NoteList notes={filteredNotes} />
        </div>
    );
};

export default HomePage;