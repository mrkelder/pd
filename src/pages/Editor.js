import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fabric } from 'fabric';
import arrow from 'img/blue_arrow.svg';
import { infoContext } from 'app/context';
import file from 'img/file.png';
import closeImageWhite from 'img/closeWhite.svg';
import deleteImage from 'img/delete.png';
import colorImage from 'img/color.png';
import text from 'img/text.png';
import fontImage from 'img/font.png';
import ColorPicker from 'react-color';
import Button from 'components/Button';
import 'css/editor.css';
import { useSelector } from 'react-redux';

function Editor() {
  const domain = useContext(infoContext);
  const images = ['a_hoodie.webp', 'a_hoodie_back.webp'];
  const basePrice = 130;
  const [imageIndex, setImageIndex] = useState(0);
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState('#333');
  const [colorOpen, setOpenColor] = useState(false);
  const [elements, setElements] = useState([[], []]);
  const [removedElements, setRemovedElements] = useState([]);
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [fontOverlay, setFontOverlay] = useState(0);
  const [chosenFont, setChosenFont] = useState("Roboto");
  const fonts = ['Roboto', 'Bold', 'Custom3', 'Custom1', 'Custom2', 'Custom4', 'Cursive', 'Custom5', 'serif', 'Custom6'];
  const fileElement = useRef();
  const { windowSize } = useSelector(state => state.windowSize);

  const getTotalPrice = useCallback(() => {
    // Gets size of each element and calculates a total price
    function getTotalPriceOnCertainImage(i) {
      const { class: className, scaleX, scaleY } = i;
      if (className !== "deleted") {
        if (className === "txt") {
          // If we're working with some text
          const { text } = i;
          const priceIndex = 0.25;
          const square = scaleX * scaleY;
          const letters = text.split(/ +/).join('').length;
          totalTxtPrice += square * priceIndex * letters;
        }
        else {
          // If we're working with an image
          const { width, height } = i;
          const priceIndex = 100000;
          const scale = scaleX * scaleY * 100; // multiplied by 100 because default scale if 0.1
          const square = width * height;
          totalImgPrice += square * scale / priceIndex;
        }
      }
    }
    let totalImgPrice = 0;
    let totalTxtPrice = 0;
    for (const i of elements[0]) {
      getTotalPriceOnCertainImage(i);
    }
    for (const i of elements[1]) {
      getTotalPriceOnCertainImage(i);
    }
    setTotalPrice(totalImgPrice + totalTxtPrice + basePrice);
  }, [elements]);

  useEffect(() => {
    getTotalPrice();
  }, [elements, getTotalPrice]);

  useEffect(() => {
    // Deselecting system
    // FIXME: here's some problem that make a text block deselectable right after you create another text block
    function deselect(element) {
      // Fires only if the clicked element isn't canvas, text button or image button
      const { target } = element;
      const isColorPickerChild = element.path.filter(child => child.tagName === 'DIV').findIndex(child => child.getAttribute('class') === 'chrome-picker ');
      const condition = !!target.getAttribute('class') || (target.tagName.toLowerCase() === 'canvas' && target.getAttribute('class') === 'dont_deselect');
      if (canvas && !condition && target.getAttribute('class') !== "delete" && isColorPickerChild === -1) canvas.discardActiveObject().renderAll();
    }
    window.addEventListener('click', deselect);
    window.addEventListener('touchstart', deselect);
  }, [canvas]);

  useEffect(() => {
    const canvasInst = new fabric.Canvas('canvas_editor');
    canvasInst.selection = false;
    setCanvas(canvasInst);
  }, []);

  useEffect(() => {
    if (canvas) canvas.on('object:modified', getTotalPrice)
  }, [getTotalPrice, canvas]);

  function addItemToBin() {
    alert("Hey, you've created your own style 🤑. Congrats! But we don't have this system yet, sorry 😥");
  }

  function addToElementsCollection(element) {
    if (imageIndex === 0) setElements([[...elements[0], element], elements[1]]);
    else setElements([elements[0], [...elements[1], element]]);
  }

  function changeFont({ target }) {
    const fontFamily = target.getAttribute('data-font');
    setChosenFont(fontFamily);
    if (canvas.getActiveObject()) {
      // Changes font of a chosen object
      canvas.getActiveObject().set({ fontFamily });
      canvas.renderAll();
    }
    setFontOverlay(0);
  }

  function addText() {
    const textbox = new fabric.Textbox('New Text', {
      left: 32,
      top: 35,
      width: 80,
      fontFamily: chosenFont,
      fill: '#333',
      class: "txt",
      opacity: 1
    });
    textbox.setControlsVisibility({ mt: false, mb: false });
    canvas.add(textbox).setActiveObject(textbox);
    canvas.moveTo(textbox, 999);
    addToElementsCollection(textbox);
    setOpenColor(false);
  }

  function addImage(e) {
    try {
      const [file] = e.target.files;
      const reader = new FileReader();
      reader.onload = f => {
        const data = f.target.result;
        fabric.Image.fromURL(data, img => {
          const oImg = img.set({ left: 0, top: 0, angle: 0, class: "img", opacity: 1 }).scale(0.1);
          oImg.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });
          addToElementsCollection(oImg);
          canvas.add(oImg).renderAll();
        });
      };
      reader.readAsDataURL(file);
      setOpenColor(false);
    }
    catch ({ message }) {
      console.error(message);
    }
  }

  function changeColor({ rgb: { a, r, g, b } }) {
    const color = `rgba(${r}, ${g} , ${b}, ${a})`;
    setColor(color);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set('fill', color);
      canvas.renderAll();
    }
    // TODO: implement the next line's system (basically turn scrolling off when onMouseDown)
    // body.style.overflowY = 'hidden';
    // const body = document.getElementsByTagName('body')[0];
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
      element.set({ class: 'deleted' });
      canvas.discardActiveObject().renderAll();
      setRemovedElements([...removedElements, element]);
    }
    setOpenColor(false);
  }

  return (
    <section id="editor_page">
      <div id="interface">
        {windowSize >= 1000 &&
          <div id="tool_bar">
            {colorOpen && <ColorPicker onChange={changeColor} color={color} />}
            <input onChange={addImage} ref={fileElement} type="file" id="file_editor" style={{ display: "none" }} />
            <button className="editor_button dont_deselect" onClick={() => { setOpenColor(!colorOpen); }}>
              <img className="dont_deselect" src={colorImage} alt="edirot_image" />
              <span className="dont_deselect">Color</span>
            </button>
            <button className="editor_button dont_deselect" onClick={addText}>
              <img className="dont_deselect" src={text} alt="edirot_image" />
              <span className="dont_deselect">Text</span>
            </button>
            <button className="editor_button delete" onClick={deleteElement}>
              <img src={deleteImage} alt="edirot_image" className="delete" />
              <span className="delete">Delete</span>
            </button>
            <label htmlFor="file_editor" tabIndex="0" className="dont_deselect">
              <div className="editor_button dont_deselect">
                <img src={file} alt="edirot_image" className="dont_deselect" />
                <span className="dont_deselect">File</span>
              </div>
            </label>
          </div>
        }
        <img src={arrow} alt="arrow_l" style={{ transform: 'rotate(90deg)' }} className="arrow" onClick={() => { changeImageIndex(-1); }} />
        <div id="main_photo" style={{ backgroundImage: `url('http://${domain}/static/${images[imageIndex]}')` }} >
          <canvas width="150" height="175" id="canvas_editor"></canvas>
        </div>
        <img src={arrow} alt="arrow_r" style={{ transform: 'rotate(-90deg)' }} className="arrow" onClick={() => { changeImageIndex(1); }} />
        {windowSize >= 1000 &&
          <div id="fonts_block">
            {
              fonts.map(font => <button className="font_option" key={`font_${font}`} data-font={font} style={chosenFont === font ? { fontFamily: font, border: '4px solid #197bbd' } : { fontFamily: font }} onClick={changeFont}>Text</button>)
            }
          </div>
        }
      </div>
      { windowSize < 1000 &&
        <div id="tool_bar">
          {colorOpen && <ColorPicker onChange={changeColor} color={color} />}
          <input onChange={addImage} ref={fileElement} type="file" id="file_editor" style={{ display: "none" }} />
          <button className="editor_button dont_deselect" onClick={() => { setOpenColor(!colorOpen); }}>
            <img src={colorImage} alt="edirot_image" className="dont_deselect" />
            <span className="dont_deselect">Color</span>
          </button>
          <button className="editor_button dont_deselect" onClick={addText}>
            <img src={text} alt="edirot_image" className="dont_deselect" />
            <span className="dont_deselect">Text</span>
          </button>
          <button className="editor_button dont_deselect" onClick={() => { setFontOverlay(1); }}>
            <img src={fontImage} alt="edirot_image" className="dont_deselect" />
            <span className="dont_deselect">Font</span>
          </button>
          <button className="editor_button delete" onClick={deleteElement}>
            <img src={deleteImage} alt="editor_image" className="delete" />
            <span className="delete">Delete</span>
          </button>
          <label htmlFor="file_editor" tabIndex="0" className="dont_deselect">
            <div className="dont_deselect">
              <img src={file} alt="edirot_image" className="dont_deselect" />
              <span className="dont_deselect">File</span>
            </div>
          </label>
        </div>
      }
      {
        windowSize < 1000 && fontOverlay === 1 &&
        <motion.div id="font_overlay" initial={{ opacity: 0 }} animate={{ opacity: fontOverlay }} transition={{ duration: 0.2 }} onAnimationEnd={({ target }) => { target.style.display = 'none'; }}>
          <div id="fonts_block">
            <button id="close_btn" alt="close_btn" style={{ backgroundImage: `url('${closeImageWhite}')` }} onClick={() => { setFontOverlay(0); }} />
            {
              fonts.map(font => <button className="font_option" key={`font_${font}`} data-font={font} style={chosenFont === font ? { fontFamily: font, border: '4px solid #197bbd' } : { fontFamily: font }} onClick={changeFont}>Text</button>)
            }
          </div>
        </motion.div>
      }
      <section id="editor_footer">
        <p className="price">Base price: ${basePrice.toFixed(2)}</p>
        <p className="price">Total price: ${totalPrice.toFixed(2)}</p>
        <Button click={addItemToBin}>ADD TO CART</Button>
      </section>
    </section>
  );
}

export default Editor;