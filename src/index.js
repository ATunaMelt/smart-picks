import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from 'react-moralis';
/* Moralis init code */
const Moralis = require('moralis');
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
const appId = process.env.REACT_APP_MORALIS_APP_ID;

Moralis.start({ serverUrl, appId });

ReactDOM.render(
  <MoralisProvider
    appId={process.env.REACT_APP_MORALIS_APP_ID}
    serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MoralisProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
