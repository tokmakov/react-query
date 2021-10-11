import axios from 'axios';
import { Link } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';

const fetchList = async ({pageParam = 1}) => {
    const response = await axios.get('http://localhost:5000/api/list?page=' + pageParam);
    return response.data;
}

export default function List() {
    const history = useHistory();
    const location = useLocation();
    const queryClient = useQueryClient();

    // При монтировании компонента мы не знаем, сколько порций загружать, поэтому
    // берем число из адресной строки браузера — «/», «/?loaded=2», «/?loaded=3»
    const getLoaded = () => {
        const match = location.search.match(/loaded=[0-9]+/);
        if (match && match.length) {
            const [, loaded] = match[0].split('=');
            return parseInt(loaded, 10);
        }
        return 1;
    };

    const loaded = useRef(getLoaded());

    // Вспомогательная функция, которая добавляет записи в историю браузера при
    // нажатии кнопка «Загрузить новую порцию» — тогда сможем обеспечить и работу
    // кнопок браузера «Вперед» и «Назад», потому что будем следить за этим
    const pushState = () => {
        const newLoaded = loaded.current + 1;
        if (newLoaded !== 1) {
            history.push('/?loaded=' + newLoaded, {loaded: newLoaded});
        } else {
            history.push('/', {loaded: 1});
        }
    }

    const handleLoadMore = () => {
        fetchNextPage();
        pushState();
        loaded.current++;
    };

    const {
        status,
        data,
        isFetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(['list'], fetchList, {
        getNextPageParam: (lastPage, pages) => {
            // возвращает номер следующей страницы для загрузки, это
            // число будет передано функции fetchList как pageParam
            return lastPage.hasNextPage ? lastPage.currentPage + 1 : null;
        }
    });

    // Следим за изменением адреса страницы, то есть «/», «/?page=2», «/?page=3».
    // Если изменение адреса вызвано нажатием кнопок браузера «Вперед» и «Назад»,
    // тогда изменяем данные запроса в кэше, добавляя-удаляя элементы массива
    useEffect(() => {
        const unbind = history.listen((location) => { 
            if (history.action === 'POP') { // нажатие кнопки «Вперед» или «Назад»
                const oldLoaded = location.state?.loaded ?? 1;
                if (oldLoaded < loaded.current) {
                    // удаляем последнюю загруженную порцию
                    queryClient.setQueryData(['list'], (data) => ({
                        pages: data.pages.slice(0, data.pages.length - 1),
                        pageParams: data.pageParams.slice(0, data.pageParams.length - 1),
                    }));
                    loaded.current = oldLoaded;
                }
                if (oldLoaded > loaded.current) {
                    // добавляем в массив следующую порцию
                    fetchNextPage();
                    loaded.current = oldLoaded;
                }
            }
        });
        return () => unbind();
    }, []);

    // При монтировании компонента, если в адресной строке браузера «/?loaded=3»,
    // то первая порция будет загружена автоматически, а две другие мы должны
    // загрузить вручную — по очереди и если есть еще, что загружать
    const needLoadPage = data?.pages?.length && // первая порция уже загружена?
        data.pages.length < loaded.current &&   // нужно загружать еще порции?
        !isFetchingNextPage && hasNextPage;     // по очереди и если есть еще
    useEffect(() => needLoadPage && fetchNextPage(), [needLoadPage]);

    if (status === 'loading') {
        return <p>Идет загрузка данных...</p>
    }
    
    if (status === 'error') {
        return <p>Что-то пошло не так...</p>
    }

    return (
        <div>
            {data.pages.length ? (
                <>
                    <h1>Все посты блога</h1>
                    {data.pages.map((group, index) => (
                        <ul key={index}>
                            {group.posts.map(post => (
                                <li key={post.uuid}>
                                    <Link to={'/post/' + post.uuid}>{post.title}</Link>
                                </li>
                            ))}
                        </ul>
                    ))}
                    {hasNextPage ? (
                        <button onClick={() => handleLoadMore()} disabled={isFetchingNextPage}>
                            Загрузить новую порцию
                        </button>
                    ) : (
                        <span style={{color:'#f00'}}>Больше нечего загружать</span>
                    )}
                </>
            ) : (
                <p>Нет постов</p>
            )}
            {isFetching && isFetchingNextPage && <p>Загрузка новой порции...</p>}
            {isFetching && !isFetchingNextPage && <p>Фоновое обновление данных...</p>}
        </div>
    );
}