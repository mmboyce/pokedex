import React from 'react';
import './App.css';
import { List } from './components/List';
import Pokedex from './components/Pokedex';
import 'normalize.css';

function App() {
  return (
    <div className="App">
      <List />
      <div id="main-container">
        <Pokedex />
      </div>
    </div>
  );
}

export default App;
