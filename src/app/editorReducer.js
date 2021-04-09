const stateShape = {
  item: null
};

const editorReducer = (state = stateShape, action) => {
  const { type, payload } = action;
  switch (type) {
    case "editor/changeItem": return { ...stateShape, item: payload };
    default: return state;
  }
};

export default editorReducer;