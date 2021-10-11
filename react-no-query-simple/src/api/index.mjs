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
    }
];

const delay = (ms) => {
    let current = Date.now();
    const future = current + ms;
    while (current < future) {
        current = Date.now();
    }
};

const app = express();
app.use(cors());
app.use(parser.json());

// GET-запрос на получение всего списка постов
app.get('/api/list', (req, res) => {
    delay(3000);
    res.json(posts);
});

// GET-запрос поста блога по идентификатору
app.get('/api/post/:uuid', (req, res) => {
    delay(3000);
    const post = posts.find(item => item.uuid === req.params.uuid);
    if (post) {
        res.json(post);
    } else {
        res.status(404).send();
    }
});

app.listen(5000);