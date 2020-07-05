import React from 'react';
import { Redirect } from 'react-router-dom';
import Autocomplete from 'react-autocomplete';

import PropTypes from 'prop-types';

import './Search.css';

function handleMatchPokemon(pokemon, inputValue) {
  return pokemon.name.indexOf(inputValue.toLowerCase()) !== -1;
}

function capitalizeString(toCapitalize) {
  const split = toCapitalize.split('');

  split[0] = split[0].toUpperCase();

  return split.join('');
}

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      value: '',
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
      redirect: false,
    });
  }

  handleSearch() {
    const { results } = this.props;
    const { value } = this.state;
    let findId = false;

    const match = results.find((pokemon) => pokemon.name === value.toLowerCase());

    if (match !== undefined) {
      findId = match.id;
    }

    this.setState({
      redirect: findId,
    });
  }

  render() {
    const { redirect, value } = this.state;
    const { results } = this.props;

    const redirectTo = redirect === false ? (<></>) : (<Redirect to={`/${redirect}`} />);

    return (
      <div id="search-container">
        <Autocomplete
          value={value}
          inputProps={{ id: 'search-box', placeholder: 'Search Pokemon...' }}
          wrapperStyle={{ position: 'relative' }}
          items={results}
          getItemValue={(pokemon) => pokemon.name}
          shouldItemRender={handleMatchPokemon}
          onChange={this.handleChange}
          onSelect={(input) => this.setState({ value: capitalizeString(input) }, this.handleSearch)}
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
};

export default Search;
