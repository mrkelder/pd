import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import cartReducer from 'app/cartReducer';
import windowSizeReducer from 'app/windowReducer';
import paymentReducer from 'app/paymentReducer';
import editorReducer from 'app/editorReducer';

const rootReducer = combineReducers({
  windowSize: windowSizeReducer,
  cart: cartReducer,
  payment: paymentReducer,
  editor: editorReducer
});

const middleWare = composeWithDevTools(applyMiddleware()); // TODO: don't forget to comment this when the project comes out

const store = createStore(rootReducer, middleWare);

export default store;