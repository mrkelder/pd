import React from 'react';
import PropTypes from 'prop-types';
import 'css/button.css';

function Button({ click, children }) {
  return <button className="b_button" onClick={click}>{children}</button>;
}

Button.defaultProps = {
  click() { },
  children: 'Button'
};

Button.propTypes = {
  click: PropTypes.func,
  children: PropTypes.string
};

export default Button;
