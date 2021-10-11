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
    delay(2000);
    res.json(posts);
});

// GET-запрос поста блога по идентификатору
app.get('/api/post/:uuid', (req, res) => {
    delay(2000);
    const post = posts.find(item => item.uuid === req.params.uuid);
    if (post) {
        res.json(post);
    } else {
        res.status(404).send();
    }
});

// POST-запрос на добавление поста блога
app.post('/api/append', (req, res) => {
    delay(2000);
    const uuid = uuidv4();
    const { title, content, author } = req.body;
    const newPost = {
        uuid,
        title,
        content,
        author
    };
    posts.push(newPost);
    // возвращаем в ответе новый пост
    res.json(newPost);
});

// PUT-запрос на обновление поста блога
app.put('/api/update/:uuid', (req, res) => {
    delay(2000);
    const uuid = req.params.uuid;
    const index = posts.findIndex(elem => elem.uuid === uuid);
    if (index >= 0) {
        const { title, content, author } = req.body;
        posts[index].title = title;
        posts[index].content = content;
        posts[index].author = author;
        const newPost = {
            uuid,
            title,
            content,
            author
        };
        // возвращаем в ответе обновленный пост
        res.json(newPost);
    } else {
        res.status(404).send();
    }
});

// DELETE-запрос на удаление поста блога
app.delete('/api/delete/:uuid', (req, res) => {
    delay(2000);
    const index = posts.findIndex(elem => elem.uuid === req.params.uuid);
    if (index >= 0) {
        const deleted = posts.splice(index, 1);
        // возвращаем в ответе удаленный пост
        res.json(deleted[0]);
    } else {
        res.status(404).send();
    }
});

app.listen(5000);