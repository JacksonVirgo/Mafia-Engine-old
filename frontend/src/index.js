import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './css/main.css';

// Pages
import Main from './components/pages/Main.jsx';
import NotFoundPage from './components/pages/404.jsx';
import Replacement from './components/pages/Replacement.jsx';
import VoteCount from './components/pages/VoteCount.jsx';
import RoleCard from './components/pages/RoleCard.jsx';
import Credit from './components/pages/Credits.jsx';

function App() {
	return (
		<>
			<Router>
				<Switch>
					<Route exact path='/' component={Main} />
					<Route exact path='/replacement' component={Replacement} />
					<Route exact path='/votecount' component={VoteCount} />
					<Route exact path='/rolecard' component={RoleCard} />
					<Route exact path='/credits' component={Credit} />
					<Route exact path='/test' component={VoteCount} />

					<Route path='/404' component={NotFoundPage} />
					<Redirect to='/404' />
				</Switch>
			</Router>
		</>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
