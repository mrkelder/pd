import React, { Fragment, useContext, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { infoContext } from 'app/context';
import Button from 'components/Button';
import ItemPreloaded from 'components/ItemPreloaded';
import ImgNotFound from 'img/imageNotFound.png';
import fb from 'img/fb.svg';
import tw from 'img/twitter.svg';
import pt from 'img/pinterest.svg';
import close from 'img/close.svg';
import arrow from 'img/arrow.svg';
import axios from 'axios';
import 'css/itemPage.css';
const Item = lazy(() => import('components/Item'));

function ItemPage() {
  const { id: itemId } = useParams();
  const { push } = useHistory();
  const { windowSize } = useSelector(state => state.windowSize);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const payPalButton = useRef(); // ref to PayPal button
  const mainPhoto = useRef();
  const firstPhoto = useRef();
  const secondPhoto = useRef();
  const domain = useContext(infoContext);
  const [buttonPlaced, setButtonPlaced] = useState(false); // whether PayPal button has appeared or not
  const [isZoomShown, setZoomShown] = useState(false); // turns on/off bigger version of images
  const allPhotos = ['a_hoodie.webp', 'a_hoodie_back.webp']; // all photos for an item (one or two)
  const [photoIndex, setPhotoIndex] = useState(0); // index of current picked photo
  const [size, setSize] = useState(undefined);
  const [color, setColor] = useState(undefined);
  const [item, setItem] = useState(null); // item's object
  const [error, setError] = useState(false);

  function addItemToCart() {
    dispatch({ type: "cart/pushElement", payload: { ...item, size, color } });
  }

  function changePhotoIndex(number) {
    if (allPhotos.length - 1 < photoIndex + number) setPhotoIndex(0);
    else if (photoIndex + number < 0) setPhotoIndex(allPhotos.length - 1);
    else setPhotoIndex(photoIndex + number);
  }

  function showZoom() {
    // Shows/hides a big version of the images
    if (item.photos.length > 1) {
      if (isZoomShown) payPalButton.current.style = 'block';
      else payPalButton.current.style = 'none';
      setZoomShown(!isZoomShown);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://${domain}/getItem`, { params: { type: itemId } });
        setItem(data[0]);
        setSize(data[0].size[0]);
        setColor(data[0].color[0]);
      }
      catch ({ message }) {
        console.error(message);
        setError(true);
      }
    }
    fetchData();
  }, [domain, itemId, push]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [itemId]);

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
      { !error ?
        <Fragment>
          <div id="item_page">
            {
              windowSize < 768 ?
                <Fragment>
                  <div id="bread_crumbs">
                    <Link to="/">Home</Link>
                    <span className="arrow">{'>'}</span>
                    <span>{item === null ? "Loading..." : item.name}</span>
                  </div>
                  <img src={item === null ? ImgNotFound : `http://${domain}/static/${item.photos[photoIndex]}`} ref={mainPhoto} alt="hoodie" id="main_photo" />
                  {item !== null && item.photos.length > 1 &&
                    <div id="choose_photo">
                      <img className="change_photo" src={`http://${domain}/static/${item.photos[0]}`} ref={firstPhoto} alt="change_photo" onClick={() => { setPhotoIndex(0) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(0) }} />
                      <img className="change_photo" src={`http://${domain}/static/${item.photos[1]}`} ref={secondPhoto} alt="change_photo" onClick={() => { setPhotoIndex(1) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(1) }} />
                    </div>
                  }
                  <span id="name">{item === null ? "Loading..." : item.name.toUpperCase()}</span>
                  <span id="price">{item === null ? "Loading" : `$${item.price.toFixed(2)}`}</span>
                  <div id="type">
                    <div className="option">
                      <span>Size</span>
                      <select value={size} onChange={({ target: { value } }) => { setSize(value); }}>
                        {item !== null &&
                          item.size.map(size => <option key={`size_${size}`} value={size}>{size}</option>)
                        }
                        {item === null &&
                          <option>...</option>
                        }
                      </select>
                    </div>
                    <div className="option">
                      <span>Color</span>
                      <select value={color} onChange={({ target: { value } }) => { setColor(value); }}>
                        {item !== null &&
                          item.color.map(color => <option key={`color_${color}`} value={color}>{color}</option>)
                        }
                        {item === null &&
                          <option>...</option>
                        }
                      </select>
                    </div>
                  </div>
                  <Button click={addItemToCart}>{item !== null && items.findIndex(i => i._id === item._id) !== -1 ? 'IN THE CART' : 'ADD TO CART'}</Button>
                  <Button click={() => { push('/editor'); dispatch({ type: "editor/changeItem", payload: item }); }}>CREATE YOUR OWN STYLE</Button>
                  <div id="paypal-button-container"></div>
                  <Link id="more_payment" to="/payment">More payment options</Link>
                  <div id="social_medias">
                    <a target="_blank" rel="noreferrer" href={item === null ? "https://facebook.com/" : item.links.fb} className="fb-xfbml-parse-ignore social_media">
                      <img src={fb} alt="media" />
                      <span>Share</span>
                    </a>
                    <a className="social_media" href={item === null ? "https://twitter.com/" : item.links.tw} target="_blank" rel="noreferrer">
                      <img src={tw} alt="media" />
                      <span>Tweet</span>
                    </a>
                    <a className="social_media" target="_blank" rel="noreferrer" tabIndex="0" href={item === null ? "https://pinterest.com/" : item.links.pin}>
                      <img src={pt} alt="media" />
                      <span>Pin it</span>
                    </a>
                  </div>
                  <div id="may_like">
                    <h3>You may also like</h3>
                    <div id="posts">
                      {item !== null &&
                        item.similar.map((_id, index) =>
                          <Suspense key={`hoodie_${index}`} fallback={<ItemPreloaded type="small" />}>
                            <Item _id={_id} type="small" loadSelf />
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
                    <span>{item === null ? "Loading..." : item.name}</span>
                  </div>
                  <div id="info">
                    <div id="photos">
                      <img src={item === null ? ImgNotFound : `http://${domain}/static/${item.photos[photoIndex]}`} ref={mainPhoto} style={item !== null && item.photos.length > 1 ? { cursor: "zoom-in" } : { cursor: "auto" }} alt="hoodie" id="main_photo" onClick={showZoom} />
                      {item !== null && item.photos.length > 1 &&
                        <div id="choose_photo">
                          <img className="change_photo" src={`http://${domain}/static/${item.photos[0]}`} ref={firstPhoto} alt="change_photo" onClick={() => { setPhotoIndex(0) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(0) }} />
                          <img className="change_photo" src={`http://${domain}/static/${item.photos[1]}`} ref={secondPhoto} alt="change_photo" onClick={() => { setPhotoIndex(1) }} tabIndex="0" onKeyDown={() => { setPhotoIndex(1) }} />
                        </div>
                      }
                    </div>
                    <div id="info_block">
                      <span id="name">{item === null ? "Loading..." : item.name.toUpperCase()}</span>
                      <span id="price">{item === null ? "Loading" : `$${item.price.toFixed(2)}`}</span>
                      <div id="type">
                        <div className="option">
                          <span>Size</span>
                          <select value={size} onChange={({ target: { value } }) => { setSize(value); }}>
                            {item !== null &&
                              item.size.map(size => <option key={`size_${size}`} value={size}>{size}</option>)
                            }
                            {item === null &&
                              <option>...</option>
                            }
                          </select>
                        </div>
                        <div className="option">
                          <span>Color</span>
                          <select value={color} onChange={({ target: { value } }) => { setColor(value); }}>
                            {item !== null &&
                              item.color.map(color => <option key={`color_${color}`} value={color}>{color}</option>)
                            }
                            {item === null &&
                              <option>...</option>
                            }
                          </select>
                        </div>
                      </div>
                      <Button click={addItemToCart}>{item !== null && items.findIndex(i => i._id === item._id) !== -1 ? 'IN THE CART' : 'ADD TO CART'}</Button>
                      <Button click={() => { push('/editor'); dispatch({ type: "editor/changeItem", payload: item }); }}>CREATE YOUR OWN STYLE</Button>
                      <div id="paypal-button-container" ref={payPalButton}></div>
                      <Link id="more_payment" to="/payment">More payment options</Link>
                      <div id="social_medias">
                        <a target="_blank" rel="noreferrer" href={item === null ? "https://facebook.com/" : item.links.fb} className="fb-xfbml-parse-ignore social_media">
                          <img src={fb} alt="media" />
                          <span>Share</span>
                        </a>
                        <a className="social_media" href={item === null ? "https://twitter.com/" : item.links.tw} target="_blank" rel="noreferrer">
                          <img src={tw} alt="media" />
                          <span>Tweet</span>
                        </a>
                        <a className="social_media" target="_blank" rel="noreferrer" tabIndex="0" href={item === null ? "https://pinterest.com/" : item.links.pin}>
                          <img src={pt} alt="media" />
                          <span>Pin it</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div id="may_like">
                    <h3>You may also like</h3>
                    <div id="posts">
                      {item !== null &&
                        item.similar.map((_id, index) =>
                          <Suspense key={`hoodie_${index}`} fallback={<ItemPreloaded type="small" />}>
                            <Item _id={_id} type="small" loadSelf />
                          </Suspense>)
                      }
                    </div>
                  </div>
                </Fragment>
            }
          </div>
          {isZoomShown && windowSize >= 768 &&
            <div id="zoom">
              <button style={{ backgroundImage: `url('${close}')` }} id="close_btn" onClick={showZoom} />
              <button style={{ backgroundImage: `url('${arrow}')` }} className="arrow_btn" onClick={() => { changePhotoIndex(-1) }} />
              {item !== null && <img src={`http://${domain}/static/${item.photos[photoIndex]}`} alt="hoodie" id="zoom_photo" />}
              <button style={{ backgroundImage: `url('${arrow}')`, transform: 'rotate(180deg)' }} className="arrow_btn" onClick={() => { changePhotoIndex(1) }} />
            </div>
          }
        </Fragment>
        :
        <h1 id="h1_error">Link is invalid</h1>
      }
    </Fragment>
  );
}

export default ItemPage;
