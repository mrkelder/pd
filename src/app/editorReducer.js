function changeLocalStorage(shape) {
  localStorage.setItem("editor", JSON.stringify(shape));
  return shape;
}

const stateShape = {
  item: null,
  removedElements: [],
  chosenFont: "Roboto",
  elements: [[], []]
};

const storage = localStorage.getItem("editor");
const defaultValue = storage ? JSON.parse(storage) : stateShape;

const editorReducer = (state = defaultValue, action) => {
  const { type, payload } = action;
  switch (type) {
    case "editor/changeItem":
      if (state.item && state.item._id === payload._id) return changeLocalStorage({ ...state, item: payload });
      else return changeLocalStorage({ ...stateShape, item: payload });
    case "editor/removeElement": return changeLocalStorage({ ...state, removedElements: [...state.removedElements, payload] });
    case "editor/addElement":
      const { index, element } = payload;
      return changeLocalStorage({
        ...state,
        elements: index === 0 ? [[...state.elements[0], element], state.elements[1]] : [state.elements[0], [...state.elements[1], element]]
      });
    case "editor/changeFont": return changeLocalStorage({ ...state, chosenFont: payload });
    default: return state;
  }
};

export default editorReducer;