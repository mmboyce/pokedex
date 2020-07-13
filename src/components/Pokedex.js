import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  Redirect,
} from 'react-router-dom';

import './Pokedex.css';

const loadingSvgSrc = `${process.env.PUBLIC_URL}/img/loading.svg`;

/**
 * Enum representing class names for loadingGif and sprite imgs.
 * @enum {string}
 */
const spriteStates = {
  spriteVisible: 'sprite-visible',
  spriteHidden: 'sprite-hidden',
};

const loadingText = 'loading...';

/**
 * The Sprite Component handles displaying a Sprite via its url provided in the sprite prop. The
 * name prop is used as its alt text.
 *
 * Prior to the sprite loading, a loading gif is displayed.
 * @component
 * @param {Object} props
 * @param {string} props.sprite
 * @param {string} props.name
 * @returns {JSX.Element}
 * @example
 * const sprite = "link_to_sprite.png"
 * const name = "name of pokemon"
 *
 * <Sprite name={name} sprite={sprite} />
 */
function Sprite(props) {
  const { sprite, name } = props;

  const [loadingGifVisibility, setLoadingGifVisiblity] = useState(spriteStates.spriteVisible);
  const [spriteVisibility, setSpriteVisibility] = useState(spriteStates.spriteHidden);
  const spritePresent = sprite !== loadingText;

  /**
   * Once the sprite image has loaded this alternates the loading gif from being rendered and
   * renders the sprite in its place.
   * @example
   * <img onLoad={handleImageLoad} />
   */
  const handleImageLoad = () => {
    setLoadingGifVisiblity(spriteStates.spriteHidden);
    setSpriteVisibility(spriteStates.spriteVisible);
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
        className={spritePresent ? loadingGifVisibility : spriteStates.spriteVisible}
        id="loading-image"
      />
    </>
  );
}

/**
 * The Type Component displays the corresponding types provided to its types prop. It accounts for
 * rendering as many types as a pokemon has.
 * @component
 * @param {Object} props
 * @param {Object[]} props.types
 * @param {Object} props.types[].type
 * @param {string} props.types[].type.name
 * @returns {JSX.Element}
 * @example
 * const types = [
 *  {
 *    type: {
 *      name: 'grass',
 *    }
 *  },
 *  {
 *    type: {
 *      name: 'normal',
 *    }
 *  }
 * ];
 *
 * <Type types={types} />
 */
function Type(props) {
  const { types } = props;

  const typesText = types.map((typeObject) => typeObject.type.name);

  const typeElement = typesText.map((text) => (
    <div className={`type ${text}`} key={text}>{text}</div>
  ));

  return (
    <div id="types">
      {typeElement}
    </div>
  );
}

/**
 * The Pokedex Component contains a Pokemon's sprite, types, stats, and navigation features.
 * @class Pokedex
 * @component
 * @extends {React.Component}
 * @example
 * const id = '1';
 * const pokeApiUrl = 'apiurl.com';
 * const resultsLength = 1000
 *
 * <Pokedex id={id} pokeApiUrl={pokeApiUrl} resultsLength={resultsLength} />
 */
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

  /**
   * This method adds the listener for handleKeyDown, and handles async fechInfo once the
   * Pokedex component has mounted in the DOM.
   */
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);

    // TODO TEST: Handle errors differently
    this.fetchInfo()
      .catch((error) => alert(error));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { id, className } = this.props;
    const { sprite, redirect } = this.state;

    // These checks are to prevent against constant pulling of JSON and slowing down
    // the application
    const currentIdDoesNotMatchNextId = id !== nextProps.id;
    const currentSpriteIsUndefinedAndNextSpriteIsNot = sprite === undefined
      && nextState.sprite !== undefined;
    const nextSpriteIsDifferentFromCurrentSprite = sprite !== nextState.sprite;
    const redirectIsNecessary = redirect === false && nextState.redirect !== false;
    const didClassNameChange = className !== nextProps.className;

    return currentIdDoesNotMatchNextId
      || currentSpriteIsUndefinedAndNextSpriteIsNot
      || nextSpriteIsDifferentFromCurrentSprite
      || redirectIsNecessary
      || didClassNameChange;
  }

  /**
   * Each time we receive different props, we must fetch the info again.
   */
  componentDidUpdate() {
  // TODO TEST: Handle errors differently
    this.fetchInfo()
      .catch((error) => alert(error));
  }

  /**
   * This async method requests the data for the pokemon with the ID in the component's props.
   * Once it retrieves the data, it puts the relavant information into the component's state.
   * @async
   * @memberof Pokedex
   * @example
   * componentDidMount(){
   *  this.fetchInfo();
   * }
   * @throws Error representing resulting status of the async request.
   */
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

  /**
   * This method adds the provided amount to the current ID. It checks the bounds of the ID
   * to wrap around to the first element if traversing past the last element, and vice versa.
   * @param {number} change The amount to add to the current ID
   * @memberof Pokedex
   * @returns {number} The new ID after adding the change.
   * @example
   * // ID === 3
   * const two = handleLoadChange(-1)
   * // two === 2
   */
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

  /**
   * This method handles navigation through the Pokedex based on user key presses. It updates
   * the redirect state according to navigation to the previous or next pokemon.
   * @param {KeyboardEvent} e
   * @memberof Pokedex
   * @example
   * document.addEventListener('keydown', this.handleKeyDown);
   */
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
    }, this.handleNavClick);
  }

  /**
   * This method sets the navClicked state to true. This is used when any navigation occurs
   * and forces the pokedex to display stats as "Loading..." and the loading gif in Sprite.
   *
   * This is useful for responsive feedback as it is immediately clear that the Pokedex is
   * retrieving information for the user.
   * @memberof Pokedex
   * @example
   * <Link to="location" onClick={this.handleNavClick}>link</Link>
   */
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

    const { id, className } = this.props;

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
          <p id="id-text" data-testid="id-text">
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
      <div id="pokedex" className={className} data-testid="pokedex">
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
  className: PropTypes.string.isRequired,
};

export default Pokedex;
