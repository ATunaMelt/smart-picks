import './styles/App.scss';
import Header from './components/header.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import BracketPage from './pages/brackets';
import CreatePool from './pages/createPool';
import CreateBracket from './pages/createBracket';

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <div className='background' />
        <Switch>
          <Route path='/pool/new' component={CreatePool} />
          <Route path='/pool/:id'>
            <div>Join Pool </div>
          </Route>
          <Route path='/brackets/new' component={CreateBracket} />
          <Route path='/brackets/:id'>
            <div> View Bracket </div>
          </Route>
          <Route path='/brackets' component={BracketPage} />
          <Route path='/about'>
            <div> About </div>
          </Route>
          <Route path='/'>
            <div> Home </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
