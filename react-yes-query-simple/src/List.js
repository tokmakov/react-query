import axios from 'axios';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

const fetchList = async () => {
    const response = await axios.get('http://localhost:5000/api/list');
    return response.data;
}

export default function List() {
    const { status, data: posts, isFetching, error } = useQuery(['list'], fetchList);

    if (status === 'loading') {
        return <p>Идет загрузка данных...</p>
    }

    if (status === 'error') {
        return <p>Что-то пошло не так...</p>
    }

    return (
        <div>
            <h1>Все посты блога</h1>
            {posts.length ? (
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
            {isFetching && <p>Обновление данных...</p>}
        </div>
    );
}