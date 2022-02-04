import {compose, createStore} from 'redux';
import allReducer from './allReducer'

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const composeEnchancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
	allReducer,
	composeEnchancer()
);

export type rootState = ReturnType<typeof store.getState>;