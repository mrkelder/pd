import React, { useContext, useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import arrow from 'img/blue_arrow.svg';
import { infoContext } from 'app/context';
import file from 'img/file.png';
import deleteImage from 'img/delete.png';
import colorImage from 'img/color.png';
import text from 'img/text.png';
import ColorPicker from 'react-color';
import 'css/editor.css';

function Editor() {
  const domain = useContext(infoContext);
  const images = ['a_hoodie.webp', 'a_hoodie_back.webp'];
  const [imageIndex, setImageIndex] = useState(0);
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState('#333');
  const [colorOpen, setOpenColor] = useState(false);
  const [elements, setElements] = useState([[], []]);
  const [removedElements, setRemovedElements] = useState([]);
  const fileElement = useRef();

  useEffect(() => {
    const canvasInst = new fabric.Canvas('canvas_editor');
    canvasInst.selection = false;
    setCanvas(canvasInst);
  }, []);

  function addToElementsCollection(element) {
    if (imageIndex === 0) setElements([[...elements[0], element], elements[1]]);
    else setElements([elements[0], [...elements[1], element]]);
  }

  function addText() {
    const textbox = new fabric.Textbox('New Text', {
      left: 15,
      top: 15,
      width: 80,
      fontFamily: 'Bold',
      fill: '#333'
    });
    textbox.setControlsVisibility({ mt: false, mb: false });
    canvas.add(textbox).setActiveObject(textbox);
    canvas.moveTo(textbox, 999);
    addToElementsCollection(textbox);
    setOpenColor(false);
  }

  function addImage(e) {
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.onload = f => {
      const data = f.target.result;
      fabric.Image.fromURL(data, img => {
        const oImg = img.set({ left: 0, top: 0, angle: 0 }).scale(0.1);
        oImg.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });
        addToElementsCollection(oImg);
        canvas.add(oImg).renderAll();
      });
    };
    reader.readAsDataURL(file);
    setOpenColor(false);
  }

  function changeColor({ rgb: { a, r, g, b } }) {
    const color = `rgba(${r}, ${g} , ${b}, ${a})`;
    setColor(color);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set('fill', color);
      canvas.renderAll();
    }
  }

  function changeImageIndex(num) {
    const nextIndex = imageIndex + num;
    let eventualIndex = nextIndex;
    if (nextIndex < 0) {
      setImageIndex(images.length - 1);
      eventualIndex = images.length - 1;
    }
    else if (nextIndex > images.length - 1) {
      setImageIndex(0);
      eventualIndex = 0;
    }
    else setImageIndex(nextIndex);

    canvas.getObjects().forEach(element => {
      element.set({ selectable: false });
      element.opacity = 0;
      element.hoverCursor = 'default';
    });

    canvas.discardActiveObject().renderAll();

    for (const element of elements[eventualIndex]) {
      // Renders the needed objects
      element.set({ selectable: true });
      element.opacity = 1;
      canvas.bringToFront(element);
      element.hoverCursor = 'move';
    }

    for (const element of removedElements) {
      element.set({ selectable: false });
      element.opacity = 0;
      element.hoverCursor = 'default';
    }

    setOpenColor(false);
  }

  function deleteElement() {
    const element = canvas.getActiveObject();
    if (element) {
      element.set({ selectable: false });
      element.opacity = 0;
      element.hoverCursor = 'default';
      canvas.discardActiveObject().renderAll();
      setRemovedElements([...removedElements, element]);
    }
    setOpenColor(false);
  }

  return (
    <div id="editor_page">
      <div id="interface">
        <img src={arrow} alt="arrow_l" style={{ transform: 'rotate(90deg)' }} className="arrow" onClick={() => { changeImageIndex(-1); }} />
        <div id="main_photo" style={{ backgroundImage: `url('http://${domain}/static/${images[imageIndex]}')` }} >
          <canvas width="150" height="175" id="canvas_editor"></canvas>
        </div>
        <img src={arrow} alt="arrow_r" style={{ transform: 'rotate(-90deg)' }} className="arrow" onClick={() => { changeImageIndex(1); }} />
      </div>
      <div id="tool_bar">
        {colorOpen && <ColorPicker onChange={changeColor} color={color} />}
        <input onChange={addImage} ref={fileElement} type="file" id="file_editor" style={{ display: "none" }} />
        <button className="editor_button" onClick={() => { setOpenColor(!colorOpen); }}>
          <img src={colorImage} alt="edirot_image" />
          <span>Color</span>
        </button>
        <button className="editor_button" onClick={addText}>
          <img src={text} alt="edirot_image" />
          <span>Text</span>
        </button>
        <button className="editor_button" onClick={deleteElement}>
          <img src={deleteImage} alt="edirot_image" />
          <span>Delete</span>
        </button>
        <label htmlFor="file_editor" tabIndex="0">
          <div className="editor_button">
            <img src={file} alt="edirot_image" />
            <span>File</span>
          </div>
        </label>
      </div>
    </div>

  );
}

export default Editor;