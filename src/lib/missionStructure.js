/**
 * Mission related type definitions and sample mission data.
 *
 * @typedef {Object} MissionObjective
 * @property {string} id - Unique identifier for the objective.
 * @property {string} description - Text explaining the objective.
 * @property {string} type - Category of objective.
 * @property {string} target - Target this objective references.
 * @property {boolean} completed - Whether the objective is complete.
 */

/**
 * @typedef {Object} Mission
 * @property {string} id - Unique mission id.
 * @property {string} name - Display name of the mission.
 * @property {string} briefing - Mission briefing shown to the player.
 * @property {MissionObjective[]} objectives - Objectives required to finish.
 * @property {string} unlockReward - App id unlocked on completion.
 * @property {number} [timeLimit] - Optional time limit in seconds.
 * @property {string[]} requiredApps - IDs of prerequisite apps.
 */

/** @type {Mission} */
export const sampleMission = {
  id: 'example',
  name: 'Example Mission',
  briefing: 'Demonstrates the mission structure.',
  objectives: [
    {
      id: 'obj1',
      description: 'Complete the first step',
      type: 'tutorial',
      target: 'system',
      completed: false,
    },
  ],
  unlockReward: 'map',
  timeLimit: 300,
  requiredApps: ['communicator'],
};
