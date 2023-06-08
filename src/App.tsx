import * as React from 'react';
import './App.scss';
import VirtualList from './components/VirtualList';
import Calendar from './components/Calendar';


export default function App() {
  const items: string[] = []
  for (let index = 0; index < 100; index++) {
    items.push(index.toString())
  }
  const [scrollPosition, setScrollPosition] = React.useState(0)

  const [date, setDate] = React.useState<Date | null>(null)
  return (
    <div className='container'>
      <div className='vl'>
        <VirtualList itemHeight={16} scrollPosition={scrollPosition} items={items} delegate={(item) => {
          return <div key={item} style={{ height: "16px" }}>{item}</div>
        }} onScroll={(pos) => setScrollPosition(pos)}></VirtualList>
      </div>
      <div className='cl'>
        <Calendar onSelectDate={(date) => setDate(date)} date={date} dateFormat={(date) => date?.toString() ?? "select a date"}></Calendar>

      </div>
    </div>
  );
}

