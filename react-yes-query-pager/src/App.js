import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import List from './List';
import Post from './Post';
import NotFound from './NotFound';

import {
    QueryClient,
    QueryClientProvider
} from 'react-query';

import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Switch>
                    <Route exact path="/" component={List} />
                    <Route path="/post/:uuid" component={Post} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    );
}
