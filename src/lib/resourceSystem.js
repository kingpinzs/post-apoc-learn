/**
 * Resource management system tracking CPU, RAM and bandwidth usage.
 * Usage is tracked as percentages from 0 to 100.
 *
 * @typedef {Object} ResourceAmount
 * @property {number} cpu - CPU usage 0-100
 * @property {number} ram - RAM usage 0-100
 * @property {number} bandwidth - Bandwidth usage 0-100
 */

/** @type {ResourceAmount} */
const usage = {
  cpu: 0,
  ram: 0,
  bandwidth: 0,
};

/** @type {Record<string, ResourceAmount>} */
const allocations = {};

let crashed = false;

function checkCrash() {
  if (usage.cpu >= 100 || usage.ram >= 100 || usage.bandwidth >= 100) {
    crashed = true;
  }
}

/**
 * Returns a copy of the current resource usage.
 * @returns {ResourceAmount}
 */
export function getUsage() {
  return { ...usage };
}

/**
 * Indicates whether the system has crashed.
 * @returns {boolean}
 */
export function systemCrashed() {
  return crashed;
}

/**
 * Allocates resources for an app/tool.
 * @param {string} appId
 * @param {Partial<ResourceAmount>} amount
 */
export function allocateResources(appId, amount) {
  if (crashed) return;
  const current = allocations[appId] || { cpu: 0, ram: 0, bandwidth: 0 };
  const addCpu = amount.cpu || 0;
  const addRam = amount.ram || 0;
  const addBw = amount.bandwidth || 0;
  current.cpu += addCpu;
  current.ram += addRam;
  current.bandwidth += addBw;
  allocations[appId] = current;

  usage.cpu = Math.min(100, usage.cpu + addCpu);
  usage.ram = Math.min(100, usage.ram + addRam);
  usage.bandwidth = Math.min(100, usage.bandwidth + addBw);

  checkCrash();
}

/**
 * Frees resources allocated to an app/tool.
 * @param {string} appId
 */
export function freeResources(appId) {
  const alloc = allocations[appId];
  if (!alloc) return;
  usage.cpu = Math.max(0, usage.cpu - alloc.cpu);
  usage.ram = Math.max(0, usage.ram - alloc.ram);
  usage.bandwidth = Math.max(0, usage.bandwidth - alloc.bandwidth);
  delete allocations[appId];
}

/**
 * Resets all usage and allocations.
 * Primarily used for testing.
 */
export function resetResources() {
  usage.cpu = 0;
  usage.ram = 0;
  usage.bandwidth = 0;
  crashed = false;
  for (const key in allocations) {
    delete allocations[key];
  }
}
