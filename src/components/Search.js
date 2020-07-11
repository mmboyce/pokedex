import React from 'react';
import { Redirect } from 'react-router-dom';
import Autocomplete from 'react-autocomplete';

import PropTypes from 'prop-types';

import './Search.css';

/**
 * This enum contains keys for localStorage.
 * @enum {string}
 */
const listKeys = {
  value: 'listKeyValue',
};

/**
 * A helper function to determine whether an item in the Autocomplete dropdown menu should
 * render.
 *
 * It checks to see if what is in the textbox is found within the name of the pokemon.
 * @param {Object} pokemon The pokemon to compare inputValue against.
 * @param {string} pokemon.name
 * @param {string} pokemon.url
 * @param {string} pokemon.id
 * @param {string} inputValue The text the user has put in the searchbox.
 * @returns {boolean} If the user's input matches the current pokemon.
 * @example
 * <Autocomplete shouldItemRender={handleMatchPokemon} />
 */
function handleMatchPokemon(pokemon, inputValue) {
  return pokemon.name.indexOf(inputValue.toLowerCase()) !== -1;
}

/**
 * A helper function that returns a capitalized version of a supplied string.
 * @param {string} toCapitalize The uncapitalized text.
 * @returns {string} The capitalized version of the supplied string.
 */
function capitalizeString(toCapitalize) {
  const split = toCapitalize.split('');

  split[0] = split[0].toUpperCase();

  return split.join('');
}

/**
 * The Search Component displays a textbox which redirects to the Pokemon with the matching name
 * entered in its field. As the user types into the textbox, an autocomplete search appears which
 * also redirects when a name is selected.
 * @component
 * @class Search
 * @extends {React.Component}
 * @example
 * const results = [{}]
 *
 * <Search results={results} onFocus={onFocus} onBlur={onBlur} />
 */
class Search extends React.Component {
  constructor(props) {
    super(props);

    /** The value in localStorage that represents what was in the search input when the user's
     * previous session ended.
    */
    const cachedValue = localStorage.getItem(listKeys.value);
    /** The text stored in the search input field of the component. */
    const value = cachedValue === null ? '' : cachedValue;

    this.state = {
      redirect: false,
      value,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * This function sets state.value to match what is in the textbox of the component.
   * After that, it triggers the onFocus() function to blur the other components sharing
   * its parent.
   * @param {Event} e The onChange event that triggered this method.
   * @memberof Search
   * @example
   * <Autocomplete onChange={this.handleChange} />
   */
  handleChange(e) {
    const { onFocus } = this.props;
    const { value } = e.target;

    this.setState({
      value,
      redirect: false,
    });

    // OnFocus is called here for a situation where the user never loses focus of the input
    // after submitting a pokemon, and starts typing again.
    onFocus();

    localStorage.setItem(listKeys.value, value);
  }

  /**
   * This function is triggered when the user either submits the text in the search box, or when
   * they select a pokemon from the autocomplete dropdown.
   *
   * It seeks a match based on the input, and if it finds one it sets the redirect state to match
   * that pokemon's id.
   * @memberof Search
   * @example
   * <Autocomplete onSelect={this.handleSearch} />
   */
  handleSearch() {
    const { results } = this.props;
    const { value } = this.state;
    let findId = false;

    const match = results.find((pokemon) => pokemon.name === value.toLowerCase());

    if (match !== undefined) {
      findId = match.id;
    }

    // Why set localStorage again if it is set whenever a change is made?
    // This is to account for when the user has clicked on a Pokemon's name in the dropdown
    // instead of typing it out fully, since that doesn't trigger a change event.
    localStorage.setItem(listKeys.value, value);

    this.setState({
      redirect: findId,
    });
  }

  render() {
    const { redirect, value } = this.state;
    /**
     * onFocus and onBlur events are the opposite of each other!
     * onBlur occurs when an object loses focus, and counterintuitively, we want to
     * get rid of the blur effect when this happens!
     */
    const { results, onFocus, onBlur } = this.props;

    /** If state.redirect is false, no redirect occurs, but if it is an ID we redirect to that ID */
    const redirectTo = redirect === false ? (<></>) : (<Redirect to={`/${redirect}`} />);

    return (
      <div id="search-container">
        <Autocomplete
          value={value}
          inputProps={{
            id: 'search-box',
            placeholder: 'Search Pokémon...',
            onFocus,
            onBlur,
          }}
          wrapperStyle={{ position: 'relative' }}
          items={results}
          getItemValue={(pokemon) => pokemon.name}
          shouldItemRender={handleMatchPokemon}
          onChange={this.handleChange}
          /** Once the a value is submitted or a dropdown has been selected, the text in the
           * textbox is formatted to be capitalized, and handleSearch is called as a callback
           * of setState to hanlde the redirect to the submitted pokemon.
           *
           * ADDITIONALLY, onBlur is called after a submission to remove the blur effect.
           * Counter intutitive event naming, thanks html5.
           */
          onSelect={(input) => this.setState({ value: capitalizeString(input) }, () => {
            this.handleSearch();
            onBlur();
          })}
          renderMenu={(children) => (
            <div className="menu">
              {children}
            </div>
          )}
          renderItem={(pokemon, isHighlighted) => (
            <div
              className={`item ${isHighlighted ? 'item-highlighted' : 'not-highlighted'}`}
              key={pokemon.name}
            >
              {pokemon.name}
            </div>
          )}
        />
        {redirectTo}
      </div>
    );
  }
}

Search.propTypes = {
  // For some reason this gives a message in the console about being supplied an object
  // when expecting an array, and expecting an array when being supplied an object.
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Search;
