import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';
export default createStore(reducer,applyMiddleware(thunkMiddleware));
