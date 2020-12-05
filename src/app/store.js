import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = (state = { someField: '' }, { payload }) => {
  switch (payload) {
    default: return state;
  }
};

const middleWare = composeWithDevTools(applyMiddleware());

const store = createStore(rootReducer , middleWare);

export default store;