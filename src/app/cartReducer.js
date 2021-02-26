const defaultState = { items: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [] };

// TODO: when you add an item you also specify some options

const cartReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'cart/pushElement':
      if (state.items.findIndex(({ _id }) => _id === payload._id) === -1) {
        const newItems = [...state.items, { ...payload, amount: 1 }];
        localStorage.setItem("cartItems", JSON.stringify(newItems));
        return { items: newItems };
      }
      else {
        const newItems = state.items.map(item => {
          if (item._id === payload._id) item.amount++;
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(newItems));
        return { items: newItems };
      }
    case 'cart/changeAmount':
      const newItems = state.items.map(item => {
        if (item._id === payload._id) item.amount = payload.number;
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return { items: newItems };
    case 'cart/removeElement':
      const removedItems = state.items.filter(item => item._id !== payload._id);
      localStorage.setItem("cartItems", JSON.stringify(removedItems));
      return { items: removedItems };
    default: return state;
  }
};

export default cartReducer;