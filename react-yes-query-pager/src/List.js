import axios from 'axios';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

const fetchList = async (page = 1) => {
    const response = await axios.get('http://localhost:5000/api/list?page=' + page);
    return response.data;
}

export default function List() {
    const history = useHistory();
    const location = useLocation();

    // При монтировании компонента мы не знаем, какую страницу загружать, поэтому
    // получаем ее из адресной строки браузера — «/», «/?page=2», «/?page=3»
    const getStartPage = () => {
        const match = location.search.match(/page=[0-9]+/);
        if (match && match.length) {
            const [, page] = match[0].split('=');
            return parseInt(page, 10);
        }
        return 1;
    };

    const [page, setPage] = useState(getStartPage);

    // Вспомогательная функция, которая добавляет записи в историю браузера
    // при нажатии кнопок «Предыдущая» и «Следующая» — тогда будут работать
    // и кнопки браузера «Вперед» и «Назад»
    const pushState = (shift) => {
        const newPage = page + shift;
        if (newPage !== 1) {
            history.push('/?page=' + newPage, {page: newPage});
        } else {
            history.push('/', {page: 1});
        }
    }

    const handlePrevClick = () => {
        pushState(-1);
        setPage(page => page - 1);
    };

    const handleNextClick = () => {
        pushState(1);
        setPage(page => page + 1);
    };

    // Следим за изменением адреса страницы, то есть «/», «/?page=2», «/?page=3».
    // Если изменение адреса вызвано нажатием кнопок браузера «Вперед» и «Назад»,
    // тогда изменяем состояние, чтобы вызвать новый рендер, выполнить запрос к
    // API-серверу (или взять данные из кэша) и показать страницу из истории.
    useEffect(() => {
        const unbind = history.listen((location) => { 
            if (history.action === 'POP') {
                const oldPage = location.state?.page;
                setPage(oldPage ? oldPage : 1);
            }
        });
        return () => unbind();
        // eslint-disable-next-line
    }, []);

    const {
        status,
        data,
        isFetching,
        isPreviousData,
    } = useQuery(['list', {page: page}], () => fetchList(page), {keepPreviousData: true});

    if (status === 'loading') {
        return <p>Идет загрузка данных...</p>
    }
    
    if (status === 'error') {
        return <p>Что-то пошло не так...</p>
    }

    return (
        <div>
            {data.posts.length ? (
                <>
                    <h1>Все посты блога</h1>
                    <ul>
                        {data.posts.map(post => (
                            <li key={post.uuid}>
                                <Link to={'/post/' + post.uuid}>{post.title}</Link>
                            </li>
                        ))}
                    </ul>
                    {data.hasPrevPage && <button onClick={handlePrevClick}>Предыдущая</button>}
                    <strong> страница {page} </strong>
                    {data.hasNextPage && <button onClick={handleNextClick}>Следующая</button>}
                </>
            ) : (
                <p>Нет постов</p>
            )}
            {isFetching && <p>Фоновое обновление данных...</p>}
            {isPreviousData ? <p>Это еще старые данные</p> : <p>Это уже новые данные</p>}
        </div>
    );
}