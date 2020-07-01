import React from 'react';
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
        <li className="sidebar-name" key={id}>
          <Link to={`/${id}`}>
            {name}
          </Link>
        </li>
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
        <p>List of Pokemon</p>
        <ol>
          {pokemonList}
        </ol>
      </div>
    );
  }
}

export default List;
