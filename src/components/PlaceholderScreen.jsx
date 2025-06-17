import React from 'react';
import PropTypes from 'prop-types';

const PlaceholderScreen = ({ name }) => (
  <div className="p-4 text-green-400" data-testid="placeholder-screen">
    {name} coming soon...
  </div>
);

PlaceholderScreen.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PlaceholderScreen;
