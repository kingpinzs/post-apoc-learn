import React from 'react';
import PropTypes from 'prop-types';
import ApocalypseGame from './Game';

const SecurityTrainingApp = ({ practice = false }) => (
  <div className="h-full overflow-auto" data-testid="security-training-app">
    <ApocalypseGame practice={practice} />
  </div>
);

SecurityTrainingApp.propTypes = {
  practice: PropTypes.bool,
};

export default SecurityTrainingApp;
