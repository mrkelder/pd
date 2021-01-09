import React from 'react';
import 'css/p_binItem.css';

function BinItemPreloaded() {
  return (
    <div className="p_bin_item">
      <div className="p_bin_item_info">
        <div className="p_bin_item_image" />
        <div className="info">
          <div className="name" />
          <div className="option" />
        </div>
      </div>
      <span className="p_bin_item_price" />
    </div>
  );
}

export default BinItemPreloaded;
