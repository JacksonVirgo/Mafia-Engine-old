import React, { useContext, useEffect, useState, useReducer } from 'react';
import { useGlobals } from '../../GlobalProvider';

export const ACTIONS = {
	THREAD_CHANGE: 'thread',
	ADD_PLAYER: 'add_player',
	SET_PLAYER_LIST: 'set_player_list',
	SET_GAME: 'set_game',
};
function moderatorReducer(state, action) {
	switch (action.type) {
		case ACTIONS.SET_GAME:
			return { ...state, _id: action.payload._id };
		case ACTIONS.THREAD_CHANGE:
			return { ...state, thread: action.payload.thread };
		case ACTIONS.ADD_PLAYER:
			return { ...state, players: [...state.players, action.payload.players] };
		case ACTIONS.SET_PLAYER_LIST:
			return { ...state, players: action.payload.players };
		default:
			return state;
	}
}
const exampleReducerInit = {
	saved: {},
	_id: null,
	thread: '',
	players: [],
};

const ModeratorContext = React.createContext();
const ModeratorUpdateContext = React.createContext();
export const useModerator = () => useContext(ModeratorContext);
export const useModeratorUpdate = () => useContext(ModeratorUpdateContext);

export default function ModeratorProvider({ children }) {
	const { axios, jwt } = useGlobals();
	const [state, dispatch] = useReducer(moderatorReducer, exampleReducerInit);
	const [stateChanged, setChangeState] = useState(false);
	const setState = (action, data) => dispatch({ type: action, payload: data });
	useEffect(() => {
		const updateValues = (data) => {
			const { _id, threadURL, players } = data;
			if (_id) setState(ACTIONS.SET_GAME, { _id });
			if (threadURL) setState(ACTIONS.THREAD_CHANGE, { thread: threadURL });
			if (players) setState(ACTIONS.SET_PLAYER_LIST, { players });
		};
		axios
			.get('api/game/')
			.then((res) => updateValues(res.data))
			.catch((err) => console.log(err));

		const interval = setInterval(() => {
			console.log(stateChanged);
		}, 2000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	useEffect(() => {
		setChangeState(true);
		console.log('Here');
	}, [state]);
	useEffect(() => {
		console.log('Saved Change');
	}, [stateChanged]);

	return (
		<ModeratorContext.Provider value={state}>
			<ModeratorUpdateContext.Provider value={dispatch}>
				{''}
				{children}
			</ModeratorUpdateContext.Provider>
		</ModeratorContext.Provider>
	);
}
