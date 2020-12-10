import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const cartReducer = (state = { items: [] }, { type, payload }) => {
  switch (type) {
    case 'cart/pushElement': return { items: [...state.items, payload] };
    default: return state;
  }
};

const windowSizeReducer = (state = { windowSize: document.getElementsByTagName('html')[0].clientWidth }, { type, payload }) => {
  switch (type) {
    case 'windowSize/resize': return { ...state, windowSize: payload };
    default: return state;
  }
}

const rootReducer = combineReducers({
  windowSize: windowSizeReducer,
  cart: cartReducer
});

const middleWare = composeWithDevTools(applyMiddleware());

const store = createStore(rootReducer, middleWare);

export default store;