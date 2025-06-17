import React from 'react';
import PropTypes from 'prop-types';
import { scriptTemplates } from '../../lib/scriptTemplates';

const TEMPLATES = {
  bash: ['init', 'end'],
  python: ['init', 'end'],
  basicScan: scriptTemplates.basicScan,
  attack: scriptTemplates.attack,
  defense: scriptTemplates.defense,
};

const LABELS = {
  bash: 'bash',
  python: 'python',
  basicScan: 'Basic Scan Script',
  attack: 'Attack Script',
  defense: 'Defense Script',
};

const TemplateSelector = ({ onSelect }) => {
  return (
    <select
      onChange={e => onSelect(TEMPLATES[e.target.value])}
      className="border rounded-md p-1 bg-black text-green-400"
      data-testid="template-selector"
    >
      <option value="">Select Template</option>
      {Object.keys(TEMPLATES).map(name => (
        <option key={name} value={name}>
          {LABELS[name] || name}
        </option>
      ))}
    </select>
  );
};

TemplateSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default TemplateSelector;
