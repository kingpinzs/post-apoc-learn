import React, { useState, useEffect } from 'react';
import { loadSettings, saveSettings } from '../lib/settings';
import { detectQuality } from '../hooks/usePerformance';

const Slider = ({ label, value, onChange, min = 0, max = 1, step = 0.01 }) => (
  <label className="flex items-center space-x-2">
    <span className="w-32">{label}</span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1"
    />
    <span className="w-8 text-right">{Math.round(value * 100)}</span>
  </label>
);

const SettingsScreen = () => {
  const [settings, setSettings] = useState(() => loadSettings(detectQuality));

  useEffect(() => {
    saveSettings(settings);
    document.documentElement.style.filter = `brightness(${settings.display.brightness}%)`;
    document.documentElement.style.fontSize = `${settings.display.fontSize}px`;
    document.body.classList.toggle('high-contrast', settings.display.highContrast);
    document.body.classList.toggle('reduce-motion', settings.display.reduceMotion);
    document.body.style.setProperty('--render-scale', settings.performance.renderScale);
  }, [settings]);

  const update = (path, value) => {
    setSettings((s) => {
      const updated = { ...s };
      let obj = updated;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return { ...updated };
    });
  };

  const exportData = () => {
    const save = localStorage.getItem('survivos-save');
    const blob = new Blob([save || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survivos-save.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem('survivos-save', reader.result);
        alert('Progress imported');
      } catch {
        alert('Import failed');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (window.confirm('Erase all save data?')) {
      localStorage.removeItem('survivos-save');
      alert('Data reset');
    }
  };

  const save = localStorage.getItem('survivos-save') || '{}';

  return (
    <div className="p-4 space-y-4 text-green-400 bg-black font-mono" data-testid="settings-screen">
      <h2 className="text-xl">Settings</h2>

      <section className="space-y-2">
        <h3 className="text-lg">Audio</h3>
        <Slider label="Master" value={settings.audio.masterVolume} onChange={(v) => update(['audio','masterVolume'], v)} />
        <Slider label="Music" value={settings.audio.musicVolume} onChange={(v) => update(['audio','musicVolume'], v)} />
        <Slider label="SFX" value={settings.audio.sfxVolume} onChange={(v) => update(['audio','sfxVolume'], v)} />
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={settings.audio.muted} onChange={(e) => update(['audio','muted'], e.target.checked)} />
          <span>Mute</span>
        </label>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg">Display</h3>
        <Slider label="Brightness" min={50} max={150} step={1} value={settings.display.brightness} onChange={(v) => update(['display','brightness'], v)} />
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={settings.display.highContrast} onChange={(e) => update(['display','highContrast'], e.target.checked)} />
          <span>High Contrast</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={settings.display.reduceMotion} onChange={(e) => update(['display','reduceMotion'], e.target.checked)} />
          <span>Reduce Motion</span>
        </label>
        <label className="flex items-center space-x-2">
          <span className="w-32">Font Size</span>
          <input type="number" className="w-16 bg-black border border-green-500" value={settings.display.fontSize} onChange={(e) => update(['display','fontSize'], parseInt(e.target.value,10))} />
        </label>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg">Gameplay</h3>
        <label className="flex items-center space-x-2">
          <span className="w-32">Difficulty</span>
          <select className="bg-black border border-green-500" value={settings.gameplay.difficulty} onChange={(e) => update(['gameplay','difficulty'], e.target.value)}>
            <option>Rookie</option>
            <option>Operative</option>
            <option>Elite</option>
            <option>Survival</option>
          </select>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={settings.gameplay.hints} onChange={(e) => update(['gameplay','hints'], e.target.checked)} />
          <span>Hints</span>
        </label>
        <label className="flex items-center space-x-2">
          <span className="w-32">Auto-save (s)</span>
          <input type="number" className="w-20 bg-black border border-green-500" value={settings.gameplay.autosaveInterval} onChange={(e) => update(['gameplay','autosaveInterval'], parseInt(e.target.value,10))} />
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={settings.gameplay.practiceMode} onChange={(e) => update(['gameplay','practiceMode'], e.target.checked)} />
          <span>Practice Mode</span>
        </label>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg">Performance</h3>
        <label className="flex items-center space-x-2">
          <span className="w-32">Quality</span>
          <select
            className="bg-black border border-green-500"
            value={settings.performance.quality}
            onChange={(e) => update(['performance','quality'], e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <Slider
          label="Particles"
          value={settings.performance.particleDensity}
          onChange={(v) => update(['performance','particleDensity'], v)}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.performance.animations}
            onChange={(e) => update(['performance','animations'], e.target.checked)}
          />
          <span>Animations</span>
        </label>
        <label className="flex items-center space-x-2">
          <span className="w-32">Render Scale</span>
          <input
            type="number"
            min="0.5"
            max="1"
            step="0.1"
            className="w-20 bg-black border border-green-500"
            value={settings.performance.renderScale}
            onChange={(e) => update(['performance','renderScale'], parseFloat(e.target.value))}
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.performance.debugOverlay}
            onChange={(e) => update(['performance','debugOverlay'], e.target.checked)}
          />
          <span>Debug Overlay</span>
        </label>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg">Data Management</h3>
        <pre className="overflow-auto border border-green-500 p-2 text-xs max-h-32">{save}</pre>
        <button onClick={exportData} className="px-2 py-1 border border-green-500">Export</button>
        <input type="file" accept="application/json" onChange={importData} className="block" />
        <button onClick={resetData} className="px-2 py-1 border border-red-500 text-red-400">Reset Data</button>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg">About</h3>
        <div>Game Version: 1.0.0</div>
        <div>See README for credits.</div>
        <a href="https://github.com/kingpinzs/post-apoc-learn" className="underline">Documentation</a>
        <button className="px-2 py-1 border border-green-500" onClick={() => window.open('https://github.com/kingpinzs/post-apoc-learn/issues/new')}>Report Bug</button>
      </section>
    </div>
  );
};

export default SettingsScreen;

