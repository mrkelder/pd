import React, { Fragment, lazy, useState, Suspense } from 'react';
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

function Input({ label }) {
  return <TextField className="c_input" label={label} variant="outlined" size="small" />;
}

function Payment() {
  const { windowSize } = useSelector(state => state.windowSize);
  const [isSummaryOpened, setSummaryOpened] = useState(true);

  function openSummary() {
    setSummaryOpened(!isSummaryOpened);
  }

  return (
    <div id="payment_page">
      { windowSize < 768 ?
        <Fragment>
          <header id="payment_heading">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </header>
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
          <section>
            <Breadcrumbs id="bread_crumbs" separator={<img src={arrow} alt="arrow" style={{ transform: 'rotate(180deg)', width: '8px' }} />} aria-label="breadcrumb">
              <Link to="/" >Cart</Link>
              <p>Information</p>
              <p>Shipping</p>
            </Breadcrumbs>
            <ThemeProvider theme={theme}>
              <form>
                <h2>Contact Information</h2>
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
                <Input label="First name" />
                <Input label="Last name" />
                <Input label="Address" />
                <Input label="Apartment, suite, etc. (optional)" />
                <Input label="City" />
                <FormControl variant="outlined" className="c_input" size="small">
                  <InputLabel id="demo-simple-select-outlined-label">Country</InputLabel>
                  <Select labelId="demo-simple-select-outlined-label" value="none" label="Country">
                    <MenuItem value="none">---</MenuItem>
                    <MenuItem value="usa">the USA</MenuItem>
                    <MenuItem value="canada">Canada</MenuItem>
                    <MenuItem value="ukraine">Ukraine</MenuItem>
                  </Select>
                </FormControl>
                <Input label="Postal code" />
                <Button className="c_input" variant="contained" size="middle" color="primary" style={{ height: '65px' }}>Continue to shipping</Button>
              </form>
            </ThemeProvider>
          </section>
          <footer>
            <hr />
            <p>All rights reserved Peaceful Disruption</p>
          </footer>
        </Fragment>
        :
        <Fragment>
        </Fragment>
      }
    </div>
  );
}

export default Payment;
