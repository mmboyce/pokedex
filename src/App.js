import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect,
} from 'react-router-dom';

import List from './components/List';
import Search from './components/Search';
import Pokedex from './components/Pokedex';

import './App.css';
import 'normalize.css';

const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon';

function MainContainer() {
  const { id } = useParams();
  const limit = 807; // TODO: Don't hardcode limit

  let pokedex = <Pokedex id={id} pokeApiUrl={pokeApiUrl} />;

  if (id > limit) {
    pokedex = <Redirect to="/1" />;
  } else if (id < 1) {
    pokedex = <Redirect to={`/${limit}`} />;
  }

  return (
    <div id="main-container">
      <Search />
      {pokedex}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <List pokeApiUrl={pokeApiUrl} />
        <Switch>
          <Route path="/:id">
            <MainContainer />
          </Route>
          <Route path="/">
            <Redirect to="/1" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
