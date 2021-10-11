# Библиотека React Query

[Модуль React Query. Часть 1 из 2](https://tokmakov.msk.ru/blog/item/660)

Традиционный метод fetch() отлично подходит для извлечения данных с помощью API. Однако по мере разрастания и усложнения приложения можно столкнуться с рядом трудностей. Первая трудность — кэширование полученных данных и поддержание кэша в актуальном состоянии. Вторая трудность — большой объем данных…

[Модуль React Query. Часть 2 из 2](https://tokmakov.msk.ru/blog/item/661)

Для реализации пагинации с помощью React Query достаточно включить информацию о текущей странице в ключ запроса. И добавить на страницу списка постов информацию о текущей странице и кнопки для перехода к следующей и предыдущей. Кроме того, нам надо изменить код сервера, чтобы он возвращал не все посты, а только часть…

### Исходные коды примеров

* react-no-query-simple — простой блог без использования React Query
* react-yes-query-simple — простой блог с использованием React Query
* react-yes-query-pager — простой блог с постраничной навигацией
* react-yes-query-scroll — простой блога с бесконечной загрузкой
* react-yes-query-mutate — добавление, редактирование и удаление постов
