export function validateScript(commands) {
  if (!Array.isArray(commands)) {
    return { valid: false, error: 'Invalid script format' };
  }
  if (commands.length === 0) {
    return { valid: false, error: 'Script is empty' };
  }
  if (commands[0] !== 'init') {
    return { valid: false, error: 'Script must start with "init"' };
  }
  if (commands[commands.length - 1] !== 'end') {
    return { valid: false, error: 'Script must end with "end"' };
  }
  if (commands.length > 10) {
    return { valid: false, error: 'Script exceeds max length' };
  }
  return { valid: true };
}
