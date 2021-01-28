import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";

// Pages
import Main from './pages/Main.js';
import NotFoundPage from './pages/404.js';
import RoleCard from './pages/rolecard.js';
import Replacement from './pages/replacement.js';

class Doc extends React.Component {
    componentDidMount() {
        document.title = "Mafia Engine";
    }
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Main} />
                    <Route exact path='/rolecard' component={RoleCard} />
                    <Route exact path='/replacement' component={Replacement} />
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