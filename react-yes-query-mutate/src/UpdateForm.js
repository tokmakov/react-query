import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import Form from './Form';

const updatePost = (data) => {
    const url = 'http://localhost:5000/api/update/' +  data.uuid;
    return axios.put(url, data);
};

export default function UpdateForm(props) {
    const {
        uuid,
        title,
        content,
        author
    } = props;

    const queryClient = useQueryClient();

    const mutation = useMutation(updatePost, {
        onSuccess: (data, vars) => {
            // скрыть форму редактирования поста после сохранения
            props.setUpdate(false);
            // список теперь устарел, инвалидируем запрос, чтобы
            // React Query выполнил новый запрос к API-серверу
            queryClient.invalidateQueries(['list']);
        },
    });

    const handleSave = (data) => {
        data.uuid = uuid;
        mutation.mutate(data);
    };

    return <Form title={title} content={content}
                 author={author} handleSave={handleSave}
                 loading={mutation.isLoading} />
}