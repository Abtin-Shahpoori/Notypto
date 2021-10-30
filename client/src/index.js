import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import Blockchain from './components/Blockchain';
import history from './history'
import Pubnotes from './components/Pubnotes'


render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
            <Route exact path='/blockchain' component={Blockchain} />
            <Route exact path='/notes' component={Pubnotes} />
        </Switch>
    </Router>,
    document.getElementById('root')
);