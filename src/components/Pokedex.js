import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  Redirect,
} from 'react-router-dom';

import './Pokedex.css';

function Type(props) {
  const { types } = props;

  const typesText = types.map((typeObject) => typeObject.type.name);

  const typeElement = typesText.map((text) => <div className={`type ${text}`}>{text}</div>);

  return (
    <div id="types">
      {typeElement}
    </div>
  );
}

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

    // TODO TEST: Handle errors differently
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
  // TODO TEST: Handle errors differently
    this.fetchInfo().then(this.handleLoadInfo)
      .catch((error) => alert(error));
  }

  async fetchInfo() {
    const { id, pokeApiUrl } = this.props;

    const response = await fetch(`${pokeApiUrl}/${id}`);

    if (response.ok) {
      const data = await response.json();

      let { name, weight, height } = data;
      const sprite = data.sprites.front_default;

      const { types } = data;

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
        types,
        redirect: false,
      });
    } else {
      throw new Error(response.status);
    }
  }

  handleLoadInfo() {
    const {
      id, name, weight, height, sprite, types,
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
        <div id="display">
          <p id="id-text">
            #
            {id}
          </p>
          <img src={sprite} alt={name} />
          {/* TODO DISPLAY: Have a Loading img for when sprites are changing */}
          {types !== undefined ? <Type types={types} /> : ''}
        </div>
        <div id="buttons">
          <Link to={`/${prev}`}>Prev</Link>
          <Link to={`/${next}`}>Next</Link>
        </div>
        <div id="stat-container">
          <div id="stats">
            {/* TODO DISPLAY: While awaiting new stats, have these say LOADING */}
            <div className="stat-line">
              <div className="stat-left">Name:</div>
              <div className="stat-right">
                {name}
              </div>
            </div>
            <div className="stat-line">
              <div className="stat-left">Height:</div>
              <div className="stat-right">
                {height}
                m
              </div>
            </div>
            <div className="stat-line">
              <div className="stat-left">Weight:</div>
              <div className="stat-right">
                {weight}
                kg
              </div>
            </div>
          </div>
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
    const { keyCode, altKey } = e;
    const prev = `/${this.handleLoadChange(-1)}`;
    const next = `/${this.handleLoadChange(1)}`;
    let redirect = false;

    // alt+, keyDown
    if (altKey && keyCode === 188) {
      redirect = prev;
    }

    // alt+. keyDown
    if (altKey && keyCode === 190) {
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
Type.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({
      slot: PropTypes.number.isRequired,
      type: PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
};

Pokedex.propTypes = {
  id: PropTypes.string.isRequired,
  pokeApiUrl: PropTypes.string.isRequired,
};

export default Pokedex;
