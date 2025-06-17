# Post-Apocalypse Learn

A small hacking-themed puzzle game built with React. Players progress through security challenges by answering questions, entering commands and sequences. Each correct answer boosts your neural link while mistakes drain system health.

Immerse yourself in cinematic cyber missions where you outsmart rival hackers and oppressive regimes. Real command-line techniques are woven into each scenario so you learn as you infiltrate systems and defend your network.

Recent updates introduce interactive security setup challenges. Configure a firewall with UFW and enable fail2ban directly inside the game using script-style prompts.

## Running Locally

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the development server
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`.

## Testing

Run the unit tests with:

```bash
npm test
```

## Build for Production

```
npm run build
```

The production build outputs files in the `build/` directory and includes a service worker for offline support.
