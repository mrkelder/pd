import React, { Fragment, useContext, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { infoContext } from 'app/context';
import Button from 'components/Button';
import ItemPreloaded from 'components/ItemPreloaded';
import ImgNotFound from 'img/imageNotFound.png';
import fb from 'img/fb.svg';
import tw from 'img/twitter.svg';
import pt from 'img/pinterest.svg';
import close from 'img/close.svg';
import arrow from 'img/arrow.svg';
import 'css/itemPage.css';
const Item = lazy(() => import('components/Item'));

// TODO: "Add to cart" system (put off for the next version)

function ItemPage() {
  const { push } = useHistory();
  const { windowSize } = useSelector(state => state.windowSize);
  const payPalButton = useRef(); // ref to PayPal button
  const mainPhoto = useRef();
  const firstPhoto = useRef();
  const secondPhoto = useRef();
  const domain = useContext(infoContext);
  const [buttonPlaced, setButtonPlaced] = useState(false); // whether PayPal button has appeared or not
  const [isZoomShown, setZoomShown] = useState(false); // turns on/off bigger version of images
  const allPhotos = ['a_hoodie.webp', 'a_hoodie_back.webp']; // all photos for an item (one or two)
  const [photoIndex, setPhotoIndex] = useState(0); // index of current picked photo
  const [size, setSize] = useState('xs');
  const [color, setColor] = useState('Black');

  function changePhotoIndex(number) {
    if (allPhotos.length - 1 < photoIndex + number) setPhotoIndex(0);
    else if (photoIndex + number < 0) setPhotoIndex(allPhotos.length - 1);
    else setPhotoIndex(photoIndex + number);
  }

  function showZoom() {
    // Shows/hides a big version of the images
    if (isZoomShown) payPalButton.current.style = 'block';
    else payPalButton.current.style = 'none';
    setZoomShown(!isZoomShown);
  }

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    // The main photo is not loaded
    const mainPhotoImg = mainPhoto.current;
    if (mainPhotoImg) {
      mainPhotoImg.addEventListener('error', () => {
        mainPhotoImg.src = ImgNotFound;
      });
    }
  }, [mainPhoto]);

  useEffect(() => {
    // The first photo is not loaded
    const firstPhotoImg = firstPhoto.current;
    if (firstPhotoImg) {
      firstPhotoImg.addEventListener('error', () => {
        firstPhotoImg.src = ImgNotFound;
      });
    }
  }, [firstPhoto]);

  useEffect(() => {
    // The second photo is not loaded
    const secondPhotoImg = secondPhoto.current;
    if (secondPhotoImg) {
      secondPhotoImg.addEventListener('error', () => {
        secondPhotoImg.src = ImgNotFound;
      });
    }
  }, [secondPhoto]);

  useEffect(() => {
    if (window.paypal && !buttonPlaced) {
      // Adds PayPal quick payment button
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'black',
          shape: 'rect',
          label: 'paypal',
          height: 46
        }
      }).render('#paypal-button-container');
      setButtonPlaced(true);
    }
  }, [buttonPlaced]);

  return (
    <Fragment>
      <div id="item_page">
        {
          windowSize < 768 ?
            <Fragment>
              <div id="bread_crumbs">
                <Link to="/">Home</Link>
                <span className="arrow">{'>'}</span>
                <span>Awesome hoodie</span>
              </div>
              <img src={`http://${domain}/static/${allPhotos[photoIndex]}`} ref={mainPhoto} alt="hoodie" id="main_photo" />
              {allPhotos.length > 1 &&
                <div id="choose_photo">
                  <img className="change_photo" src={`http://${domain}/static/${allPhotos[0]}`} ref={firstPhoto} alt="change_photo" onClick={() => { setPhotoIndex(0) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(0) }} />
                  <img className="change_photo" src={`http://${domain}/static/${allPhotos[1]}`} ref={secondPhoto} alt="change_photo" onClick={() => { setPhotoIndex(1) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(1) }} />
                </div>
              }
              <span id="name">AWESOME HOODIE</span>
              <span id="price">$40.00</span>
              <div id="type">
                <div className="option">
                  <span>Size</span>
                  <select value={size} onChange={({ target: { value } }) => { setSize(value); }}>
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                  </select>
                </div>
                <div className="option">
                  <span>Color</span>
                  <select value={color} onChange={({ target: { value } }) => { setColor(value); }}>
                    <option value="black" checked="checked">Black</option>
                    <option value="white">White</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>
              <Button>ADD TO CART</Button>
              <Button click={() => { push('/editor'); }}>CREATE YOUR OWN STYLE</Button>
              <div id="paypal-button-container"></div>
              <Link id="more_payment" to="/payment">More payment options</Link>
              <div id="social_medias">
                <a target="_blank" rel="noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2Fshuga.muga.9%2Fposts%2F786125581939519%3F__cft__%255B0%255D%3DAZVH0A9IrPRT_Vj1uwDyvls4gPopGGXBIiI4BX0l1IhAvxZQh8nwXo3IVg8C0_Y0Tqg549X6KrQ-qZMQVT8PyX2ALka8JsJ9pDN2hSJOuZr-cSwD9CjHhJXEbBlLsteh8c8%26__tn__%3D%252CO%252CP-R&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore social_media">
                  <img src={fb} alt="media" />
                  <span>Share</span>
                </a>
                <a className="social_media" href="https://twitter.com/KelderVlad/status/1343553347375271937" target="_blank" rel="noreferrer">
                  <img src={tw} alt="media" />
                  <span>Tweet</span>
                </a>
                <a className="social_media" tabIndex="0" data-pin-url="https://pin.it/2QyLzV9" data-pin-custom="false" href="https://www.pinterest.com/pin/create/button/" data-pin-do="buttonBookmark">
                  <img src={pt} alt="media" />
                  <span>Pin it</span>
                </a>
              </div>
              <div id="may_like">
                <h3>You may also like</h3>
                <div id="posts">
                  {
                    new Array(4).fill(20).map((i, index) =>
                      <Suspense key={`hoodie_${index}`} fallback={<ItemPreloaded type="small" />}>
                        <Item type="small" price={40} name="Awesome hoodie" img="a_hoodie.webp" />
                      </Suspense>)
                  }
                </div>
              </div>
            </Fragment>
            :
            <Fragment>
              <div id="bread_crumbs">
                <Link to="/">Home</Link>
                <span className="arrow">{'>'}</span>
                <span>Awesome hoodie</span>
              </div>
              <div id="info">
                <div id="photos">
                  <img onClick={showZoom} ref={mainPhoto} src={`http://${domain}/static/${allPhotos[photoIndex]}`} alt="hoodie" id="main_photo" />
                  {allPhotos.length > 1 &&
                    <div id="choose_photo">
                      <img className="change_photo" src={`http://${domain}/static/${allPhotos[0]}`} ref={firstPhoto} alt="change_photo" onClick={() => { setPhotoIndex(0) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(0) }} />
                      <img className="change_photo" src={`http://${domain}/static/${allPhotos[1]}`} ref={secondPhoto} alt="change_photo" onClick={() => { setPhotoIndex(1) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(1) }} />
                    </div>
                  }
                </div>
                <div id="info_block">
                  <span id="name">AWESOME HOODIE</span>
                  <span id="price">$40.00</span>
                  <div id="type">
                    <div className="option">
                      <span>Size</span>
                      <select value={size} onChange={({ target: { value } }) => { setSize(value); }}>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                      </select>
                    </div>
                    <div className="option">
                      <span>Color</span>
                      <select value={color} onChange={({ target: { value } }) => { setColor(value); }}>
                        <option value="black" checked="checked">Black</option>
                        <option value="white">White</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                  </div>
                  <Button>ADD TO CART</Button>
                  <Button click={() => { push('/editor'); }}>CREATE YOUR OWN STYLE</Button>
                  <div id="paypal-button-container" ref={payPalButton}></div>
                  <Link id="more_payment" to="/payment">More payment options</Link>
                  <div id="social_medias">
                    <a target="_blank" rel="noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2Fshuga.muga.9%2Fposts%2F786125581939519%3F__cft__%255B0%255D%3DAZVH0A9IrPRT_Vj1uwDyvls4gPopGGXBIiI4BX0l1IhAvxZQh8nwXo3IVg8C0_Y0Tqg549X6KrQ-qZMQVT8PyX2ALka8JsJ9pDN2hSJOuZr-cSwD9CjHhJXEbBlLsteh8c8%26__tn__%3D%252CO%252CP-R&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore social_media">
                      <img src={fb} alt="media" />
                      <span>Share</span>
                    </a>
                    <a className="social_media" href="https://twitter.com/KelderVlad/status/1343553347375271937" target="_blank" rel="noreferrer">
                      <img src={tw} alt="media" />
                      <span>Tweet</span>
                    </a>
                    <a className="social_media" tabIndex="0" data-pin-url="https://pin.it/2QyLzV9" data-pin-custom="false" href="https://www.pinterest.com/pin/create/button/" data-pin-do="buttonBookmark">
                      <img src={pt} alt="media" />
                      <span>Pin it</span>
                    </a>
                  </div>
                </div>
              </div>
              <div id="may_like">
                <h3>You may also like</h3>
                <div id="posts">
                  {
                    new Array(4).fill(20).map((i, index) =>
                      <Suspense key={`hoodie_${index}`} fallback={<ItemPreloaded type="small" />}>
                        <Item type="small" price={40} name="Awesome hoodie" img="a_hoodie.webp" />
                      </Suspense>)
                  }
                </div>
              </div>
            </Fragment>
        }
      </div>
      { isZoomShown && windowSize >= 768 &&
        <div id="zoom">
          <button style={{ backgroundImage: `url('${close}')` }} id="close_btn" onClick={showZoom} />
          <button style={{ backgroundImage: `url('${arrow}')` }} className="arrow_btn" onClick={() => { changePhotoIndex(-1) }} />
          <img src={`http://${domain}/static/${allPhotos[photoIndex]}`} alt="hoodie" id="zoom_photo" />
          <button style={{ backgroundImage: `url('${arrow}')`, transform: 'rotate(180deg)' }} className="arrow_btn" onClick={() => { changePhotoIndex(1) }} />
        </div>
      }
    </Fragment>
  );
}

export default ItemPage;
