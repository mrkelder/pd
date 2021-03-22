import React, { useEffect, Suspense, lazy, useContext, useState } from 'react';
import ItemPreloaded from 'components/ItemPreloaded';
import redBus from 'img/red_bus.png';
import axios from 'axios';
import { infoContext } from 'app/context';
import 'css/main.css';

const Item = lazy(() => import('components/Item'));

function Main() {
  const domain = useContext(infoContext);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`http://${domain}/getItem`, { params: { type: "*", limit: 6, skip: 2 } });
      setItems(data);
      setItemsLoaded(true);
    }
    fetchData();
  }, [domain]);

  return (
    <div id="main_page">
      { !itemsLoaded &&
        new Array(6).fill(0).map((i, index) => <ItemPreloaded key={`pItem_${index}`} />)
      }
      {
        items.map(({ price, _id, name, photos }) =>
          <Suspense key={_id} fallback={<ItemPreloaded />}>
            <Item _id={_id} price={price} name={name} img={photos[0]} />
          </Suspense>
        )
      }
      <div id="red_bus">
        <img src={redBus} alt="redBus" />
        <div>
          <h2>ALL ORDERS ABOVE $100 APPLY FOR FREE SHIPPING!</h2>
          <strong>DISCOUNT APPLYS AUTOMATICALLY</strong>
        </div>
      </div>
    </div>
  );
}

export default Main;
