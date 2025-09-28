import React from 'react';

const Filter = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) => {
    return (
        <div className="filter-container">
            <input
                type="text"
                placeholder="Notlarda ara (başlık, etiket...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
            >
                {categories.map(category => (
                    <option key={category} value={category}>
                        {category === 'all' ? 'Tüm Kategoriler' : category}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Filter;