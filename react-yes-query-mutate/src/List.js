import axios from 'axios';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useState } from 'react';
import UpdateForm from './UpdateForm';
import AppendForm from './AppendForm';
import DeleteForm from './DeleteForm';

const fetchList = async () => {
    const response = await axios.get('http://localhost:5000/api/list');
    return response.data;
};

export default function List() {
    // признак того, что редактируется пост блога
    const [update, setUpdate] = useState(false);
    // признак того, что добавляется пост блога
    const [append, setAppend] = useState(false);

    const { status, data: posts, isFetching } = useQuery(['list'], fetchList);

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
                <div>
                    {posts.map(post => (
                        <article key={post.uuid}>
                            <p><Link to={'/post/' + post.uuid}>{post.title}</Link></p>
                            {update && update === post.uuid ? (
                                <>
                                    <UpdateForm {...post} setUpdate={setUpdate} />
                                    <button onClick={() => setUpdate(false)} style={{color:'#0a0'}}>
                                        Отменить
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setUpdate(post.uuid)} style={{color:'#0a0'}}>
                                    Редактировать
                                </button>
                            )}
                            <DeleteForm uuid={post.uuid} />
                        </article>
                    ))}
                </div>
            ) : (
                <p>Нет постов</p>
            )}

            {append ? (
                <>
                    <h2>Создать новый пост</h2>
                    <AppendForm setAppend={setAppend} />
                    <button onClick={() => setAppend(false)}>Отменить</button>
                </>
            ) : (
                <p>
                    <button onClick={() => setAppend(true)}>Новый пост</button>
                </p>
            )}

            {isFetching && <p>Фоновое обновление данных...</p>}
        </div>
    );
}