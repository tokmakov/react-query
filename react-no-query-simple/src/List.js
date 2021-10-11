import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function List() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/list');
                setPosts(response.data);
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        };
        fetchList();
    }, []);

    return (
        <div>
            <h1>Все посты блога</h1>
            {error ? (
                <p>Что-то пошло не так...</p>
            ) : loading ? (
                <p>Идет загрузка данных...</p>
            ) : posts.length ? (
                <ul>
                    {posts.map(post => (
                        <li key={post.uuid}>
                            <Link to={'/post/' + post.uuid}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет постов</p>
            )}
        </div>
    );
}