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
  {
    title: 'Water Purification',
    text: 'Boil collected water for at least one minute or use a trusted filter.',
  },
  {
    title: 'First Aid',
    text: 'Clean wounds and apply sterile bandages to prevent infection.',
  },
  {
    title: 'Navigation',
    text: 'Carry a physical map and compass in case electronics fail.',
  },
  {
    title: 'Fire Safety',
    text: 'Keep fires small, contained, and never leave them unattended.',
  },
  {
    title: 'Foraging',
    text: 'Learn local edible plants and avoid poisonous lookalikes.',
  },
  {
    title: 'Signaling',
    text: 'A whistle or mirror can attract rescuers from a distance.',
  },
  {
    title: 'Shelter',
    text: 'Use tarps or natural materials to stay dry and maintain body heat.',
  },
  {
    title: 'Hygiene',
    text: 'Wash your hands regularly and bury waste away from camp.',
  },
  {
    title: 'Tool Care',
    text: 'Keep knives and equipment clean and sharpened for safe use.',
  },
  {
    title: 'Vehicle Maintenance',
    text: 'Check fuel, oil levels, and tire pressure before each trip.',
  },
  {
    title: 'Weather Awareness',
    text: 'Monitor forecasts and prepare for storms or extreme heat.',
  },
  {
    title: 'Resource Management',
    text: 'Ration food and water carefully to last through long journeys.',
  },
  {
    title: 'Update Software',
    text: 'Regularly install security patches for your OS and applications.',
  },
  {
    title: 'Strong Passwords',
    text: 'Create unique passphrases with numbers and symbols for each account.',
  },
  {
    title: 'Multi-Factor Authentication',
    text: 'Require a second verification step whenever possible.',
  },
  {
    title: 'Firewall Configuration',
    text: 'Restrict inbound traffic and close unused network ports.',
  },
  {
    title: 'Antivirus Scans',
    text: 'Schedule routine scans to detect and remove malware.',
  },
  {
    title: 'Backup Strategy',
    text: 'Keep encrypted backups offline or in trusted cloud storage.',
  },
  {
    title: 'Phishing Awareness',
    text: 'Verify email senders and avoid clicking unknown links.',
  },
  {
    title: 'Secure Wi-Fi',
    text: 'Use WPA2 or WPA3 encryption with a strong router password.',
  },
  {
    title: 'Least Privilege',
    text: 'Operate daily as a non-admin to limit accidental changes.',
  },
  {
    title: 'Log Monitoring',
    text: 'Review system logs regularly for suspicious activity.',
  },
  {
    title: 'Disk Encryption',
    text: 'Encrypt sensitive drives to protect data if hardware is lost.',
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
