import React, { Fragment, lazy, useState, Suspense, useEffect, useRef } from 'react';
import { Breadcrumbs, Button, Typography, RadioGroup, createStyles, Radio, FormControlLabel, TextField, createMuiTheme, ThemeProvider, Checkbox, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BinItemPreloaded from 'components/BinItemPreloaded';
import logo from 'img/logo.gif';
import blue_cart from 'img/blue_cart.svg';
import blue_arrow from 'img/blue_arrow.svg';
import discount from 'img/discount.svg';
import arrow from 'img/arrow.svg';
import 'css/payment.css';

const BinItem = lazy(() => import('components/BinItem'));

const styles = createStyles({
  formControlLabel: {
    fontSize: '0.8rem',
    '& label': { fontSize: '0.8rem' }
  }
});

// const radioStyles = () => ({
//   radio: {
//     '&$checked': {
//       color: '#197bbd'
//     }
//   }
// });

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#197bbd'
    }
  }
});

function Input({ label, name }) {
  return <TextField className="c_input" label={label} variant="outlined" size="small" name={name} />;
}

function Payment() {
  const { windowSize } = useSelector(state => state.windowSize);
  const [submitStyle, setSubmitStyle] = useState({ height: '65px', fontSize: '1rem', textTransform: 'none', fontWeight: 'bold', fontFamily: 'Arial' });
  const [isSummaryOpened, setSummaryOpened] = useState(false);
  const [styleForBreadCrumbs, setStyleForBreadCrumbs] = useState(null);
  const [shipping, setShipping] = useState('fs');
  const [stage, setStage] = useState(1); // stage of purchase
  const compared_h2 = useRef();
  // const classes = radioStyles();

  function openSummary() {
    setSummaryOpened(!isSummaryOpened);
  }

  function stageChanger(stageNum) {
    if (stage !== stageNum) setStage(stageNum);
  }

  function changeShipping({ target: { value } }) {
    setShipping(value);
  }

  useEffect(() => {
    // Changes a shape of a submit button
    if (windowSize < 768)
      setSubmitStyle({ height: '65px', fontSize: '1rem', textTransform: 'none', fontWeight: 'bold', fontFamily: 'Arial' });
    else
      setSubmitStyle({ height: '60px', fontSize: '.8rem', textTransform: 'none', fontWeight: 'bold', fontFamily: 'Arial' });
    // Changes a width of the bread crumbs
    if (windowSize >= 1000 && compared_h2.current !== undefined)
      setStyleForBreadCrumbs({ width: compared_h2.current.clientWidth });
    else setStyleForBreadCrumbs(null);
  }, [windowSize]);

  return (
    <div id="payment_page">
      <header id="payment_heading">
        <div id="link_block">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
      </header>
      <main>
        {windowSize < 1000 &&
          <Fragment>
            <div id="summary" tabIndex="0" onClick={openSummary} onKeyDown={openSummary}>
              <div>
                <img src={blue_cart} alt="cart" />
                <span>Show order summary</span>
                <img src={blue_arrow} alt="arrow" style={isSummaryOpened ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0)' }} />
              </div>
              <div>
                <span>{stage === 0 ? '$310.00' : shipping === 'fs' ? `$${(320 + 27.88).toFixed(2)}` : `$${(320 + 40.10).toFixed(2)}`}</span>
                <span>{stage === 0 ? '$310.00' : shipping === 'fs' ? `$${(310 + 27.88).toFixed(2)}` : `$${(310 + 40.10).toFixed(2)}`}</span>
              </div>
            </div>
            <motion.div animate={isSummaryOpened ? { height: 'auto' } : { height: 0 }} transition={{ duration: .2 }} initial={false} id="summary_items" >
              {
                new Array(3).fill(3).map((i, index) => <Suspense fallback={<BinItemPreloaded />} key={`bin_item_${index}`}><BinItem img="a_hoodie.webp" /></Suspense>)
              }
              <hr />
              <div className="info_block">
                <div><p>Subtotal</p></div>
                <div><b>$320.00</b></div>
              </div>
              <div className="info_block">
                <div>
                  <p>Discount</p>
                  <div className="additional">
                    <img src={discount} alt="discount" />
                    <p>FREE SHIPPING</p>
                  </div>
                </div>
                <div><b>- $10.00</b></div>
              </div>
              <div className="info_block">
                <div><p>Shipping</p></div>
                <div><p>{stage === 0 ? 'Calculated at next step' : shipping === 'fs' ? '$27.88' : '$40.10'}</p></div>
              </div>
              <hr />
              <div className="info_block total">
                <div><p>Total</p></div>
                <div>
                  <p>CAD</p>
                  <b>{stage === 0 ? '$310.00' : shipping === 'fs' ? `$${(310 + 27.88).toFixed(2)}` : `$${(310 + 40.10).toFixed(2)}`}</b>
                </div>
              </div>
            </motion.div>
          </Fragment>
        }
        <section id="input_sec">
          <Breadcrumbs id="bread_crumbs" style={styleForBreadCrumbs} separator={<img src={arrow} alt="arrow" style={{ transform: 'rotate(180deg)', width: '8px' }} />} aria-label="breadcrumb">
            <Link to="/cart" >Cart</Link>
            <p style={stage === 0 ? { fontWeight: 'bold' } : { color: '#197bbd', cursor: 'pointer' }} onClick={() => { stageChanger(0); }}>Information</p>
            <p style={stage === 1 ? { fontWeight: 'bold' } : null}>Shipping</p>
          </Breadcrumbs>
          <ThemeProvider theme={theme}>
            {stage === 0 &&
              <form>
                <h2 ref={compared_h2}>Contact Information</h2>
                <Input label="Email or mobile phone number" />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={<Typography style={styles.formControlLabel}>Keep me up to date on news and exclusive offers</Typography>}
                />
                <h2>Shipping address</h2>
                <div className="inline_inputs">
                  <Input label="First name" name="checkout[shipping_address][first_name]" />
                  <div className="gap" />
                  <Input label="Last name" name="checkout[shipping_address][last_name]" />
                </div>
                <Input label="Address" name="checkout[shipping_address][address1]" />
                <Input label="Apartment, suite, etc. (optional)" name="checkout[shipping_address][address2]" />
                <Input label="City" name="checkout[shipping_address][city]" />
                <div className="inline_inputs">
                  <FormControl variant="outlined" className="c_input" size="small">
                    <InputLabel id="demo-simple-select-outlined-label">Country</InputLabel>
                    <Select labelId="demo-simple-select-outlined-label" value="none" label="Country">
                      <MenuItem value="none">---</MenuItem>
                      <MenuItem value="usa">the USA</MenuItem>
                      <MenuItem value="canada">Canada</MenuItem>
                      <MenuItem value="ukraine">Ukraine</MenuItem>
                    </Select>
                  </FormControl>
                  <div className="gap" />
                  <Input label="Postal code" />
                </div>
                <Button type="submit" onClick={e => { e.preventDefault(); }} className="c_input submit_btn" variant="contained" size="medium" color="primary" style={submitStyle}>Continue to shipping</Button>
              </form>
            }
            {stage === 1 &&
              <div id="second_stage">
                <div id="change_info">
                  <div className="change_info_option">
                    <div className="change_info_heading">
                      <span>Contact</span>
                      <span onClick={() => { stageChanger(0); }}>Change</span>
                    </div>
                    <address>someEmail@gmail.com</address>
                  </div>
                  <hr />
                  <div className="change_info_option">
                    <div className="change_info_heading">
                      <span>Ship to</span>
                      <span onClick={() => { stageChanger(0) }}>Change</span>
                    </div>
                    <address>Ulitsa shorca, Киев, 472758, Ukraine</address>
                  </div>
                </div>
                <h2>Shipping to</h2>
                <RadioGroup name="gender1" value={shipping} onChange={changeShipping}>
                  <div id="choose_shipping">
                    <div className="change_info_option">
                      <Radio value="fs" color="primary" name="shipping" />
                      <div className="change_shipping_info">
                        <span className="shipping_name">Canada Post Small Packet International Surface</span>
                        <span className="shipping_time">28 to 84 business days</span>
                      </div>
                      <span className="price">$27.88</span>
                    </div>
                    <hr />
                    <div className="change_info_option">
                      <Radio value="ss" color="primary" name="shipping" />
                      <div className="change_shipping_info">
                        <span className="shipping_name">Canada Post Small Packet International Air</span>
                        <span className="shipping_time">6 to 12 business days</span>
                      </div>
                      <span className="price">$40.10</span>
                    </div>
                  </div>
                </RadioGroup>
                <Button type="submit" onClick={e => { e.preventDefault(); }} className="c_input submit_btn" variant="contained" size="medium" color="primary" style={submitStyle}>Continue to shipping</Button>
              </div>
            }
          </ThemeProvider>
          {windowSize >= 1000 &&
            <footer>
              <hr />
              <p>All rights reserved Peaceful Disruption</p>
            </footer>
          }
        </section>
        {windowSize >= 1000 &&
          <section id="summary_items" >
            {
              new Array(3).fill(3).map((i, index) => <Suspense fallback={<BinItemPreloaded />} key={`bin_item_${index}`}><BinItem img="a_hoodie.webp" /></Suspense>)
            }
            <hr />
            <div className="info_block">
              <div><p>Subtotal</p></div>
              <div><b>$320.00</b></div>
            </div>
            <div className="info_block">
              <div>
                <p>Discount</p>
                <div className="additional">
                  <img src={discount} alt="discount" />
                  <p>FREE SHIPPING</p>
                </div>
              </div>
              <div><b>- $10.00</b></div>
            </div>
            <div className="info_block">
              <div><p>Shipping</p></div>
              <div><p>Calculated at next step</p></div>
            </div>
            <hr />
            <div className="info_block total">
              <div><p>Total</p></div>
              <div>
                <p>CAD</p>
                <b>{stage === 0 ? '$310.00' : shipping === 'fs' ? `$${(310 + 27.88).toFixed(2)}` : `$${(310 + 40.10).toFixed(2)}`}</b>
              </div>
            </div>
          </section>
        }
      </main>
      { windowSize < 1000 &&
        <footer>
          <hr />
          <p>All rights reserved Peaceful Disruption</p>
        </footer>
      }
    </div>
  );
}

export default Payment;
