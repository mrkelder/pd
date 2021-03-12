import React, { Fragment, lazy, useState, Suspense, useEffect, useRef } from 'react';
import { Breadcrumbs, Button, Typography, RadioGroup, createStyles, Radio, FormControlLabel, TextField, createMuiTheme, ThemeProvider, Checkbox, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@material-ui/core';
import { motion } from 'framer-motion';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BinItemPreloaded from 'components/BinItemPreloaded';
import CheckoutForm from 'components/CheckoutForm';
import logo from 'img/logo.gif';
import blue_cart from 'img/blue_cart.svg';
import blue_arrow from 'img/blue_arrow.svg';
import discount from 'img/discount.svg';
import arrow from 'img/arrow.svg';
import card_img from 'img/card.svg';
import cards from 'img/cards.PNG';
import paypal_img from 'img/paypal.png';
import successImg from 'img/success.png';
import failImg from 'img/fail.png';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import 'css/payment.css';

// TODO: don't forget that after a successful purchase you have to add +1 to all bought items' filds called "bought"

const stripePromise = loadStripe('pk_test_51IC5ZBADb9E0nwKcSjPJqFvgMJRktxAc2r1kRVaQe8sBB1tq05TVRX2RtfHUBWgBsNObX8Sn4y7YbU6NvD33anYf00ark0zPfX');

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
  return <TextField className="c_input" error={error} value={value} onChange={onChange} label={label} variant="outlined" size="small" name={name} style={{ backgroundColor: 'white' }} />;
}

function BreadCrumb({ children, status, index, stageChanger }) {
  return <p style={status ? { color: '#197bbd', cursor: 'pointer' } : { fontWeight: 'bold' }} onClick={() => { if (status) stageChanger(index); }}>{children}</p>;
}

function Payment() {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const [purchaseWaiting, setPurchaseWaiting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [submitStyle, setSubmitStyle] = useState({ height: '65px', fontSize: '1rem', textTransform: 'none', fontWeight: 'bold', fontFamily: 'Arial' });
  const [isSummaryOpened, setSummaryOpened] = useState(false);
  const [styleForBreadCrumbs, setStyleForBreadCrumbs] = useState(null); // width for bread crumbs
  const [allCountries, setAllCountries] = useState([]); // list of countries to select
  const [subTotal, setSubTotal] = useState(0);
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  /********************* Redux state *********************/
  const { windowSize } = useSelector(state => state.windowSize);
  const { items, sIns } = useSelector(state => state.cart);
  const { billingAddress: billingAd, shippingType, paymentType, currentStage, shippingStage: sSRedux, paymentStage: pSRedux, keepUp, info: { aD, city: reduxCity, country, email: reduxEmail, fN, lN, optional: reduxOptional, postal }, addBA: { fN: fNAd, lN: lNAd, aD: aDAd, optional: oAd, city: cAd, country: counAd, postal: pAd } } = useSelector(state => state.payment);
  /********************* Input management *********************/
  const [shipping, setShipping] = useState(shippingType);
  const [email, setEmail] = useState(reduxEmail);
  const [firstName, setFirstName] = useState(fN);
  const [lastName, setLastName] = useState(lN);
  const [address, setAddress] = useState(aD);
  const [optional, setOptional] = useState(reduxOptional);
  const [city, setCity] = useState(reduxCity);
  const [postalCode, setPostalCode] = useState(postal);
  const [chosenCountry, setChosenCountry] = useState(country);
  const [newsCheckbox, setNewsCheckbox] = useState(keepUp);
  const [paymentSystem, setPaymentSystem] = useState(paymentType);
  const [billingAddress, setBillingAddress] = useState(billingAd);
  /********************* Billing address management *********************/
  const [firstNameAd, setFirstNameAd] = useState(fNAd);
  const [lastNameAd, setLastNameAd] = useState(lNAd);
  const [addressAd, setAddressAd] = useState(aDAd);
  const [optionalAd, setOptionalAd] = useState(oAd);
  const [cityAd, setCityAd] = useState(cAd);
  const [postalCodeAd, setPostalCodeAd] = useState(pAd);
  const [chosenCountryAd, setChosenCountryAd] = useState(counAd);
  /********************* Billing validation statuses *********************/
  const [fNameEAd, setFNameEAd] = useState(false);
  const [lNameEAd, setLNameEAd] = useState(false);
  const [addressEAd, setAddressEAd] = useState(false);
  const [cityEAd, setCityEAd] = useState(false);
  const [countryEAd, setCountryEAd] = useState(false);
  /********************* Validation statuses *********************/
  const [emailE, setEmailE] = useState(false);
  const [fNameE, setFNameE] = useState(false);
  const [lNameE, setLNameE] = useState(false);
  const [addressE, setAddressE] = useState(false);
  const [cityE, setCityE] = useState(false);
  const [countryE, setCountryE] = useState(false);
  /********************* Compared elements for bread crubms' width *********************/
  const compared_h2 = useRef();
  /********************* Stage managers *********************/
  const [stage, setStage] = useState(currentStage); // stage of purchase
  const [shippingStage, setShippingStage] = useState(sSRedux);
  const [paymentStage, setPaymentStage] = useState(pSRedux);

  function changeForm(country = chosenCountry) {
    dispatch({ type: "payment/changeInfo", payload: { email, fN: firstName, lN: lastName, aD: address, optional, country, city, postal: postalCode } });
  }

  function changeAdForm(country = chosenCountryAd) {
    dispatch({ type: "payment/changeAdInfo", payload: { fN: firstNameAd, lN: lastNameAd, aD: addressAd, optional: optionalAd, country, city: cityAd, postal: postalCodeAd } });
  }

  function openSummary() {
    setSummaryOpened(!isSummaryOpened);
  }

  function stageChanger(stageNum) {
    if (stage !== stageNum) setStage(stageNum);
  }

  function changeShipping({ target: { value } }) {
    dispatch({ type: "payment/changeShipping", payload: value });
    setShipping(value);
  }

  function changeCountry({ target: { value } }) {
    changeForm(value);
    setChosenCountry(value);
  }

  function changeCountryAd({ target: { value } }) {
    changeAdForm(value);
    setChosenCountryAd(value);
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
    return true;
  }

  function checkAdInputs() {
    if ([...firstNameAd].length > 0) setFNameEAd(false);
    else {
      setFNameEAd(true);
      return false;
    }

    if ([...lastNameAd].length > 0) setLNameEAd(false);
    else {
      setLNameEAd(true);
      return false;
    }

    if ([...addressAd].length > 0) setAddressEAd(false);
    else {
      setAddressEAd(true);
      return false;
    }

    if ([...cityAd].length > 1) setCityEAd(false);
    else {
      setCityEAd(true);
      return false;
    }

    if (chosenCountryAd !== 'none') setCountryEAd(false);
    else {
      setCountryEAd(true);
      return false;
    }
    return true;
  }

  function changeBilling({ target: { value } }) {
    dispatch({ type: "payment/changeBilling", payload: value });
    setBillingAddress(value);
  }

  function changeCardType({ target: { value } }) {
    setPaymentSystem(value);
    dispatch({ type: "payment/changePayment", payload: value });
  }

  function nextStage() {
    if (checkInputs() && stage === 0) {
      dispatch({ type: "payment/changeStage", payload: { shippingStage: true, paymentStage: false } });
      dispatch({ type: "payment/changeCurrentStage", payload: 1 });
      setStage(1);
      setShippingStage(true);
    }
    else if (checkInputs() && stage === 1) {
      dispatch({ type: "payment/changeStage", payload: { shippingStage: true, paymentStage: true } });
      dispatch({ type: "payment/changeCurrentStage", payload: 2 });
      setStage(2);
      setPaymentStage(true);
    }
    else if (checkInputs() && stage === 2) {
      if (billingAddress === 'default' || (billingAddress !== 'default' && checkAdInputs())) console.log('Success');
    }
    else {
      // If a customer tries to pay while having inappropriate presonal data
      setStage(0);
    }
  }


  useEffect(() => {
    if (items.length === 1) setSubTotal(items[0].price * items[0].amount);
    else if (items.length > 1) setSubTotal(items.reduce((a, b) => a.amount * a.price + b.amount * b.price));
    else push("/shop");
  }, [items, push]);

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
  }, [windowSize, stage]);

  useEffect(() => {
    // Fetches all countries
    async function fetchData() {
      const { data } = await axios.get('https://restcountries.eu/rest/v2/all?fields=name');
      setAllCountries(data);
    }
    fetchData();
  }, []);

  console.log(success)

  return (
    <div id="payment_page">
      <header id="payment_heading">
        <div id="link_block">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
      </header>
      {success === null ?
        <Fragment>
          <main>
            {windowSize < 1000 &&
              <Fragment>
                <div id="summary" tabIndex="0" onClick={openSummary} onKeyDown={({ key }) => { if (key !== 'Tab') openSummary(); }}>
                  <div>
                    <img src={blue_cart} alt="cart" />
                    <span>Show order summary</span>
                    <img src={blue_arrow} alt="arrow" style={isSummaryOpened ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0)' }} />
                  </div>
                  <div>
                    <span>{stage === 0 ? `$${(subTotal - 10).toFixed(2)}` : shipping === 'fs' ? `$${(subTotal + 27.88).toFixed(2)}` : `$${(subTotal + 40.10).toFixed(2)}`}</span>
                    <span>{stage === 0 ? `$${(subTotal - 10).toFixed(2)}` : shipping === 'fs' ? `$${(subTotal - 10 + 27.88).toFixed(2)}` : `$${(subTotal - 10 + 40.10).toFixed(2)}`}</span>
                  </div>
                </div>
                <motion.div animate={isSummaryOpened ? { height: 'auto' } : { height: 0 }} transition={{ duration: .2 }} initial={false} id="summary_items" >
                  {
                    items.map(({ _id, photos, name, price, amount, size, color }) => <Suspense fallback={<BinItemPreloaded />} key={`bin_item_${_id}`}><BinItem img={photos[0]} price={price} amount={amount} name={name} option={`${size} / ${color}`} /></Suspense>)
                  }
                  <hr />
                  <div className="info_block">
                    <div><p>Subtotal</p></div>
                    <div><b>${subTotal.toFixed(2)}</b></div>
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
                      <b>{stage === 0 ? `$${(subTotal - 10).toFixed(2)}` : shipping === 'fs' ? `$${(subTotal - 10 + 27.88).toFixed(2)}` : `$${(subTotal - 10 + 40.10).toFixed(2)}`}</b>
                    </div>
                  </div>
                </motion.div>
              </Fragment>
            }
            <section id="input_sec">
              <Breadcrumbs id="bread_crumbs" style={styleForBreadCrumbs} separator={<img src={arrow} alt="arrow" style={{ transform: 'rotate(180deg)', width: '8px' }} />} aria-label="breadcrumb">
                <Link to="/cart" >Cart</Link>
                <BreadCrumb status={true} stageChanger={stageChanger} index={0}><span tabIndex="0" onKeyDown={({ key }) => { if (key !== 'Tab') stageChanger(0); }}>Information</span></BreadCrumb>
                <BreadCrumb status={shippingStage} stageChanger={stageChanger} index={1} ><span tabIndex="0" onKeyDown={({ key }) => { if (shippingStage && key !== 'Tab') stageChanger(1); }}>Shipping</span></BreadCrumb>
                <BreadCrumb status={paymentStage} stageChanger={stageChanger} index={2}><span tabIndex="0" onKeyDown={({ key }) => { if (paymentStage && key !== 'Tab') stageChanger(2); }}>Payment</span></BreadCrumb>
              </Breadcrumbs>
              <ThemeProvider theme={theme}>
                {stage === 0 &&
                  <form name="shipping">
                    <h2 ref={compared_h2}>Contact Information</h2>
                    <Input name="shippingEmail" value={email} error={emailE} onChange={({ target: { value } }) => { setEmail(value); changeForm(); }} label="Email" />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="checkedB"
                          color="primary"
                          checked={newsCheckbox}
                          onChange={() => { setNewsCheckbox(!newsCheckbox); dispatch({ type: "payment/keepUp", payload: { value: !newsCheckbox } }); }}
                        />
                      }
                      label={<Typography style={styles.formControlLabel}>Keep me up to date on news and exclusive offers</Typography>}
                    />
                    <h2>Shipping address</h2>
                    <div className="inline_inputs">
                      <Input value={firstName} error={fNameE} onChange={({ target: { value } }) => { setFirstName(value); changeForm(); }} label="First name" name="checkout[shipping_address][first_name]" />
                      <div className="gap" />
                      <Input value={lastName} error={lNameE} onChange={({ target: { value } }) => { setLastName(value); changeForm(); }} label="Last name" name="checkout[shipping_address][last_name]" />
                    </div>
                    <Input value={address} error={addressE} onChange={({ target: { value } }) => { setAddress(value); changeForm(); }} label="Address" name="checkout[shipping_address][address1]" />
                    <Input value={optional} onChange={({ target: { value } }) => { setOptional(value); changeForm(); }} label="Apartment, suite, etc. (optional)" name="checkout[shipping_address][address2]" />
                    <Input value={city} error={cityE} onChange={({ target: { value } }) => { setCity(value); changeForm(); }} label="City" name="checkout[shipping_address][city]" />
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
                      <Input value={postalCode} onChange={({ target: { value } }) => { setPostalCode(value); changeForm(); }} label="Postal code or province" />
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
                          <span onClick={() => { stageChanger(0); }} tabIndex="0" onKeyDown={({ key }) => { if (key !== 'Tab' && key !== 'Shift') stageChanger(0); }}>Change</span>
                        </div>
                        <address>{email}</address>
                      </div>
                      <hr />
                      <div className="change_info_option">
                        <div className="change_info_heading">
                          <span>Ship to</span>
                          <span onClick={() => { stageChanger(0); }} tabIndex="0" onKeyDown={({ key }) => { if (key !== 'Tab' && key !== 'Shift') stageChanger(0); }}>Change</span>
                        </div>
                        <address>{address}, {city}, {[...postalCode].length === 0 ? 'no postal code' : postalCode}, {chosenCountry[0].toUpperCase()}{[...chosenCountry].filter((i, index) => index !== 0)}</address>
                      </div>
                    </div>
                    <h2 ref={compared_h2}>Shipping to</h2>
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
                    <Button type="submit" onClick={e => { e.preventDefault(); nextStage(); }} className="c_input submit_btn" variant="contained" size="medium" color="primary" style={submitStyle}>Continue to shipping</Button>
                  </div>
                }
                {stage === 2 &&
                  <div id="third_stage">
                    <div id="change_info">
                      <div className="change_info_option">
                        <div className="change_info_heading">
                          <span>Contact</span>
                          <span onClick={() => { stageChanger(0); }} tabIndex="0" onKeyDown={({ key }) => { if (key !== 'Tab' && key !== 'Shift') stageChanger(0); }}>Change</span>
                        </div>
                        <address>{email}</address>
                      </div>
                      <hr />
                      <div className="change_info_option">
                        <div className="change_info_heading">
                          <span>Ship to</span>
                          <span onClick={() => { stageChanger(0) }} tabIndex="0" onKeyDown={({ key }) => { if (key !== 'Tab' && key !== 'Shift') stageChanger(0); }}>Change</span>
                        </div>
                        <address>{address}, {city}, {postalCode}, {chosenCountry[0].toUpperCase()}{[...chosenCountry].filter((i, index) => index !== 0)}</address>
                      </div>
                      <hr />
                      <div className="change_info_option">
                        <div className="change_info_heading">
                          <span>Method</span>
                          <span onClick={() => { stageChanger(1) }} tabIndex="0" onKeyDown={({ key }) => { if (key !== 'Tab' && key !== 'Shift') stageChanger(1); }}>Change</span>
                        </div>
                        <address>{shipping === 'fs' ? 'Canada Post Small Packet International Surface' : 'Canada Post Small Packet International Air'} {shipping === 'fs' ? <b>$27.88</b> : <b>$40.10</b>}</address>
                      </div>
                    </div>
                    <h2 ref={compared_h2}>Payment</h2>
                    <span className="message">All transactions are secure and encrypted.</span>
                    <RadioGroup name="gender2" value={paymentSystem} onChange={changeCardType} >
                      <div className="choice_block">
                        <div className="choice_heading">
                          <div>
                            <Radio value="card" color="primary" name="payment" />
                            <b>Credit Card</b>
                          </div>
                          <img src={cards} alt="cards" style={{ width: '125px' }} />
                        </div>
                        <motion.div className="choice_content" animate={paymentSystem === 'card' ? { height: 'auto' } : { height: 0 }} transition={{ duration: .2 }} initial={false}>
                          <Elements stripe={stripePromise}>
                            <CheckoutForm
                              setWaiting={setPurchaseWaiting}
                              setSuccess={setSuccess}
                              address={address}
                              items={items}
                              country={country}
                              email={email}
                              city={city}
                              postal={postalCode}
                              details={sIns}
                              shipping={shipping}
                              totalPrice={shipping === 'fs' ? (subTotal - 10 + 27.88).toFixed(2) : (subTotal - 10 + 40.10).toFixed(2)} fN={firstName} lN={lastName}
                              actualBilling={billingAddress === "difAddress" ?
                                `${firstNameAd}, ${lastNameAd}, ${addressAd}, ${optionalAd}, ${cityAd}, ${postalCodeAd.length > 0 ? postalCodeAd : 'no postal code'}, ${chosenCountryAd}`
                                :
                                `${firstName}, ${lastName}, ${address}, ${optional}, ${city}, ${postalCode.length > 0 ? postalCode : 'no postal code'}, ${chosenCountry}`
                              }
                            />
                          </Elements>
                        </motion.div>
                        <div className="choice_heading">
                          <div>
                            <Radio value="paypal" color="primary" name="payment" />
                            <img src={paypal_img} alt="paypal" style={{ width: '100px' }} />
                          </div>
                        </div>
                        <motion.div className="choice_content" animate={paymentSystem === 'paypal' ? { height: 'auto' } : { height: 0 }} transition={{ duration: .2 }} initial={false}>
                          <img src={card_img} alt="card" />
                          <p>After clicking “Complete order”, the PayPal window will emerge to complete your purchase securely.</p>
                        </motion.div>
                      </div>
                    </RadioGroup>
                    <h2>Billing address</h2>
                    <span className="message">Select the address that matches your card or payment method.</span>
                    <RadioGroup name="gender3" value={billingAddress} onChange={changeBilling}>
                      <div className="choice_block">
                        <div className="choice_heading">
                          <div>
                            <Radio value="default" color="primary" name="payment" />
                            <b>Same as shipping address</b>
                          </div>
                        </div>
                        <div className="choice_heading">
                          <div>
                            <Radio value="difAddress" color="primary" name="payment" />
                            <b>Use a different billing address</b>
                          </div>
                        </div>
                        <motion.div className="choice_content" animate={billingAddress === 'difAddress' ? { height: 'auto' } : { height: 0 }} transition={{ duration: .2 }} initial={false}>
                          <form name="billingAddress">
                            <div className="inline_inputs">
                              <Input value={firstNameAd} error={fNameEAd} onChange={({ target: { value } }) => { setFirstNameAd(value); changeAdForm(); }} label="First name" name="checkout[shipping_address][first_name]" />
                              <div className="gap" />
                              <Input value={lastNameAd} error={lNameEAd} onChange={({ target: { value } }) => { setLastNameAd(value); changeAdForm(); }} label="Last name" name="checkout[shipping_address][last_name]" />
                            </div>
                            <Input value={addressAd} error={addressEAd} onChange={({ target: { value } }) => { setAddressAd(value); changeAdForm(); }} label="Address" name="checkout[shipping_address][address1]" />
                            <Input value={optionalAd} onChange={({ target: { value } }) => { setOptionalAd(value); changeAdForm(); }} label="Apartment, suite, etc. (optional)" name="checkout[shipping_address][address2]" />
                            <Input value={cityAd} error={cityEAd} onChange={({ target: { value } }) => { setCityAd(value); changeAdForm(); }} label="City" name="checkout[shipping_address][city]" />
                            <div className="inline_inputs">
                              <FormControl variant="outlined" className="c_input" size="small">
                                <InputLabel id="demo-simple-select-outlined-label">Country</InputLabel>
                                <Select style={{ backgroundColor: 'white' }} error={countryEAd} onChange={changeCountryAd} labelId="demo-simple-select-outlined-label" value={chosenCountryAd} label="Country">
                                  <MenuItem value="none">---</MenuItem>
                                  {
                                    allCountries.map(({ name }) => <MenuItem value={name.toLowerCase()} key={name}>{name}</MenuItem>)
                                  }
                                </Select>
                              </FormControl>
                              <div className="gap" />
                              <Input value={postalCodeAd} onChange={({ target: { value } }) => { setPostalCodeAd(value); changeAdForm(); }} label="Postal code or province" />
                            </div>
                          </form>
                        </motion.div>
                      </div>
                    </RadioGroup>
                    <Button type="submit" form="checkout_form" onClick={e => { e.preventDefault(); nextStage(); if (paymentSystem === "card") document.getElementById("checkout_button").click(); }} className="c_input submit_btn" variant="contained" size="medium" color="primary" style={(submitStyle, { textTransform: 'none' })}>{purchaseWaiting ? <CircularProgress style={{ color: "white" }} /> : paymentSystem === 'card' ? 'Pay now' : 'Complete order'}</Button>
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
                  items.map(({ _id, photos, name, price, amount, size, color }) => <Suspense fallback={<BinItemPreloaded />} key={`bin_item_${_id}`}><BinItem img={photos[0]} price={price} amount={amount} name={name} option={`${size} / ${color}`} /></Suspense>)
                }
                <hr />
                <div className="info_block">
                  <div><p>Subtotal</p></div>
                  <div><b>${subTotal.toFixed(2)}</b></div>
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
                    <b>{stage === 0 ? `$${(subTotal - 10).toFixed(2)}` : shipping === 'fs' ? `$${(subTotal - 10 + 27.88).toFixed(2)}` : `$${(subTotal - 10 + 40.10).toFixed(2)}`}</b>
                  </div>
                </div>
              </section>
            }
          </main>
          {windowSize < 1000 &&
            <footer>
              <hr />
              <p>All rights reserved Peaceful Disruption</p>
            </footer>
          }
        </Fragment>
        :
        <Fragment>
          {success === true ?
            <div className="result">
              <img src={successImg} alt="success" />
              <h2>Congratulations! Your purchase has been proccessed!</h2>
              <Link onClick={() => { dispatch({ type: "payment/updatePayment" }); dispatch({ type: "cart/removeElements" }); }} to="/">Go to the main page</Link>
            </div>
            :
            <div className="result">
              <img src={failImg} alt="failure" />
              <h2>Some problem occurred!</h2>
              <p onClick={() => { setSuccess(null); }} tabIndex="0" onKeyDown={({ key }) => { if (key !== 'Tab') setSuccess(null); }}>Try again</p>
            </div>
          }
        </Fragment>
      }
    </div>
  );
}

export default Payment;