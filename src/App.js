import React from 'react';
import PropTypes from 'prop-types';
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

// TODO LOCALSTORAGE: Include id in local storage
// TODO TEST: Test all functions

const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon';

const appKeys = {
  redirect: 'appKeyRedirect',
};

function getIdFromUrl(url) {
  const urlPieces = url.split('/');
  // the second to last piece of the url contains the ID of the pokemon
  const id = urlPieces[urlPieces.length - 2];

  return id;
}

function LoadingScreen(props) {
  const { className } = props;

  return (
    <div id="loading-screen" className={className}>
      <div id="loading-center">
        Pokédex
      </div>
    </div>
  );
}

function MainContainer(props) {
  const { id } = useParams();
  const { results } = props;
  const limit = results.length;

  let pokedex = (
    <Pokedex
      resultsLength={limit}
      id={id}
      pokeApiUrl={pokeApiUrl}
    />
  );

  if (id > limit) {
  // If the ID param is greater than the limit redirect to the last pokemon.
    pokedex = <Redirect to={`/${limit}`} />;
  } else if (id < 1 || (!(id <= 807) && !(id >= 1))) {
    // If the ID param is less than 1 or does not fall within the bounds,
    // redirect to the first pokemon.

    // Useful for invalid params instead of a 404
    pokedex = <Redirect to="/1" />;
  }

  localStorage.setItem(appKeys.redirect, `/${id}`);

  return (
    <div id="main-container">
      <Search results={results} />
      {pokedex}
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.fetchAllPokemon = this.fetchAllPokemon.bind(this);
    this.formatResults = this.formatResults.bind(this);

    this.state = {
      results: {},
      loaded: false,
    };
  }

  componentDidMount() {
    // TODO TEST: Handle errors differently
    this.fetchAllPokemon().then(this.formatResults).catch((error) => { console.log(error); });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loaded } = this.state;

    return (!loaded && nextState.loaded);
  }

  async fetchAllPokemon() {
    // ?limit=-1 allows us to request all pokemon in the databses
    const response = await fetch(`${pokeApiUrl}?limit=-1`, { mode: 'cors' });

    if (response.ok) {
      const data = await response.json();

      const { results } = data;

      this.setState({
        results,
      });

      return results;
    }
    throw new Error(response.status);
  }

  formatResults(results) {
    // This should be used as a callback to fetchAllPokemon

    // This function will add ID's to each object and remove entries that should not be included
    // from the array. (e.g.: when the entry id's jump to five digits to represent variations of a
    // form)

    const formattedList = results.filter((pokemon) => {
      // remove alternates from results
      const { url } = pokemon;
      const id = getIdFromUrl(url);

      // once the ID's cease to be sequential and jump to 5 digit numbers,
      // these pokemon should not be included
      return (!(id > 10000));
    }).map((pokemon) => {
      const { name } = pokemon;
      const { url } = pokemon;
      const id = getIdFromUrl(url);

      // This replaces all hyphens in the name with spaces
      const formattedName = name.split('-').join(' ');

      return {
        name: formattedName,
        url,
        id,
      };
    });

    this.setState({
      results: formattedList,
      loaded: true,
    });
  }

  render() {
    const { results, loaded } = this.state;

    const storedID = localStorage.getItem(appKeys.redirect);
    const indexRedirectTo = storedID === null ? '/1' : storedID;

    // LoadedBody is used so that we do not try to pass props from an asynchronous call
    // before the state is ready for it
    const loadedBody = (
      <Router>
        <List results={results} />
        <Switch>
          <Route path="/:id">
            <MainContainer results={results} />
          </Route>
          <Route path="/">
            <Redirect to={indexRedirectTo} />
          </Route>
        </Switch>
      </Router>
    );

    const loadingScreen = loaded
      ? <LoadingScreen className="loaded" />
      : <LoadingScreen />;

    const appBody = loaded
      ? loadedBody : <></>;

    return (
      <div className="App">
        {loadingScreen}
        {appBody}
      </div>
    );
  }
}

LoadingScreen.propTypes = {
  className: PropTypes.string,
};

LoadingScreen.defaultProps = {
  className: '',
};

MainContainer.propTypes = {
  // For some reason this gives a message in the console about being supplied an object
  // when expecting an array, and expecting an array when being supplied an object.
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default App;
