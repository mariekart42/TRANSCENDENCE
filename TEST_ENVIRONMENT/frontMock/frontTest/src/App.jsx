import React, { useState, useEffect } from 'react';
import logo from '/lol.png';
import doggo from '/good_boi.jpeg';


// const App = () => {
//
//   // State to store chat messages
//   // const [chatMessages, setChatMessages] = useState([]);
//   // const [something, setSomething] = useState([]);
//   const [signup, setSignup] = useState([]);
//   const [signin, setSignin] = useState([]);
//
//   // URL for the chat messages API
//   // const apiUrl = 'http://localhost:6969/getMessages/lol/';
//   // const apiUrl2 = 'http://localhost:6969/getMessages/lol/';
//   const signupUrl = 'http://localhost:6969/signup/';
//   const signinUrl = 'http://localhost:6969/signin/';
//
//
//   // const fetchChatMessages = async () => {
//   //   try {
//   //     console.log('WOWZA!')
//   //     const response = await fetch(apiUrl);
//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       setChatMessages(data.messages);
//   //       console.log(data)
//   //     } else {
//   //       console.error('Error fetching chat messages:', response.statusText);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching chat messages:', error);
//   //   }
//   // };
//   //   useEffect(() => {
//   //   fetchChatMessages();
//   // }, []);
//   //
//   //
//   //   const fetchSomething = async () => {
//   //   try {
//   //     const response = await fetch(apiUrl2);
//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       setSomething(data.messages);
//   //       console.log(data)
//   //     } else {
//   //       console.error('Error fetching chat messages:', response.statusText);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching chat messages:', error);
//   //   }
//   // };
//   //   useEffect(() => {
//   //   fetchSomething();
//   // }, []);
//
//
//     const fetchSignup = async () => {
//     try {
//       const response = await fetch(signupUrl);
//       if (response.ok) {
//         const data = await response.json();
//         setSignup(data.messages);
//         console.log(data)
//       } else {
//         console.error('Error fetching chat messages:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching chat messages:', error);
//     }
//   };
//     useEffect(() => {
//     fetchSignup();
//   }, []);
//
//
//
//   return (
//       <div className="chat-container">
//         <h1>Chat Application</h1>
//
//       <div>
//         <img src={doggo} alt="doggo"/>
//       </div>
//
//
//       <div className="signup">
//         {/* Render chat messages */}
//         {signupThing.map((message, index) => (
//             <div key={index} className="message">
//               room: {message.room} <strong>{message.user}:</strong> {message.value}
//             </div>
//         ))}
//       </div>
//
//
//
//         {/*<div className="chat-messages">*/}
//         {/*  /!* Render chat messages *!/*/}
//         {/*  {chatMessages.map((message, index) => (*/}
//         {/*      <div key={index} className="message">*/}
//         {/*        room: {message.room} <strong>{message.user}:</strong> {message.value}*/}
//         {/*      </div>*/}
//         {/*  ))}*/}
//         {/*</div>*/}
//         {/*<div className="chat-messages2">*/}
//         {/*  /!* Render chat messages *!/*/}
//         {/*  {something.map((message2, index) => (*/}
//         {/*      <div key={index} className="message2">*/}
//         {/*        room: {message2.room} <strong>{message2.user}:</strong> {message2.value}*/}
//         {/*      </div>*/}
//         {/*  ))}*/}
//         {/*</div>*/}
//
//
//
//       </div>
//   );
// }


// function UserList() {
//     const [users, setUsers] = useState([]);
//
//   const fetchUser = async () => {
//     try {
//       console.log('WOWZA!')
//       const response = await fetch('http://localhost:6969/user/');
//       if (response.ok) {
//         const data = await response.json();
//         setUsers(data.messages);
//         console.log(data)
//       } else {
//         console.error('Error fetching chat messages:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching chat messages:', error);
//     }
//   };
//     useEffect(() => {
//     fetchUser();
//   }, []);
//
//     return (
//         <div>
//             <h1>User List</h1>
//             <ul>
//                 {users.map(user => (
//                     <li key={user.id}>
//                         Name: {user.name},  password: {user.password}, Age: {user.age}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//
//       // <div className="signup">
//       //   {/* Render chat messages */}
//       //   {users.map((user, index) => (
//       //       <div key={index} className="message">
//       //           ID:       {user.id},<br></br>
//       //           NAME:     {user.name},<br></br>
//       //           PASSWORD: {user.password}, <br></br>
//       //           AGE:      {user.age}<br></br>
//       //       </div>
//       //   ))}
//       // </div>
//     );
// }



// function UserList() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     const fetchUser = async () => {
//         try {
//             const response = await fetch('http://localhost:6969/user/');
//             if (response.ok) {
//                 const data = await response.json();
//                 if (data && data.messages && Array.isArray(data.messages)) {
//                     setUsers(data.messages);
//                 } else {
//                     setError('Invalid API response format');
//                 }
//             } else {
//                 setError(`Error fetching user data: ${response.statusText}`);
//             }
//         } catch (error) {
//             setError(`Error fetching user data: ${error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchUser();
//     }, []);
//
//     if (loading) {
//         return <div>Loading...</div>;
//     }
//
//     if (error) {
//         return <div>Error: {error}</div>;
//     }
//
//     return (
//         <div>
//             <h1>User List</h1>
//             <ul>
//                 {users.map(user => (
//                     <li key={user.id}>
//                         Name: {user.name}, Password: {user.password}, Age: {user.age}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }



function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:6969/user/')  // Replace with your Django API endpoint URL
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    return (
        <div>
            <ul>
                <h1>User List</h1>
                <br></br><br></br><br></br><br></br>
                {users.map(user => (
                    <li key={user.id}>
                        <strong>Name:</strong>     {user.name},<br></br>
                        <strong>Password:</strong> {user.password},<br></br>
                        <strong>Age:</strong>      {user.age}<br></br><br></br>
                    </li>
                ))}
            </ul>

        </div>
    );
}


export default UserList;
