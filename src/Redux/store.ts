import {compose, createStore} from 'redux';
import allReducer from './allReducer'

// Typescript setup for Redux_Devtools
declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const composeEnchancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Creation of store with devtools
export const store = createStore(
	allReducer,
	composeEnchancer()
);

// rootState type for store users
export type rootState = ReturnType<typeof store.getState>;