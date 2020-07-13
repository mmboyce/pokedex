import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';

import './List.css';

/**
 * The List Component displays a list of all Pokemon supplied by its results prop.
 * @component
 * @param {Object} props
 * @param {Object[]} props.results
 * @param {string} props.results[].name
 * @param {string} props.results[].id
 * @param {string} props.results[].url
 * @returns {JSX.Element}
 * @example
 * const results = [{}]
 *
 * <List results={results} />
 */
function List(props) {
  const { results } = props;

  const pokemonList = results.map((pokemon) => {
    const { name } = pokemon;
    const { id } = pokemon;

    // This is the ID displayed in the list.
    let textID = id;

    // Check its length and add appropriate 0's until the
    // resulting ID is 3 digits for formatting purposes
    const { length: resultsLength } = results;
    const maxNumberLength = `${resultsLength}`.length;

    const lengthDifference = maxNumberLength - textID.length;

    for (let i = 0; i < lengthDifference; i += 1) {
      textID = `0${textID}`;
    }

    return (
      <Link
        to={`/${id}`}
        className="sidebar-link"
        key={id}

      >
        <div
          className="sidebar-item"
        >
          <div className="sidebar-id" data-testid={`sidebar-id-${id}`}>
            #
            {textID}
            :
          </div>
          {name}
        </div>
      </Link>
    );
  });

  return (
    <div id="sidebar" data-testid="sidebar">
      <p>Pokédex Entries</p>
      {pokemonList}
    </div>
  );
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
