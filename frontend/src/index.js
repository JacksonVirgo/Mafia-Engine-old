import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { attachSuffixOf } from './scripts/stringUtilities';

// Pages
import Main from './pages/Main.js';
import NotFoundPage from './pages/404.js';
import Replacement from './pages/replacement.js';
import VoteCount from './pages/votecount.js';

class Doc extends React.Component {
    componentDidMount() {
        document.title = "Mafia Engine";
    }
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Main} />
                    {/* <Route exact path='/rolecard' component={RoleCard} /> */}
                    <Route exact path='/replacement' component={Replacement} />
                    <Route exact path='/votecount' component={VoteCount} />
                    <Route path='/404' component={NotFoundPage} />
                    <Redirect to='/404' />
                </Switch>
            </Router>
        )
    }
}

/* <React.StrictMode>
        <Main showIcon='true' title='Mafia Engine' subtitle='Version Beta 1.1' />
      </React.StrictMode>);*/
ReactDOM.render(
    <Doc />,
    document.getElementById('root')
);