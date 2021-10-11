import { useState, useEffect } from 'react';

export default function Form(props) {
    const [title, setTitle] = useState(props.title);
    const [content, setContent] = useState(props.content);
    const [author, setAuthor] = useState(props.author);

    const handleChange = (event) => {
        if (event.target.name === 'title') {
            setTitle(event.target.value);
        }
        if (event.target.name === 'content') {
            setContent(event.target.value);
        }
        if (event.target.name === 'author') {
            setAuthor(event.target.value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (title.trim() === '') return;
        if (content.trim() === '') return;
        if (author.trim() === '') return;

        props.handleSave({title, content, author});
    }

    const formStyle = {
        backgroundColor: '#eee',
        padding: 5,
        marginBottom: 5,
    }

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <input
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                placeholder="Заголовок"
            />
            <input
                type="text"
                name="content"
                value={content}
                onChange={handleChange}
                placeholder="Контент"
            />
            <input
                type="text"
                name="author"
                value={author}
                onChange={handleChange}
                placeholder="Автор"
            />
            <input type="submit" value="Сохранить" />
            {props.loading && <span style={{color:'#0a0'}}>Сохранение...</span>}
        </form>
    );
}