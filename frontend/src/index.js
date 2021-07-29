import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './css/main.css';

// Old Pages
import Main from './components/pages/Main.jsx';
import NotFoundPage from './components/pages/404.jsx';
import VoteCount from './components/pages/VoteCount.jsx';
import RoleCard from './components/pages/RoleCard.jsx';
import Credit from './components/pages/Credits.jsx';
import ModeratorPanel from './pages/ModeratorPanel';

// New Pages
import Replace from './pages/Replace';
import Login from './pages/Login';
import Register from './pages/Register';

import TestSocketPage from './pages/testing/SocketTest';

import GlobalProvider, { useGlobals } from './GlobalProvider';

function SubsetApp() {
    const globalState = useGlobals();
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Main} />
                <Route exact path='/replacement' component={Replace} />
                <Route exact path='/votecount' component={VoteCount} />
                <Route exact path='/rolecard' component={RoleCard} />
                <Route exact path='/credits' component={Credit} />
                <Route exact path='/test' component={VoteCount} />
                <Route exact path='/moderator'>
                    {globalState.jwt ? <ModeratorPanel /> : <Redirect to='login' />}
                </Route>
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/testSocket' component={TestSocketPage} />

                <Route path='/404' component={NotFoundPage} />
                <Redirect to='/404' />
            </Switch>
        </Router>
    );
}

function App() {
    return (
        <>
            <GlobalProvider>
                <SubsetApp />
            </GlobalProvider>
        </>
    );
}
ReactDOM.render(<App />, document.getElementById('root'));
