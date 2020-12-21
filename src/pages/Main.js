import React from 'react';
import Item from 'components/Item';
import 'css/main.css';

function Main() {
  return (
    <div id="main_page">
      {
        new Array(4).fill(20).map((i , index) => <Item key={`hoodie_${index}`} price={40} name="Awesome hoodie" img="a_hoodie.webp" />)
      }
    </div>
  );
}

export default Main;
