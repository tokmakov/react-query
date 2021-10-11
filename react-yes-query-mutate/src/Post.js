import axios from 'axios';
import { useParams, useHistory } from 'react-router';

import { useQuery } from 'react-query';

const fetchPost = async (uuid) => {
    const url = 'http://localhost:5000/api/post/' + uuid;
    const response = await axios.get(url);
    return response.data;
}

export default function Post() {
    const history = useHistory();
    const params = useParams();

    const {
        status,
        data: post,
        isFetching
    } = useQuery(['post', params.uuid], () => fetchPost(params.uuid));

    if (status === 'loading') {
        return <p>Идет загрузка данных...</p>
    }
    
    if (status === 'error') {
        return <p>Что-то пошло не так...</p>
    }

    return (
        <div>
            {post ? (
                <>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <p>Автор: {post.author}</p>
                    <button onClick={() => history.goBack()}>Вернуться назад</button>
                </>
            ) : (
                <p>Пост блога не найден</p>
            )}
            {isFetching && <p>Обновление данных...</p>}
        </div>
    );
}