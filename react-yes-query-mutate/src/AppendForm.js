import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import Form from './Form';

const appendPost = (data) => {
    const url = 'http://localhost:5000/api/append';
    return axios.post(url, data);
};

export default function AppendForm(props) {
    const queryClient = useQueryClient();

    const mutation = useMutation(appendPost, {
        onSuccess: (data, vars) => {
            // скрыть форму добавления поста после сохранения
            props.setAppend(false);
            // список теперь устарел, инвалидируем запрос, чтобы
            // React Query выполнил новый запрос к API-серверу
            queryClient.invalidateQueries(['list']);
        },
    });

    const handleSave = (data) => {
        mutation.mutate(data);
    };

    return <Form title="" content="" author=""
                 handleSave={handleSave} loading={mutation.isLoading} />
}