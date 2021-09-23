import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import Blockchain from './components/Blockchain';
import history from './history'
import Wallet from './components/WalletUI'
import Recieve from './components/Recieve';
import Send from './components/Send'
import Pubnotes from './components/Pubnotes'
import Privnote from './components/Privnote'
import Notes from './components/Notes';
import PrivNoteCreate from './components/PrivNoteCreate'
import PubNoteCreate from './components/PubNoteCreate'

render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
            <Route exact path='/blockchain' component={Blockchain} />
            <Route exact path='/wallet' component={Wallet} />
            <Route exact path='/transact-recieve' component={Recieve} />
            <Route exact path='/transact-send' component={Send} />
            <Route exact path='/pub-notes' component={Pubnotes} />
            <Route exact path='/notes' component={Notes} />
            <Route exact path='/priv-notes' component={Privnote} />
            <Route exact path='/create-priv-note' component={PrivNoteCreate} />
            <Route exact path='/create-pub-note' component={PubNoteCreate} />
        </Switch>
    </Router>,
    document.getElementById('root')
);