const cartReducer = (state = { items: [] }, { type, payload }) => {
  switch (type) {
    case 'cart/pushElement': return { items: [...state.items, payload] };
    default: return state;
  }
};

export default cartReducer;