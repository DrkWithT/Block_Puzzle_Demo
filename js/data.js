/**
 * @file data.js
 * @author Derek Tan
 */

/** @type {Array<number>} Tile counts for the Board's side for each level. */
const BOARD_SIDE_LENGTHS = [5, 6];
const LEVEL_COUNT = BOARD_SIDE_LENGTHS.length;

/** @type {Array<object>} The coordinates of the red block to be at for "winning" puzzles. */
const GOAL_POSITIONS = [
    {x: 4, y: 2}, // 1st level
    {x: 5, y: 3}
];

/**
 * @constant DEMO_DATA
 * @brief A list of all block data for the demo level.
 * @type {Array<object>}
 */
const DEMO_DATA = [
    [ // level 1
        {
            origin: {x: 0, y: 2},
            length: 2,
            orientation: ORIENTATIONS.RIGHT,
            color: 'red',
            goal: true
        },
        {
            origin: {x: 2, y: 2},
            length: 2,
            orientation: ORIENTATIONS.DOWN,
            color: 'orange',
            goal: false
        },
        {
            origin: {x: 2, y: 0},
            length: 3,
            orientation: ORIENTATIONS.RIGHT,
            color: 'yellow',
            goal: false
        },
        {
            origin: {x: 2, y: 4},
            length: 2,
            orientation: ORIENTATIONS.RIGHT,
            color: 'green',
            goal: false
        },
        {
            origin: {x: 4, y: 4},
            length: 2,
            orientation: ORIENTATIONS.UP,
            color: 'blue',
            goal: false
        },
        {
            origin: {x: 4, y: 1},
            length: 2,
            orientation: ORIENTATIONS.LEFT,
            color: 'purple',
            goal: false
        }
    ],
    [ // level 2
        {
            origin: {x: 0, y: 3},
            length: 2,
            orientation: ORIENTATIONS.RIGHT,
            color: 'red',
            goal: true
        },
        {
            origin: {x: 2, y: 4},
            length: 3,
            orientation: ORIENTATIONS.RIGHT,
            color: 'orange',
            goal: false
        },
        {
            origin: {x: 5, y: 4},
            length: 3,
            orientation: ORIENTATIONS.UP,
            color: 'yellow',
            goal: false
        },
        {
            origin: {x: 3, y: 1},
            length: 3,
            orientation: ORIENTATIONS.RIGHT,
            color: 'green',
            goal: false
        },
        {
            origin: {x: 3, y: 2},
            length: 2,
            orientation: ORIENTATIONS.DOWN,
            color: 'blue',
            goal: false
        },
        {
            origin: {x: 2, y: 1},
            length: 2,
            orientation: ORIENTATIONS.DOWN,
            color: 'purple',
            goal: false
        }
    ]
];