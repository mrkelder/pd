import React from 'react';
import PropTypes from 'prop-types';
import 'css/p_item.css';

function ItemPreloaded({ type }) {
  return (
    <div className={type === 'big' ? 'p_item' : 'p_item_s'}>
      <div className="p_item_img" />
      <div className="p_item_name" />
      <div className="p_item_p" />
    </div>
  );
}

ItemPreloaded.defaultProps = {
  type: 'big'
};

ItemPreloaded.propTypes = {
  type: PropTypes.oneOf(['big', 'small'])
};

export default ItemPreloaded;
