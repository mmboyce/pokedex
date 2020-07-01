import React from 'react';
import { Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import './Search.css';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      redirect: false,
    };
  }

  handleChange(e) {
    this.setState({
      input: e.target.value,
    });
  }

  handleSearch(e) {
    const { results } = this.props;
    const { input } = this.state;
    let findId = false;

    const match = results.find((pokemon) => pokemon.name === input.toLowerCase());

    if (match !== undefined) {
      findId = match.id;
    }

    this.setState({
      redirect: findId,
    });

    e.preventDefault();
  }

  render() {
    const { redirect } = this.state;

    const shouldRedirect = redirect !== false;

    const body = shouldRedirect
      ? <Redirect to={`/${redirect}`} />
      : (
        <>
          <div id="search-box">
            <form onSubmit={this.handleSearch}>
              <input onChange={this.handleChange} placeholder="Search Pokemon..." />
            </form>
          </div>
          <div id="search-dropbox">
            <ul>
              { /* list goes here */}
            </ul>
          </div>
        </>
      );

    return (
      <div id="search-container">
        {body}
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
