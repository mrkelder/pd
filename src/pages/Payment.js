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
import axios from 'axios';

const BinItem = lazy(() => import('components/BinItem'));

const styles = createStyles({
  formControlLabel: {
    fontSize: '0.8rem',
    '& label': { fontSize: '0.8rem' }
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#197bbd'
    }
  }
});

function Input({ label, name, onChange, value, error }) {
  return <TextField className="c_input" error={error} value={value} onChange={onChange} label={label} variant="outlined" size="small" name={name} />;
}

function BreadCrumb({ children, status, index, stageChanger }) {
  return <p style={status ? { color: '#197bbd', cursor: 'pointer' } : { fontWeight: 'bold' }} onClick={() => { if (status) stageChanger(index); }}>{children}</p>;
}

function Payment() {
  const { windowSize } = useSelector(state => state.windowSize);
  const [submitStyle, setSubmitStyle] = useState({ height: '65px', fontSize: '1rem', textTransform: 'none', fontWeight: 'bold', fontFamily: 'Arial' });
  const [isSummaryOpened, setSummaryOpened] = useState(false);
  const [styleForBreadCrumbs, setStyleForBreadCrumbs] = useState(null); // width for bread crumbs
  const [allCountries, setAllCountries] = useState([]); // list of countries to select
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  /********************* Input management *********************/
  const [shipping, setShipping] = useState('fs');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [optional, setOptional] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [chosenCountry, setChosenCountry] = useState('none');
  /********************* Validation statuses *********************/
  const [emailE, setEmailE] = useState(false);
  const [fNameE, setFNameE] = useState(false);
  const [lNameE, setLNameE] = useState(false);
  const [addressE, setAddressE] = useState(false);
  const [cityE, setCityE] = useState(false);
  const [countryE, setCountryE] = useState(false);
  const [postalE, setPostalE] = useState(false);
  /********************* Compared elements for bread crubms' width *********************/
  const compared_h2 = useRef();
  const compared_radio = useRef();
  /********************* Stage managers *********************/
  const [stage, setStage] = useState(0); // stage of purchase
  const [informationStage, setInformationStage] = useState(true);
  const [shippingStage, setShippingStage] = useState(false);
  const [paymentStage, setPaymentStage] = useState(false);

  function openSummary() {
    setSummaryOpened(!isSummaryOpened);
  }

  function stageChanger(stageNum) {
    if (stage !== stageNum) setStage(stageNum);
  }

  function changeShipping({ target: { value } }) {
    setShipping(value);
  }

  function changeCountry({ target: { value } }) {
    setChosenCountry(value);
  }

  function checkInputs() {
    if (re.test(email)) setEmailE(false);
    else {
      setEmailE(true);
      return false;
    }

    if ([...firstName].length > 0) setFNameE(false);
    else {
      setFNameE(true);
      return false;
    }

    if ([...lastName].length > 0) setLNameE(false);
    else {
      setLNameE(true);
      return false;
    }

    if ([...address].length > 0) setAddressE(false);
    else {
      setAddressE(true);
      return false;
    }

    if ([...city].length > 1) setCityE(false);
    else {
      setCityE(true);
      return false;
    }

    if (chosenCountry !== 'none') setCountryE(false);
    else {
      setCountryE(true);
      return false;
    }

    if ([...postalCode].length > 0) setPostalE(false);
    else {
      setPostalE(true);
      return false;
    }

    return true;
  }

  function nextStage() {
    if (checkInputs() && stage === 0) {
      setStage(1);
      setShippingStage(true);
    }
  }

  useEffect(() => {
    // Changes a shape of a submit button
    if (windowSize < 768)
      setSubmitStyle({ height: '65px', fontSize: '1rem', textTransform: 'none', fontWeight: 'bold', fontFamily: 'Arial' });
    else
      setSubmitStyle({ height: '60px', fontSize: '.8rem', textTransform: 'none', fontWeight: 'bold', fontFamily: 'Arial' });
    // Changes a width of the bread crumbs
    if (windowSize >= 1000 && compared_h2.current !== undefined && stage === 0)
      setStyleForBreadCrumbs({ width: compared_h2.current.clientWidth });
    else if (windowSize >= 1000 && compared_radio.current !== undefined && stage === 1)
      setStyleForBreadCrumbs({ width: compared_radio.current.clientWidth });
    else setStyleForBreadCrumbs(null);
  }, [windowSize, stage]);

  useEffect(() => {
    // Fetches all countries
    async function fetchData() {
      const { data } = await axios.get('https://restcountries.eu/rest/v2/all?fields=name');
      setAllCountries(data);
    }
    fetchData();
  }, []);

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
            <BreadCrumb status={informationStage} stageChanger={stageChanger} index={0}>Information</BreadCrumb>
            <BreadCrumb status={shippingStage} stageChanger={stageChanger} index={1}>Shipping</BreadCrumb>
            <BreadCrumb status={paymentStage} stageChanger={stageChanger} index={2}>Payment</BreadCrumb>
          </Breadcrumbs>
          <ThemeProvider theme={theme}>
            {stage === 0 &&
              <form name="shipping">
                <h2 ref={compared_h2}>Contact Information</h2>
                <Input name="shippingEmail" value={email} error={emailE} onChange={({ target: { value } }) => { setEmail(value) }} label="Email" />
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
                  <Input value={firstName} error={fNameE} onChange={({ target: { value } }) => { setFirstName(value) }} label="First name" name="checkout[shipping_address][first_name]" />
                  <div className="gap" />
                  <Input value={lastName} error={lNameE} onChange={({ target: { value } }) => { setLastName(value) }} label="Last name" name="checkout[shipping_address][last_name]" />
                </div>
                <Input value={address} error={addressE} onChange={({ target: { value } }) => { setAddress(value) }} label="Address" name="checkout[shipping_address][address1]" />
                <Input value={optional} onChange={({ target: { value } }) => { setOptional(value) }} label="Apartment, suite, etc. (optional)" name="checkout[shipping_address][address2]" />
                <Input value={city} error={cityE} onChange={({ target: { value } }) => { setCity(value) }} label="City" name="checkout[shipping_address][city]" />
                <div className="inline_inputs">
                  <FormControl variant="outlined" className="c_input" size="small">
                    <InputLabel id="demo-simple-select-outlined-label">Country</InputLabel>
                    <Select error={countryE} onChange={changeCountry} labelId="demo-simple-select-outlined-label" value={chosenCountry} label="Country">
                      <MenuItem value="none">---</MenuItem>
                      {
                        allCountries.map(({ name }) => <MenuItem value={name.toLowerCase()} key={name}>{name}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                  <div className="gap" />
                  <Input value={postalCode} error={postalE} onChange={({ target: { value } }) => { setPostalCode(value) }} label="Postal code" />
                </div>
                <Button type="submit" onClick={e => { e.preventDefault(); nextStage(); }} className="c_input submit_btn" variant="contained" size="medium" color="primary" style={submitStyle}>Continue to shipping</Button>
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
                    <address>{email}</address>
                  </div>
                  <hr />
                  <div className="change_info_option">
                    <div className="change_info_heading">
                      <span>Ship to</span>
                      <span onClick={() => { stageChanger(0) }}>Change</span>
                    </div>
                    <address>{address}, {city}, {postalCode}, {chosenCountry[0].toUpperCase()}{[...chosenCountry].filter((i, index) => index !== 0)}</address>
                  </div>
                </div>
                <h2 ref={compared_radio}>Shipping to</h2>
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
