/**
 * Validate a script assembled from command blocks.
 *
 * Each block can be a simple string command or an object with
 * `{ type, x, y, parameters }` properties. Blocks are expected to
 * snap to a 50px grid and connect vertically.
 *
 * The validator checks:
 *  - All blocks are connected in order (same x, 50px y difference)
 *  - START/END blocks exist and appear in the correct order
 *  - Parameter values are defined
 *  - LOOP blocks contain a finite iteration count
 *
 * Returns `{ isValid: boolean, errors: string[] }`.
 */
export function validateScript(blocks) {
  const errors = [];

  if (!Array.isArray(blocks)) {
    return { isValid: false, errors: ['Invalid script format'] };
  }

  if (blocks.length === 0) {
    return { isValid: false, errors: ['Script is empty'] };
  }

  const normalize = (b) =>
    typeof b === 'string' ? { type: b } : b || { type: '' };
  const normalized = blocks.map(normalize);
  const sorted = normalized.slice().sort((a, b) => (a.y || 0) - (b.y || 0));

  const hasStart = sorted.some((b) => /^(START|init)$/i.test(b.type));
  const hasEnd = sorted.some((b) => /^(END|end)$/i.test(b.type));
  if (!hasStart) errors.push('Missing START block');
  if (!hasEnd) errors.push('Missing END block');

  if (hasStart && hasEnd) {
    const startIndex = sorted.findIndex((b) => /^(START|init)$/i.test(b.type));
    const endIndex = sorted.findIndex((b) => /^(END|end)$/i.test(b.type));
    if (endIndex < startIndex) {
      errors.push('END block occurs before START');
    }
  }

  // connection validation
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (prev.x === undefined || prev.y === undefined) continue;
    if (curr.x === undefined || curr.y === undefined) continue;
    if (curr.x !== prev.x || curr.y !== prev.y + 50) {
      errors.push(`Block ${i} not properly connected`);
    }
  }

  // parameter validation
  sorted.forEach((block, idx) => {
    const params = block.parameters;
    if (!params) return;
    if (Array.isArray(params)) {
      params.forEach((p) => {
        if (p && p.name && (p.value === undefined || p.value === '' || p.value === null)) {
          errors.push(`Missing value for ${p.name} in block ${idx}`);
        }
      });
    } else if (typeof params === 'object') {
      Object.entries(params).forEach(([key, val]) => {
        if (val === undefined || val === '' || val === null) {
          errors.push(`Missing value for ${key} in block ${idx}`);
        }
      });
    }
  });

  // loop validation
  sorted.forEach((block, idx) => {
    if (/^LOOP$/i.test(block.type)) {
      const count = block.parameters?.count ?? block.parameters?.iterations;
      const n = Number(count);
      if (!Number.isFinite(n) || n <= 0) {
        errors.push(`Potential infinite loop at block ${idx}`);
      }
    }
  });

  return { isValid: errors.length === 0, errors };
}
