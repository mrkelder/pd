import React, { useEffect, Suspense, lazy } from 'react';
import ItemPreloaded from 'components/ItemPreloaded';
import 'css/main.css';
const Item = lazy(() => import('components/Item'));

function Main() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div id="main_page">
      {
        new Array(4).fill(20).map((i, index) =>
          <Suspense key={`hoodie_${index}`} fallback={<ItemPreloaded />}>
            <Item price={40} name="Awesome hoodie" img="a_hoodie.webp" />
          </Suspense>
        )
      }
    </div>
  );
}

export default Main;
