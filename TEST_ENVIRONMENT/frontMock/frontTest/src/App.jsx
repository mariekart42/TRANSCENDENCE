// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {

  // State to store chat messages
  const [chatMessages, setChatMessages] = useState([]);
  const [something, setSomething] = useState([]);

  // URL for the chat messages API
  const apiUrl = 'http://localhost:6969/getMessages/lol/';
  const apiUrl2 = 'http://localhost:6969/getMessages/lol/';

  const fetchChatMessages = async () => {
    try {
      console.log('WOWZA!')
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages);
        console.log(data)
      } else {
        console.error('Error fetching chat messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };
    useEffect(() => {
    fetchChatMessages();
  }, []);






    const fetchSomething = async () => {
    try {
      const response = await fetch(apiUrl2);
      if (response.ok) {
        const data = await response.json();
        setSomething(data.messages);
        console.log(data)
      } else {
        console.error('Error fetching chat messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };
    useEffect(() => {
    fetchSomething();
  }, []);




  return (
      <div className="chat-container">
        <h1>Chat Application</h1>

        <div className="chat-messages">
          {/* Render chat messages */}
          {chatMessages.map((message, index) => (
              <div key={index} className="message">
                room: {message.room} <strong>{message.user}:</strong> {message.value}
              </div>
          ))}
        </div>



        <div className="chat-messages2">
          {/* Render chat messages */}
          {something.map((message2, index) => (
              <div key={index} className="message2">
                room: {message2.room} <strong>{message2.user}:</strong> {message2.value}
              </div>
          ))}
        </div>



      </div>
  );
}

//   return (
//     <div className="chat-container">
//       <h1>Chat Application</h1>
//     </div>
//   );
// };
export default App
