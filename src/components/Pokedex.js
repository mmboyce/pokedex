import React from 'react';
import './Pokedex.css';
import { pokeApiURL } from './List.js';

class Pokedex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentId: 1,
      nextId: 2,
      prevId: 807,
    };

    this.fetchInfo = this.fetchInfo.bind(this);
    this.handleLoadInfo = this.handleLoadInfo.bind(this);
    this.handleLoadNext = this.handleLoadNext.bind(this);
    this.handleLoadPrev = this.handleLoadPrev.bind(this);
  }

  componentDidMount() {
    const { currentId } = this.state;

    this.fetchInfo(currentId, this.handleLoadInfo)
      .catch((error) => alert(error));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { currentId } = this.state;
    const { sprite } = this.state;

    return currentId !== nextState.currentId
      || (sprite === undefined && nextState.sprite !== undefined)
      || (sprite !== nextState.sprite);
  }

  componentDidUpdate() {
    const { currentId } = this.state;

    this.fetchInfo(currentId, this.handleLoadInfo)
      .catch((error) => alert(error));
  }

  async fetchInfo(id, callback) {
    const response = await fetch(`${pokeApiURL}/${id}`);

    if (response.ok) {
      const data = await response.json();

      let { name, weight, height } = data;
      const sprite = data.sprites.front_default;

      // Replace hyphens in names with spaes
      name = name.split('-').join(' ');

      // Convert decimeters to meters
      height *= 0.1;

      // Convert hectograms to kilograms
      weight *= 0.1;

      this.setState({
        name,
        weight,
        height,
        sprite,
      });
    } else {
      throw new Error(response.status);
    }

    callback();
  }

  handleLoadInfo() {
    const {
      currentId, name, weight, height, sprite,
    } = this.state;

    [name, weight, height, sprite].map((property) => {
      if (property === undefined) {
        return 'loading';
      }
      return property;
    });

    return (
      <div id="pokedex-content">
        <div id="display">
          <img src={sprite} alt={name} />
        </div>
        <div id="buttons">
          <button type="button" onClick={this.handleLoadPrev}>prev</button>
          <button type="button" onClick={this.handleLoadNext}>next</button>
        </div>
        <div id="stats">
          <ul>
            <li>
              #
              {currentId}
            </li>
            <li>
              Name:
              {' '}
              {name}
            </li>
            <li>
              Weight:
              {' '}
              {weight}
              kg
            </li>
            <li>
              Height:
              {' '}
              {height}
              m
            </li>
          </ul>
        </div>
      </div>
    );
  }

  handleLoadNext() {
    const { currentId, prevId, nextId } = this.state;
    let newCurr = currentId;
    let newPrev = prevId;
    let newNext = nextId;

    if (currentId === 806) {
      newCurr += 1;
      newPrev = newCurr - 1;
      newNext = 1;
    } else {
      newCurr = nextId;
      newPrev = currentId;
      newNext = newCurr + 1;
    }

    this.setState({
      currentId: newCurr,
      prevId: newPrev,
      nextId: newNext,
    });
  }

  handleLoadPrev() {
    const { currentId, prevId, nextId } = this.state;
    let newCurr = currentId;
    let newPrev = prevId;
    let newNext = nextId;

    if (currentId === 2) {
      newCurr -= 1;
      newPrev = 807;
      newNext = newCurr + 1;
    } else {
      newCurr = prevId;
      newPrev = newCurr - 1;
      newNext = currentId;
    }

    this.setState({
      currentId: newCurr,
      prevId: newPrev,
      nextId: newNext,
    });
  }

  render() {
    return (
      <div id="pokedex">
        <p>pokedex</p>
        {this.handleLoadInfo()}
      </div>
    );
  }
}

export default Pokedex;
