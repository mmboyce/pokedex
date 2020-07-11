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

// TODO TEST: Test all functions

const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon';

/**
 * This enum contains the names of keys for localStorage
 * @enum {string}
 */
const appKeys = {
  /** The key for the pokemon ID the user was on when their session ended */
  redirect: 'appKeyRedirect',
};

/**
 * A method to extract the ID of a pokemon from the url to its JSON info.
 * @param {string} url A url containing an ID
 * @returns {string} The ID as a string.
 */
function getIdFromUrl(url) {
  const urlPieces = url.split('/');
  // the second to last piece of the url contains the ID of the pokemon
  const id = urlPieces[urlPieces.length - 2];

  return id;
}

/**
 * The LoadingScreen Component displays the splash screen for our app.
 * If it is not supplied a className of "loaded" by its parent, it will stay visible. Otherwise it
 * ceases to be displayed.
 * @component
 * @param {Object} props
 * @param {string} props.className
 * @returns {JSX.Element}
 * @example
 * let loadedStyle
 *
 * <LoadingScreen className={loadedStyle} />
 */
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

/**
 * The MainContainer Component houses the Search and Pokedex components.
 * @component
 * @param {Object} props
 * @param {Object} props.results
 * @returns {JSX.Element}
 * @example
 * let results = [{}]
 *
 * <MainContainer results={results} />
 */
function MainContainer(props) {
  // This fetches the id param from the route the user is currently at.
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

/**
 * The App Component is the heart of the app. It displays the LoadingScreen
 * atop the other components, suchas List and MainContainer,
 * while the asynchronous calls in its children run. Once they are completed, the LoadingScreen is
 * set to "loaded" and fades away to reveal the interactable MainContainer.
 * @class App
 * @extends {React.Component}
 * @example
 * <App />
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    this.fetchAllPokemon = this.fetchAllPokemon.bind(this);
    this.formatResults = this.formatResults.bind(this);

    this.state = {
      // Results will contain
      results: {},
      isLoaded: false,
    };
  }

  /**
   * This method handles async fetchAllPokemon and calls formatResults as a callback once the
   * App component has mounted in the DOM.
   * @memberof App
   */
  componentDidMount() {
    // TODO TEST: Handle errors differently
    this.fetchAllPokemon().then(this.formatResults).catch((error) => { console.log(error); });
  }

  /**
   * This method checks if the app is done fething and formatting results before fading the
   * loading screen.
   * @memberof App
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { isLoaded } = this.state;

    return (!isLoaded && nextState.isLoaded);
  }

  /**
   * This method requests the list of all pokemon on the PokeAPI. Once it receives the response, it
   * updates this component's state to include the results.
   * @returns {Array} The results array from the request for JSON object representing all
   * pokemon.
   * @async
   * @memberof App
   * @throws Error representing resulting status of the async request.
   */
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

  /**
   * This method should be used as a callback to fetchAllPokemon
   *
   * This function removes hyphens from the pokemon names and also adds ID's to each object, and
   * removes from the array entries that should not be included.
   *
   * (e.g.: when the entry id's jump to five digits to represent cosmetic variations of an
   * evolution)
   *
   * It then modifies the state to contain the formatted list, and indicates that the app has
   * loaded.
   * @param {Object[]} results
   * @param {string} results[].name
   * @param {string} results[].url
   * @memberof App
   *
   * @example
   * this.fetchAllPokemon().then(this.formatResults)
   */
  formatResults(results) {
    const formattedList = results.filter((pokemon) => {
      // remove alternates from results
      const { url } = pokemon;
      const id = getIdFromUrl(url);

      // once the ID's cease to be sequential and jump to 5 digit numbers,
      // these pokemon should not be included
      return (!(id > 10000));
    }).map((pokemon) => {
      // Now that the alternates have been filtered out, format names, and get IDs
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
      isLoaded: true,
    });
  }

  render() {
    const { results, isLoaded } = this.state;

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

    const loadingScreen = isLoaded
      ? <LoadingScreen className="loaded" />
      : <LoadingScreen />;

    const appBody = isLoaded
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
