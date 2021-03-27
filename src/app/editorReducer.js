const stateShape = {
  item: null,
  removedElements: [],
  elements: [[], []]
};

const editorReducer = (state = stateShape, action) => {
  const { type, payload } = action;
  switch (type) {
    case "editor/changeItem": return { ...stateShape, item: payload };
    case "editor/removeElement": return { ...state, removedElements: [...state.removedElements, payload] };
    case "editor/addElement":
      const { index, element } = payload;
      return {
        ...state,
        elements: index === 0 ? [[...state.elements[0], element], state.elements[1]] : [state.elements[0], [...state.elements[1], element]]
      };
    default: return state;
  }
};

export default editorReducer;