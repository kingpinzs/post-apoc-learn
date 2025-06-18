import React, { useState } from 'react';

const COMPOUNDS = [
  { id: 1, name: 'Water', type: 'organic', location: 1 },
  { id: 2, name: 'Sodium Chloride', type: 'inorganic', location: 1 },
  { id: 3, name: 'Ethanol', type: 'organic', location: 2 },
  { id: 4, name: 'Ammonia', type: 'inorganic', location: 3 },
];

const EFFECTS = [
  { id: 1, compound: 1, effect: 'Hydration' },
  { id: 2, compound: 3, effect: 'Disinfectant' },
];

const LOCATIONS = [
  { id: 1, name: 'Outpost Lab' },
  { id: 2, name: 'Ruined City' },
  { id: 3, name: 'Bunker Store' },
];

function runQuery(sql) {
  const match = /select \* from (\w+) where (.+)/i.exec(sql.trim());
  if (!match) return [];
  const table = match[1].toLowerCase();
  const cond = match[2];
  const [col, val] = cond.split('=');
  const cleanVal = val?.replace(/'/g, '').trim();
  const rowFilter = (row) => String(row[col.trim()]) === cleanVal;
  if (table === 'compounds') return COMPOUNDS.filter(rowFilter);
  if (table === 'effects') return EFFECTS.filter(rowFilter);
  if (table === 'locations') return LOCATIONS.filter(rowFilter);
  return [];
}

const ChemicalDatabase = () => {
  const [sql, setSql] = useState("SELECT * FROM compounds WHERE type='organic'");
  const [results, setResults] = useState([]);
  const [builder, setBuilder] = useState({ table: 'compounds', column: 'type', value: 'organic' });

  const execute = () => {
    setResults(runQuery(sql));
  };

  const buildQuery = () => {
    const q = `SELECT * FROM ${builder.table} WHERE ${builder.column}='${builder.value}'`;
    setSql(q);
  };

  return (
    <div className="p-4 space-y-3" data-testid="chemical-database">
      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        rows={2}
        className="w-full bg-transparent border border-green-500/30 text-green-400 font-mono p-1"
      />
      <div className="space-x-2">
        <button onClick={execute} className="border border-green-500 text-green-400 rounded px-3 py-1">
          Run
        </button>
      </div>
      <div className="space-y-2 text-green-400 text-sm">
        <div className="flex space-x-2 items-center">
          <select
            value={builder.table}
            onChange={(e) => setBuilder((b) => ({ ...b, table: e.target.value }))}
            className="bg-transparent border border-green-500/30 rounded p-1"
          >
            <option value="compounds">compounds</option>
            <option value="effects">effects</option>
            <option value="locations">locations</option>
          </select>
          <input
            value={builder.column}
            onChange={(e) => setBuilder((b) => ({ ...b, column: e.target.value }))}
            placeholder="column"
            className="bg-transparent border border-green-500/30 rounded p-1 w-24"
          />
          <input
            value={builder.value}
            onChange={(e) => setBuilder((b) => ({ ...b, value: e.target.value }))}
            placeholder="value"
            className="bg-transparent border border-green-500/30 rounded p-1 w-24"
          />
          <button onClick={buildQuery} className="border border-green-500 rounded px-2 py-1">
            Build
          </button>
        </div>
      </div>
      {results.length > 0 && (
        <table className="w-full text-green-400 font-mono text-xs" data-testid="query-results">
          <thead>
            <tr>
              {Object.keys(results[0]).map((h) => (
                <th key={h} className="border-b border-green-500/30">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                {Object.keys(r).map((k) => (
                  <td key={k}>{r[k]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="text-green-400 text-xs">
        Practice SQL for the database infiltration challenge. Use single quotes around text values.
      </p>
    </div>
  );
};

export default ChemicalDatabase;
