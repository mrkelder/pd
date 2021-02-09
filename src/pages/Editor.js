import React, { useContext, useEffect, useState } from 'react';
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
  const [color, setColor] = useState('#cf1');
  const [colorOpen, setOpenColor] = useState(false);

  useEffect(() => {
    const canvasInst = new fabric.Canvas('canvas_editor');
    canvasInst.selection = false;
    setCanvas(canvasInst);
  }, []);

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
    if (imageIndex + num < 0) setImageIndex(images.length - 1);
    else if (imageIndex + num > images.length - 1) setImageIndex(0);
    else setImageIndex(imageIndex + num);
  }

  function deleteElement() {
    const element = canvas.getActiveObject();
    if (element) canvas.remove(element);
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
        <button onClick={() => { setOpenColor(!colorOpen); }}>
          <img src={colorImage} alt="edirot_image" />
          <span>Color</span>
        </button>
        <button onClick={addText}>
          <img src={text} alt="edirot_image" />
          <span>Text</span>
        </button>
        <button onClick={deleteElement}>
          <img src={deleteImage} alt="edirot_image" />
          <span>Delete</span>
        </button>
        <button>
          <img src={file} alt="edirot_image" />
          <span>File</span>
        </button>
      </div>
    </div>

  );
}

export default Editor;
