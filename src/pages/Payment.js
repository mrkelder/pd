import React, { Fragment, lazy, useState, Suspense, useEffect, useRef } from 'react';
import { Breadcrumbs, Button, Typography, createStyles, FormControlLabel, TextField, createMuiTheme, ThemeProvider, Checkbox, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
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
  // const [sectionHeight, setSectionHeight] = useState(null);
  const compared_h2 = useRef();
  // const heading = useRef();

  function openSummary() {
    setSummaryOpened(!isSummaryOpened);
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
    // Changes the height of the section
    // if (windowSize >= 1000 && heading.current !== undefined)
    //   setSectionHeight({ height: document.getElementsByTagName('html')[0].clientHeight - heading.current.clientHeight });
  }, [windowSize]);

  return (
    <div id="payment_page">
      {/* { windowSize < 768 ?
        <Fragment> */}
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
                <span>$320.00</span>
                <span>$310.00</span>
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
                <div><p>Calculated at next step</p></div>
              </div>
              <hr />
              <div className="info_block total">
                <div><p>Total</p></div>
                <div>
                  <p>CAD</p>
                  <b>$310.00</b>
                </div>
              </div>
            </motion.div>
          </Fragment>
        }
        <section id="input_sec">
          <Breadcrumbs id="bread_crumbs" style={styleForBreadCrumbs} separator={<img src={arrow} alt="arrow" style={{ transform: 'rotate(180deg)', width: '8px' }} />} aria-label="breadcrumb">
            <Link to="/" >Cart</Link>
            <p>Information</p>
            <p>Shipping</p>
          </Breadcrumbs>
          <ThemeProvider theme={theme}>
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
              <Button type="submit" className="c_input submit_btn" variant="contained" size="medium" color="primary" style={submitStyle}>Continue to shipping</Button>
            </form>
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
                <b>$310.00</b>
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
      {/* </Fragment>
        :
        <Fragment>
        </Fragment>
      } */}
    </div>
  );
}

export default Payment;
