import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

// Pages
import Main from './pages/Main.js';
import NotFoundPage from './pages/404.js';
import Replacement from './pages/replacement.js';
import Test from './pages/Test.js';
import VoteCountForm from './pages/VoteCount';

class Doc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (<>
            <Router>
                <Switch>
                    <Route exact path='/' component={Main} />
                    <Route exact path='/replacement' component={Replacement} />
                    <Route exact path='/votecount' component={VoteCountForm} />
                    <Route exact path='/test' component={Test} />
                    <Route path='/404' component={NotFoundPage} />
                    <Redirect to='/404' />
                </Switch>
            </Router>
        </>

        )
    }
}
ReactDOM.render(<Doc />, document.getElementById('root'));