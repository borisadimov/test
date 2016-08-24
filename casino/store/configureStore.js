import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../ducks';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {sockets} from '../middleware/sockets';


export default function configureStore(initialState) {
  const logger = createLogger();

  const store = createStore(
    rootReducer,
    initialState,
    // applyMiddleware(logger, thunk, sockets));
    applyMiddleware(thunk, sockets));

  if (module.hot) {
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}