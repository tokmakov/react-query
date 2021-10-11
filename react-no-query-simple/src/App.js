import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import List from './List';
import Post from './Post';
import NotFound from './NotFound';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={List} />
                <Route path="/post/:uuid" component={Post} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
}
