import React, { Fragment, useContext, useEffect, useState } from 'react';
import 'css/itemPage.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { infoContext } from 'app/context';
import Button from 'components/Button';
import fb from 'img/fb.svg';
import tw from 'img/twitter.svg';
import pt from 'img/pinterest.svg';
import Item from 'components/Item';


function ItemPage() {
  const { windowSize } = useSelector(state => state.windowSize);
  const domain = useContext(infoContext);
  const [buttonPlaced, setButtonPlaced] = useState(false);

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
    <div id="item_page">
      {
        windowSize < 768 ?
          <Fragment>
            <div id="bread_crumbs">
              <Link to="/">Home</Link>
              <span className="arrow">{'>'}</span>
              <span>Awesome hoodie</span>
            </div>
            <img src={`http://${domain}/static/a_hoodie.webp`} alt="hoodie" id="main_photo" />
            <span id="name">Awesome hoodie</span>
            <span id="price">$40.00</span>
            <div id="type">
              <div className="option">
                <span>Size</span>
                <select>
                  <option value="xs" checked="checked">XS</option>
                  <option value="s">S</option>
                  <option value="m">M</option>
                  <option value="l">L</option>
                  <option value="xl">XL</option>
                </select>
              </div>
              <div className="option">
                <span>Color</span>
                <select>
                  <option value="black" checked="checked">Black</option>
                  <option value="white">White</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
            </div>
            <Button>ADD TO CART</Button>
            <Button>CREATE YOUR OWN STYLE</Button>
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
              <a className="social_media" data-pin-url="https://pin.it/2QyLzV9" data-pin-custom="false" href="https://www.pinterest.com/pin/create/button/" data-pin-do="buttonBookmark">
                <img src={pt} alt="media" />
                <span>Pin it</span>
              </a>
            </div>
            <div id="may_like">
              <h3>You may also like</h3>
              <div id="posts">
                <Item />
                <Item />
                <Item />
              </div>
            </div>
          </Fragment>
          :
          <Fragment></Fragment>
      }
    </div>
  );
}

export default ItemPage;
