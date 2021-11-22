import { useState, useEffect } from 'react';

import './styles/App.scss';
import Header from './components/header.js';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import ViewBrackets from './pages/viewBrackets';
import CreatePool from './pages/createPool';
import ViewPools from './pages/viewPools';
import JoinPool from './pages/joinPool';
import CreateBracket from './pages/createBracket';
import About from './pages/about';
import EditBracket from './pages/editBracket';
import CustomizedSnackbars from './components/snack';
import { useMoralis } from 'react-moralis';
import { NETWORK_IDS } from './constants/web3-constants';


function App() {
  const { Moralis, isAuthenticated } = useMoralis();
  const [snacks, setSnacks] = useState([]);

  const updateSnacks = (type, message) => {
    const newSnack = <CustomizedSnackbars alertType={type} message={message} />;
    setSnacks([newSnack]);
  };

  Moralis.onChainChanged(async() => {
    const chainId = await Moralis.getChainId();

    if (chainId && NETWORK_IDS.indexOf(chainId.toString()) === -1) {
      updateSnacks('error', 'Network unsupported.');
    } else {
      updateSnacks('success', 'Successfully connected to supported network.');
    }

  })

  return (
    <Router>
      <div className='App'>
        <Header />
        <div className='background' />
        <Switch>
          <Route
            path='/pool/new'
            component={() => <CreatePool updateSnacks={updateSnacks} />}
          />
          <Route
            path='/pool/:id'
            component={() => <JoinPool updateSnacks={updateSnacks} />}
          />
          <Route path='/brackets/new' component={() => <CreateBracket />} />
          <Route path='/brackets/:id' component={() => <EditBracket />} />
          <Route path='/brackets' component={ViewBrackets} />
          <Route path='/about' component={About} />
          <Route path='/' component={ViewPools} />
        </Switch>

        {snacks.map((snack) => snack)}
      </div>
    </Router>
  );
}

export default App;
