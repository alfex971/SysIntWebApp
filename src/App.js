import React, { useState } from 'react';
import IframeComm from "react-iframe-comm";
import axios from 'axios';
import convert from 'xml-js';
import logo from './logo.svg';
import './App.css';

function App() {
  const [balance, setBalance] = useState();
  const [debt, setDebt] = useState();
  const [email, setEmail] = useState();
  const [user, setUser] = useState();

  const attributes = {
    src: "http://80.210.70.4:3333/easyid-form.php",
    width: "200px",
    height: "215px",
  };    
  
  const postMessageData = "hello iframe";
  const onReceiveMessage = async (token) => {
    if (token.data.message) {
      // let balance = null;
      let email = null;
      console.log("onReceiveMessage", token.data.message);
      const user = await axios.post(`http://localhost:8081`, { token: token.data.message })
        .then(res => {
          console.log(res);
          console.log(res.data);
          var options = {ignoreComment: true, compact: true, trim: true};
          const user = convert.xml2js(res.data, options);
          return {
            balance: user.user.balance._text,
            email: user.user.email._text,
          };
          // email = res.data.emaill;
      })

      var postData = JSON.stringify({
        value: token.data.message,
      });
      
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };

      console.log(typeof postData);

      const debt = await axios.post(`http://localhost:58212/api/Skat/Skat`, postData, axiosConfig)
        .then(res => {
          // console.log(res);
          // console.log(res.data);
          return res.data.debt;
      })

      console.log('user', user);
      const finalUser = {
        ...user,
        debt
      }
      {console.log("balance", finalUser)}
      setUser(finalUser);
      // setBalance(balance);
      // setDebt(debt);
      // setEmail(email);
    } 
  };

    // iframe has loaded
  const onReady = () => {
      console.log("onReady");
  };
  return (
    <div className="App">
      <header className="App-header">
        {console.log(email && balance && debt)}
        {user ? <span>User with email {user.email}, has {user.balance} kroner, and owns {user.debt}</span> :  
        <IframeComm
          attributes={attributes}
          postMessageData={postMessageData}
          handleReady={onReady}
          handleReceiveMessage={onReceiveMessage}
        /> }
      </header>
    </div>
  );
}

export default App;
