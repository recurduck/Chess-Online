import { userReducer } from './reducers/userReducer.js'
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    userModule: userReducer,
})
export const store = createStore(rootReducer,
    composeEnhancers(applyMiddleware(thunk))
)

