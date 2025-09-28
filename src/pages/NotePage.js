import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NotePage = () => {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // slug'a göre doğru markdown dosyasını fetch et
        // Dosya public klasöründe olduğu için direkt bu şekilde erişebiliriz.
        fetch(`/notes/${slug}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Not bulunamadı');
                }
                return response.text();
            })
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(error => {
                console.error("Markdown dosyası yüklenirken hata:", error);
                setContent('# Hata \n\nAradığınız not bulunamadı veya yüklenemedi.');
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="note-page">
            <Link to="/" className="back-link">&larr; Geri Dön</Link>
            <article className="note-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    );
};

export default NotePage;