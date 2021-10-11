import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router';

export default function Post() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);

    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const url = 'http://localhost:5000/api/post/' + params.uuid;
                const response = await axios.get(url);
                setPost(response.data);
            } catch (err) {
                if (err.response?.status !== 404) {
                    setError(true);
                }
            }
            setLoading(false);
        };
        fetchPost();
    }, []);

    return (
        <div>
            {error ? (
                <p>Что-то пошло не так...</p>
            ) : loading ? (
                <p>Идет загрузка данных...</p>
            ) : post ? (
                <>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <p>Автор: {post.author}</p>
                    <button onClick={() => history.goBack()}>Вернуться назад</button>
                </>
            ) : (
                <p>Пост блога не найден</p>
            )}
        </div>
    );
}