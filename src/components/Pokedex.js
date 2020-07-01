import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  Redirect,
} from 'react-router-dom';

import './Pokedex.css';

class Pokedex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };

    this.fetchInfo = this.fetchInfo.bind(this);
    this.handleLoadInfo = this.handleLoadInfo.bind(this);
    this.handleLoadChange = this.handleLoadChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);

    this.fetchInfo().then(this.handleLoadInfo)
      .catch((error) => alert(error));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { id } = this.props;
    const { sprite, redirect } = this.state;

    // These checks are to prevent against constant pulling of JSON and slowing down
    // the application
    const currentIdDoesNotMatchNextId = id !== nextProps.id;
    const currentSpriteIsUndefinedAndNextSpriteIsNot = sprite === undefined
      && nextState.sprite !== undefined;
    const nextSpriteIsDifferentFromCurrentSprite = sprite !== nextState.sprite;
    const redirectIsNecessary = redirect === false && nextState.redirect !== false;

    return currentIdDoesNotMatchNextId
      || currentSpriteIsUndefinedAndNextSpriteIsNot
      || nextSpriteIsDifferentFromCurrentSprite
      || redirectIsNecessary;
  }

  componentDidUpdate() {
    this.fetchInfo(this.handleLoadInfo)
      .catch((error) => alert(error));
  }

  async fetchInfo() {
    const { id, pokeApiUrl } = this.props;

    const response = await fetch(`${pokeApiUrl}/${id}`);

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

      // Round to 2 decimal places
      height = Math.round(height * 100) / 100;
      weight = Math.round(weight * 100) / 100;

      this.setState({
        id,
        name,
        weight,
        height,
        sprite,
        redirect: false,
      });
    } else {
      throw new Error(response.status);
    }
  }

  handleLoadInfo() {
    const {
      id, name, weight, height, sprite,
    } = this.state;

    [name, weight, height, sprite].map((property) => {
      if (property === undefined) {
        return 'loading';
      }
      return property;
    });

    const prev = this.handleLoadChange(-1);
    const next = this.handleLoadChange(+1);

    return (
      <div id="pokedex-content">
        <p>
          #
          {id}
        </p>
        <div id="display">
          <img src={sprite} alt={name} />
        </div>
        <div id="buttons">
          <Link to={`/${prev}`}>Prev</Link>
          <Link to={`/${next}`}>Next</Link>
        </div>
        <div id="stats">
          <ul id="stat-left">
            <li>Name:</li>
            <li>Height:</li>
            <li>Weight:</li>
          </ul>
          <ul id="stat-right">
            <li>
              {name}
            </li>
            <li>
              {height}
              m
            </li>
            <li>
              {weight}
              kg
            </li>
          </ul>
        </div>
      </div>
    );
  }

  handleLoadChange(change) {
    const { id } = this.props;
    const newId = +id + change;

    return newId;
  }

  handleKeyDown(e) {
    const { keyCode } = e;
    const prev = `/${this.handleLoadChange(-1)}`;
    const next = `/${this.handleLoadChange(1)}`;
    let redirect = false;

    // left arrow keyDown
    if (keyCode === 37) {
      redirect = prev;
    }

    // right arrow keyDown
    if (keyCode === 39) {
      redirect = next;
    }

    this.setState({
      redirect,
    });
  }

  render() {
    // if redirect is not false, then we need to redirect to where the
    // key press has indicated.
    // This is workaround for useHistory not being available to event listeners.
    const { redirect } = this.state;

    const redirectTo = <Redirect to={redirect} />;

    return (
      <div id="pokedex">
        {redirect ? redirectTo : this.handleLoadInfo()}
      </div>
    );
  }
}

Pokedex.propTypes = {
  id: PropTypes.string.isRequired,
  pokeApiUrl: PropTypes.string.isRequired,
};

export default Pokedex;
