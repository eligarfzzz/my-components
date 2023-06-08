import * as React from 'react';
import './App.scss';
import VirtualList from './components/VirtualList';


export default function App() {
  const items: string[] = []
  for (let index = 0; index < 100; index++) {
    items.push(index.toString())
  }
  const [scrollPosition, setScrollPosition] = React.useState(0)
  return (
    <div className='container'>
      <VirtualList itemHeight={16} scrollPosition={scrollPosition} items={items} delegate={(item) => {
        return <div key={item} style={{ height: "16px" }}>{item}</div>
      }} onScroll={(pos) => setScrollPosition(pos)}></VirtualList>

    </div>
  );
}

