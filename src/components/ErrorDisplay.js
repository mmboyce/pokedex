import React from 'react';
import PropTypes from 'prop-types';

import './ErrorDisplay.css';

function ErrorDisplay(props) {
  const { errWhen, message } = props;
  return (
    <div
      id=".error-msg"
      data-testid="error-msg"
    >
      {`$Error when ${errWhen}: ${message}`}
    </div>
  );
}

ErrorDisplay.propTypes = {
  message: PropTypes.string.isRequired,
  errWhen: PropTypes.string.isRequired,
};

export default ErrorDisplay;
