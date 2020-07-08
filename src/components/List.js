import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';

import './List.css';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.loadPokemonList = this.loadPokemonList.bind(this);
  }

  componentDidMount() {
    this.loadPokemonList();
  }

  loadPokemonList() {
    const { results } = this.props;

    const pokemonList = results.map((pokemon) => {
      const { name } = pokemon;
      const { id } = pokemon;

      return (
        <Link to={`/${id}`} className="sidebar-link">
          <div className="sidebar-item">
            <div className="sidebar-id">
              #
              {id}
              :
            </div>
            {name}
          </div>
        </Link>
      );
    });

    this.setState({
      pokemonList,
    });
  }

  render() {
    const { pokemonList } = this.state;

    return (
      <div id="sidebar">
        <p>List of Pokémon</p>
        {pokemonList}
      </div>
    );
  }
}

List.propTypes = {
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

export default List;
