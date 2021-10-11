import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const deletePost = (uuid) => {
    const url = 'http://localhost:5000/api/delete/' +  uuid;
    return axios.delete(url);
};

export default function DeleteForm(props) {
    const queryClient = useQueryClient();

    const mutation = useMutation(deletePost, {
        onSuccess: (data, vars) => {
            // список теперь устарел, инвалидируем запрос, чтобы
            // React Query выполнил новый запрос к API-серверу
            queryClient.invalidateQueries(['list']);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(props.uuid);
    };

    return (
        <form onSubmit={handleSubmit} style={{display:'inline-block'}}>
            <input type="submit" value="Удалить" style={{color:'#f00'}} />
            {mutation.isLoading && <span style={{color:'#f00'}}>Удаление...</span>}
        </form>
    )
}