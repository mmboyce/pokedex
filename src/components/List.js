import React from 'react';
import './List.css';

const pokeApiURL = 'https://pokeapi.co/api/v2/pokemon';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.fetchAllPokemon = this.fetchAllPokemon.bind(this);
    this.loadPokemonList = this.loadPokemonList.bind(this);
  }

  componentDidMount() {
    this.fetchAllPokemon(this.loadPokemonList)
      .catch((error) => this.setState({ pokemonList: error }));
  }

  async fetchAllPokemon(callback) {
    // ?limit=-1 allows us to request all pokemon in the databses
    const response = await fetch(`${pokeApiURL}?limit=-1`, { mode: 'cors' });

    if (response.ok) {
      const data = await response.json();

      const { results } = data;

      this.setState({
        results,
      });
    } else {
      throw new Error(response.status);
    }

    callback();
  }

  loadPokemonList() {
    // This should be used as a callback to fetchAllPokemon

    // Being called after the state changes as a callback lets us work with
    // all the resultant state changes.

    const { results } = this.state;

    const pokemonList = results.map((pokemon) => {
      const { name } = pokemon;
      const { url } = pokemon;

      const urlPieces = url.split('/');
      // the second to last piece of the url contains the ID of the pokemon
      const id = urlPieces[urlPieces.length - 2];

      if (id > 10000) {
      // remove alternates from results
      // once the ID's cease to be sequential and jump to 5 digit numbers,
      // these pokemon should not be included
        return undefined;
      }

      // This replaces all hyphens in the name with spaces
      const formattedName = name.split('-').join(' ');

      return <li className="sidebar-name">{formattedName}</li>;
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
