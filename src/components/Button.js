import React from 'react';
import 'css/button.css';

function Button({ click, children }) {
  return <button className="b_button">{children}</button>;
}

export default Button;
