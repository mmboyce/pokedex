import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  Redirect,
} from 'react-router-dom';

import './Pokedex.css';

const loadingSvgSrc = `${process.env.PUBLIC_URL}/img/loading.svg`;

// Class names for loadingGif and sprite imgs.
const spriteVisible = 'sprite-visible';
const spriteHidden = 'sprite-hidden';

const loadingText = 'loading...';

function Sprite(props) {
  const { sprite, name } = props;

  const [loadingGifVisibility, setLoadingGifVisiblity] = useState(spriteVisible);
  const [spriteVisibility, setSpriteVisibility] = useState(spriteHidden);
  const spritePresent = sprite !== loadingText;

  const handleImageLoad = () => {
    setLoadingGifVisiblity(spriteHidden);
    setSpriteVisibility(spriteVisible);
  };

  const spriteElement = spritePresent ? (
    <img
      src={sprite}
      alt={name}
      onLoad={handleImageLoad}
      className={spriteVisibility}
      id="sprite-image"
    />
  ) : (<></>);

  return (
    <>
      {spriteElement}
      <img
        src={loadingSvgSrc}
        alt="Buffering"
        className={spritePresent ? loadingGifVisibility : spriteVisible}
        id="loading-image"
      />
    </>
  );
}

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
      navClicked: true,
    };

    this.fetchInfo = this.fetchInfo.bind(this);
    this.handleLoadChange = this.handleLoadChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);

    // TODO TEST: Handle errors differently
    this.fetchInfo()
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
    this.fetchInfo()
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
        name,
        weight,
        height,
        sprite,
        types,
        navClicked: false,
        redirect: false,
      });
    } else {
      throw new Error(response.status);
    }
  }

  handleLoadChange(change) {
    const { id, resultsLength } = this.props;
    let newId = +id + change;

    if (newId < 1) {
      newId = resultsLength;
    } else if (newId > resultsLength) {
      newId = 1;
    }

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

  handleNavClick() {
    this.setState({
      navClicked: true,
    });
  }

  render() {
    // if redirect is not false, then we need to redirect to where the
    // key press has indicated.
    // This is workaround for useHistory not being available to component classes.
    const { redirect } = this.state;

    const redirectTo = <Redirect to={redirect} />;

    const { id } = this.props;

    const {
      name, weight, height, sprite, types, navClicked,
    } = this.state;

    // As verbose as these four lines are, using a destructured array after map arrow
    // function didn't work for these exact same constants. Not sure why, but this
    // works whereas the way it is written in the previous commit doesn't.
    const displayName = (name === undefined || navClicked) ? loadingText : name;
    const displaySprite = (sprite === undefined || navClicked) ? loadingText : sprite;
    const displayWeight = (weight === undefined || navClicked) ? loadingText : weight;
    const displayHeight = (height === undefined || navClicked) ? loadingText : height;

    const prev = this.handleLoadChange(-1);
    const next = this.handleLoadChange(+1);

    const pokedexContent = (
      <div id="pokedex-content">
        <div id="display">
          <p id="id-text">
            #
            {id}
          </p>
          <Sprite name={displayName} sprite={displaySprite} />
          {types !== undefined ? <Type types={types} /> : ''}
        </div>
        <div id="buttons">
          <Link to={`/${prev}`} onClick={this.handleNavClick}>Prev</Link>
          <Link to={`/${next}`} onClick={this.handleNavClick}>Next</Link>
        </div>
        <div id="stat-container">
          <div id="stats">
            <div className="stat-line">
              <div className="stat-left">Name:</div>
              <div className="stat-right">
                {displayName}
              </div>
            </div>
            <div className="stat-line">
              <div className="stat-left">Height:</div>
              <div className="stat-right">
                {displayHeight === loadingText ? loadingText : `${displayHeight}m`}
              </div>
            </div>
            <div className="stat-line">
              <div className="stat-left">Weight:</div>
              <div className="stat-right">
                {displayWeight === loadingText ? loadingText : `${displayWeight}kg`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div id="pokedex">
        {redirect ? redirectTo : pokedexContent}
      </div>
    );
  }
}

Sprite.propTypes = {
  sprite: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

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
  resultsLength: PropTypes.number.isRequired,
};

export default Pokedex;
