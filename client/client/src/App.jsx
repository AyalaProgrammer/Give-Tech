// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useState } from 'react';
import VolunteersTable from './VolunteersTable';
import AddVolunteer from './AddVolunteer';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVolunteerAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#005f8d', textAlign: 'center' }}>GiveTech - לוח מתנדבים</h1>
      <AddVolunteer onVolunteerAdded={handleVolunteerAdded} />
      <hr style={{ margin: '30px 0' }} />
      <VolunteersTable key={refreshKey} />
    </div>
  );
}

export default App;