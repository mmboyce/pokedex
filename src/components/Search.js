import React from 'react';
import './Search.css';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  render() {
    const { list } = this.state;

    return (
      <div id="search-container">
        <div id="search-box">
          <input placeholder="Search Pokemon..." />
        </div>
        <div id="search-dropbox">
          <ul>
            {list}
          </ul>
        </div>
      </div>
    );
  }
}

export default Search;
