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
			return { ...state, players: [].concat(state.players, [action.payload.player]) };
		case ACTIONS.SET_PLAYER_LIST:
			return { ...state, players: action.payload.players };
		default:
			return state;
	}
}
const exampleReducerInit = {
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
	const [prevState, setPrevState] = useState({});
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
	}, []);

	useEffect(() => {
		const ignoreHandles = ['_id'];
		let hasChanged = false;
		const changedValues = {};
		for (const handle in state) {
			if (ignoreHandles.includes(handle)) continue;
			if (state[handle] !== prevState[handle]) {
				hasChanged = true;
				changedValues[handle] = state[handle];
			}
		}

		if (hasChanged) {
			axios.put(`/api/game/${state._id}`, changedValues);
		}

		setPrevState(Object.assign(prevState, state));
	}, [state]);

	return (
		<ModeratorContext.Provider value={state}>
			<ModeratorUpdateContext.Provider value={dispatch}>
				{''}
				{children}
			</ModeratorUpdateContext.Provider>
		</ModeratorContext.Provider>
	);
}
