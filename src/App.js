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

function App() {
  const [snacks, setSnacks] = useState([]);

  const updateSnacks = (type, message) => {
    const newSnack = <CustomizedSnackbars alertType={type} message={message} />;
    setSnacks([...snacks, newSnack]);
  };

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
