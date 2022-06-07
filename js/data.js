/**
 * @file data.js
 * @author Derek Tan
 */

/** @type {number} Tile count per board side. */
const BOARD_SIDE_COUNT = 5;

/** @type {object} The coordinate of the red block to be at for "winning" the puzzle. */
const GOAL_POS = {
    x: 4,
    y: 2
};

/**
 * @constant DEMO_DATA
 * @brief A list of all block data for the demo level.
 * @type {Array<object>}
 */
const DEMO_DATA = [
    {
        origin: {
            x: 0,
            y: 2
        },
        length: 2,
        orientation: ORIENTATIONS.RIGHT,
        color: 'red',
        goal: true
    },
    {
        origin: {
            x: 2,
            y: 2
        },
        length: 2,
        orientation: ORIENTATIONS.DOWN,
        color: 'orange',
        goal: false
    },
    {
        origin: {
            x: 2,
            y: 0
        },
        length: 3,
        orientation: ORIENTATIONS.RIGHT,
        color: 'yellow',
        goal: false
    },
    {
        origin: {
            x: 2,
            y: 4
        },
        length: 2,
        orientation: ORIENTATIONS.RIGHT,
        color: 'green',
        goal: false
    },
    {
        origin: {
            x: 4,
            y: 4
        },
        length: 2,
        orientation: ORIENTATIONS.UP,
        color: 'blue',
        goal: false
    },
    {
        origin: {
            x: 4,
            y: 1
        },
        length: 2,
        orientation: ORIENTATIONS.LEFT,
        color: 'purple',
        goal: false
    }
];