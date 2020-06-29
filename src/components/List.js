import React from 'react';

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
    this.fetchAllPokemon(this.loadPokemonList);
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

      return <li>{name}</li>;
    });

    this.setState({
      pokemonList,
    });
  }

  render() {
    const { pokemonList } = this.state;

    return (
      <div id="list">
        <p>List of Pokemon</p>
        <ol>
          {pokemonList}
        </ol>
      </div>
    );
  }
}

export default List;
