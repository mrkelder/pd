const windowSizeReducer = (state = { windowSize: document.getElementsByTagName('html')[0].clientWidth }, { type, payload }) => {
  switch (type) {
    case 'windowSize/resize': return { ...state, windowSize: payload };
    default: return state;
  }
};

export default windowSizeReducer;