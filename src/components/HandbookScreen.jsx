import React from 'react';

/**
 * Survival handbook containing short references.
 */
const sections = [
  {
    title: 'Security Basics',
    text: 'Always secure your terminals and rotate keys frequently.',
  },
  {
    title: 'Command Reference',
    text: 'Use `ls`, `cd`, and `cat` to explore the file system.',
  },
  {
    title: 'Survival Tips',
    text: 'Avoid radiation hotspots and scavenge safe houses for supplies.',
  },
];

const HandbookScreen = () => (
  <div className="p-4 space-y-4" data-testid="handbook-screen">
    {sections.map((s) => (
      <div key={s.title}>
        <h3 className="text-green-400 font-semibold">{s.title}</h3>
        <p className="text-green-200 text-sm">{s.text}</p>
      </div>
    ))}
  </div>
);

export default HandbookScreen;
