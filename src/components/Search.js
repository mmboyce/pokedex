import React from 'react';
import PropTypes from 'prop-types';

import './Search.css';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const { results } = this.props;

    return (
      <div id="search-container">
        <div id="search-box">
          <input placeholder="Search Pokemon..." />
        </div>
        <div id="search-dropbox">
          <ul>
            { /* list goes here */}
          </ul>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
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

export default Search;
