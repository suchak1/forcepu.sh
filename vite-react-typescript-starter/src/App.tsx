import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { Line } from '@ant-design/charts';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import TOS from "@/pages/tos";
import Privacy from "@/pages/privacy";
import Gym from "@/pages/gym";
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
  const config = {
    data,
    width: 800,
    height: 400,
    autoFit: false,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <div className="App">
        <BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/algorithm" element={<Algorithm />} />
            <Route path="/art" element={<Art />} /> */}
            <Route path="/gym" element={<Gym />} />
            <Route path="/tos" element={<TOS />} />
            <Route path="/privacy" element={<Privacy />} />
         </Routes>
         </BrowserRouter>
      <Line {...config} />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
