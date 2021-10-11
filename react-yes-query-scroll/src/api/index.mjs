import express from 'express';
import cors from 'cors';
import parser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const posts = [
    {
        uuid: uuidv4(),
        title: 'Первый пост блога',
        content: 'Контент первого поста блога',
        author: 'Сергей Иванов',
    },
    {
        uuid: uuidv4(),
        title: 'Второй пост блога',
        content: 'Контент второго поста блога',
        author: 'Николай Смирнов',
    },
    {
        uuid: uuidv4(),
        title: 'Третий пост блога',
        content: 'Контент третьего поста блога',
        author: 'Сергей Иванов',
    },
    {
        uuid: uuidv4(),
        title: 'Четвертый пост блога',
        content: 'Контент четвертого поста блога',
        author: 'Николай Смирнов',
    },
    {
        uuid: uuidv4(),
        title: 'Пятый пост блога',
        content: 'Контент пятого поста блога',
        author: 'Андрей Петров',
    },
    {
        uuid: uuidv4(),
        title: 'Шестой пост блога',
        content: 'Контент шестого поста блога',
        author: 'Сергей Иванов',
    },
    {
        uuid: uuidv4(),
        title: 'Седьмой пост блога',
        content: 'Контент седьмого поста блога',
        author: 'Николай Смирнов',
    },
    {
        uuid: uuidv4(),
        title: 'Восьмой пост блога',
        content: 'Контент восьмого поста блога',
        author: 'Сергей Иванов',
    },
    {
        uuid: uuidv4(),
        title: 'Девятый пост блога',
        content: 'Контент девятого поста блога',
        author: 'Николай Смирнов',
    },
    {
        uuid: uuidv4(),
        title: 'Десятый пост блога',
        content: 'Контент десятого поста блога',
        author: 'Андрей Петров',
    }
];

const delay = (ms) => {
    let current = Date.now();
    const future = current + ms;
    while (current < future) {
        current = Date.now();
    }
};

const PAGE_SIZE = 3;

const getPagePosts = (page = 1) => {
    if (isNaN(page)) return null;
    if (page < 1) return null;
    if (posts.length === 0) {
        return {
            totalPosts: 0,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
            posts: [],
        };
    }
    const totalPages = Math.ceil(posts.length / PAGE_SIZE);
    if (page > totalPages) return null;
    const start = (page - 1) * PAGE_SIZE;
    const slice = posts.slice(start, start + PAGE_SIZE);
    const hasPrevPage = (page === 1) ? false : true;
    const hasNextPage = (page === totalPages) ? false : true;
    return {
        totalPosts: posts.length,
        totalPages: totalPages,
        currentPage: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        posts: slice,
    }
}

const app = express();
app.use(cors());
app.use(parser.json());

// GET-запрос на получение списка постов
app.get('/api/list', (req, res) => {
    // задержка с ответом 2 секунды
    delay(2000);
    const result = getPagePosts(parseInt(req.query.page));
    if (result !== null) {
        res.json(result);
    } else {
        res.status(404).send();
    }
});

// GET-запрос поста блога по идентификатору
app.get('/api/post/:uuid', (req, res) => {
    // задержка с ответом 2 секунды
    delay(2000);
    const post = posts.find(item => item.uuid === req.params.uuid);
    if (post) {
        res.json(post);
    } else {
        res.status(404).send();
    }
});

app.listen(5000);