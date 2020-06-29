import React from 'react';
import './App.css';
import { List } from './components/List';
import Search from './components/Search';
import Pokedex from './components/Pokedex';
import 'normalize.css';

function App() {
  return (
    <div className="App">
      <List />
      <div id="main-container">
        <Search />
        <Pokedex />
      </div>
    </div>
  );
}

export default App;
