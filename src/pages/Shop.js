import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { infoContext } from 'app/context';
import { Link } from 'react-router-dom';
import Item from 'components/Item';
import axios from 'axios';
import ItemPreloaded from 'components/ItemPreloaded';
import 'css/shop.css';

function Shop() {
  const domain = useContext(infoContext);
  const { windowSize } = useSelector(state => state.windowSize);
  const [filter, setFilter] = useState('title-ascending');
  const [allItems, setAllItems] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`http://${domain}/getItem`, { params: { type: "*" } });
      setAllItems(data.sort((a, b) => { if (a.name[0] < b.name[0]) return -1; else if (a.name[0] > b.name[0]) return 1; else return 0; }));
    }
    fetchData();
  }, [domain]);

  function changeSequence({ target: { value } }) {
    const copiedArray = allItems;
    if (copiedArray !== null) {
      switch (value) {
        case 'best-selling':
          // Amount of buys
          copiedArray.sort((a, b) => {
            if (a.bought > b.bought) return -1;
            else if (a.bought < b.bought) return 1;
            else return 0;
          });
          break;
        case 'title-ascending':
          // Alphabetically, A-Z
          copiedArray.sort((a, b) => {
            if (a.name[0] < b.name[0]) return -1;
            else if (a.name[0] > b.name[0]) return 1;
            else return 0;
          });
          break;
        case 'title-descending':
          // Alphabetically, Z-A
          copiedArray.sort((a, b) => {
            if (a.name[0] > b.name[0]) return -1;
            else if (a.name[0] < b.name[0]) return 1;
            else return 0;
          });
          break;
        case 'price-ascending':
          // Price, low to high
          copiedArray.sort((a, b) => {
            if (a.price < b.price) return -1;
            else if (a.price > b.price) return 1;
            else return 0;
          });
          break;
        case 'price-descending':
          // Price, hight to low
          copiedArray.sort((a, b) => {
            if (a.price > b.price) return -1;
            else if (a.price < b.price) return 1;
            else return 0;
          });
          break;
        case 'created-ascending':
          // Date, old to new
          copiedArray.sort((a, b) => {
            if (new Date(a.date).getTime() < new Date(b.date).getTime()) return -1;
            else if (new Date(a.date).getTime() > new Date(b.date).getTime()) return 1;
            else return 0;
          });
          break;
        case 'created-descending':
          // Date, new to old
          copiedArray.sort((a, b) => {
            if (new Date(a.date).getTime() > new Date(b.date).getTime()) return -1;
            else if (new Date(a.date).getTime() < new Date(b.date).getTime()) return 1;
            else return 0;
          });
          break;
        default:
          // How the f#ck you managed to get this error, hackerman???
          alert('Pardon 😠?!');
          break;
      }
      setAllItems(copiedArray);
      setFilter(value);
    }
  }

  return (
    <div id="shop_page">
      <div id="shop_heading">
        <div>
          <div id="bread_crumbs">
            <Link to="/">Home</Link>
            <span className="arrow">{'>'}</span>
            <span>Products</span>
          </div>
          <h1>Products</h1>
        </div>
        <select onChange={changeSequence} value={filter}>
          <option value="best-selling">Best selling</option>
          <option value="title-ascending">Alphabetically, A-Z</option>
          <option value="title-descending">Alphabetically, Z-A</option>
          <option value="price-ascending">Price, low to high</option>
          <option value="price-descending">Price, high to low</option>
          <option value="created-ascending">Date, old to new</option>
          <option value="created-descending">Date, new to old</option>
        </select>
      </div>
      <div id="shop_items">
        {allItems === null ?
          new Array(6).fill(0).map((i, index) => <ItemPreloaded type={windowSize < 768 ? 'small' : 'big'} key={`child_${index}`} />)
          :
          allItems.map(({ price, name, _id, photos }) =>
            <Suspense key={_id} fallback={<ItemPreloaded type={windowSize < 768 ? 'small' : 'big'} />}>
              <Item _id={_id} type={windowSize < 768 ? 'small' : 'big'} img={photos[0]} name={name} price={price} key={`item_${_id}`} />
            </Suspense>
          )
        }

      </div>
    </div>
  );
}

export default Shop;
