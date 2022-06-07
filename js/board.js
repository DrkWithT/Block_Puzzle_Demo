/**
 * @file board.js
 * @author Derek T
 */

/** @type {number} Length of a tile's side in pixels. */
const TILE_SCREEN_DIM = 32;

class Board {
    /** @type {HTMLCanvasElement} Reference to a canvas element in the DOM. This is a screen for this puzzle demo. */
    #screenElem;

    /** @type {CanvasRenderingContext2D} The 2D rendering interface of this board's screen. */
    #screenCtx;

    /** @type {number} Length of the square board's side in tiles. */
    #sideLen;

    /** @type {Array<Block>} Array of this board's block objects. */
    #blockList;

    /** @type {number} Count of loaded blocks on this board. */
    #blockCount;

    /** @type {boolean} If the board is setup without any error like missing pieces, invalid `sideLength`, etc. */
    #ready;

    /** @type {number} The index of the currently selected Block object on this Board. */
    #selectionIdx;

    /** @type {number} The index of the goal block that is usually red. */
    #targetBlockIdx;

    /**
     * @constructor
     * @param {HTMLCanvasElement} screenElement See Board.#screenElem for description. 
     * @param {number} sideLength See Board.#sideLen for description.
     * @param {Array<object>} blockData An array of objects, where each object has initialization args for a Block.
     */
    constructor (screenElement, sideLength, blockData) {
        this.#screenElem = screenElement || null;

        if (!this.#screenElem) throw new Error('Cannot create board with no HTML canvas.');
        
        this.#screenCtx = this.#screenElem.getContext('2d');
        this.#sideLen = 0;
        this.#blockList = [];
        this.#blockCount = 0;
        this.#ready = false;
        
        if (!blockData) throw new Error('Cannot create board with invalid blockData argument.');
        
        this.#setupBoard(sideLength, blockData);
        this.#selectionIdx = 0;
        this.#targetBlockIdx = -1;

        if (!this.isReady()) throw new Error('Invalid canvas arg or board dimensions.');

        this.#targetBlockIdx = this.#findGoalBlock();

        if(!this.#targetBlockIdx === -1) throw new Error('Invalid level data: missing block with goal:true .');
    }

    isReady() { return this.#ready; }

    #setDimensions(sideLength) {
        this.#sideLen = sideLength;

        let side_pixels = TILE_SCREEN_DIM * this.#sideLen;
        this.#screenElem.setAttribute('width', side_pixels);
        this.#screenElem.setAttribute('height', side_pixels);
    }

    /**
     * @method
     * @param {number} sideLength See param `sideLength` in `Board()`.
     * @param {Array<object>} blockData See param `blockData` in `Board()`.
     */
    #setupBoard(sideLength, blockData) {
        this.#setDimensions(sideLength);

        if (blockData !== null) {
            let setup_iter = 0;

            for (; setup_iter < blockData.length; setup_iter++) {
                let data_entry = blockData[setup_iter] || null;

                if (data_entry !== null) {
                    this.#blockList.push(
                        new Block(data_entry.origin,
                            data_entry.length,
                            data_entry.orientation,
                            data_entry.color,
                            data_entry.goal
                    ));
                }
            }
        }

        this.#blockCount = this.#blockList.length;
        this.#ready = this.#screenElem !== null && this.#blockCount > 0 && this.#sideLen > 4;
    }

    #findGoalBlock() {
        this.#targetBlockIdx = this.#blockList.findIndex((block) => { return block.isGoalBlock; });
    }

    /**
     * @method
     * @description Chooses a block on the board to move.
     * @param {object} tileCoords Object of form `{x: <int>, y: <int>}`
     * @returns {number} The index of the block selected within this board. (For error checking!)
     */
    selectBlockByTile(tileCoords) {
        let temp = this.#blockList.findIndex((block) => {
            return block.hasTileLocation(tileCoords);
        });

        if (temp !== -1) this.#selectionIdx = temp;
        
        return temp;
    }

    /**
     * @method
     * @param {boolean} goingForth
     * @returns {boolean} If the block moved without going out of bounds or colliding.
     */
    updateBlock(goingForth) {
        let outside_x = false;  // if block sticks outside horizontally
        let outside_y = false;  // if block sticks outside vertically
        let collides = false;   // if block can collide with another

        let future_edge_pt = this.#blockList[this.#selectionIdx].getFutureEdge(goingForth);

        outside_x = (future_edge_pt.x < 0 || future_edge_pt.x >= this.#sideLen)
        outside_y = (future_edge_pt.y < 0 || future_edge_pt.y >= this.#sideLen);

        let update_iter = 0;
        for (; update_iter < this.#blockCount; update_iter++) {
            // do not check self-collision of currently selected block
            if (update_iter !== this.#selectionIdx) {
                let temp = this.#blockList[update_iter];

                collides = temp.hasTileLocation(future_edge_pt);
                
                if (collides) break;
            }

        }

        let status = !outside_x && !outside_y && !collides;

        if (status)
            this.#blockList[this.#selectionIdx].moveSelf(goingForth);

        return status;
    }

    /**
     * @method
     * @description Draws all blocks on the game canvas. Must be called after each modification of Board data.
     */
    renderBlocks() {
        // reset screen
        const screen_side = this.#sideLen * TILE_SCREEN_DIM;
        this.#screenCtx.fillStyle = 'white';
        this.#screenCtx.fillRect(0, 0, screen_side, screen_side);

        // render blocks
        let render_iter = 0;

        for (; render_iter < this.#blockCount; render_iter++) {
            // prepare color before drawing current block's tiles...
            let block_temp = this.#blockList[render_iter];
            let render_color = block_temp.getDrawColor;

            this.#screenCtx.fillStyle = render_color;

            let tile_idx = 0;

            for (; tile_idx < block_temp.getLength; tile_idx++) {
                let tile_coord = block_temp.getTileByIdx(tile_idx);
                
                this.#screenCtx.fillRect(
                    tile_coord.x * TILE_SCREEN_DIM,
                    tile_coord.y * TILE_SCREEN_DIM,
                    TILE_SCREEN_DIM,
                    TILE_SCREEN_DIM);
            }
        }
    }

    isSolved(goalCoord) {
        return this.#blockList[this.#targetBlockIdx].hasTileLocation(goalCoord);
    }

    /**
     * @method
     * @description Clears all block data from this board. Resets `#ready` to false.
     * @note Should be called for pre-reset before another level is loaded. 
     */
    #clearBlocks() {
        this.#blockList.length = 0;
        this.#blockCount = 0;
        this.#ready = false;
    }

    /**
     * @method
     * @description A special method to reset and reload the board with a fresh puzzle.
     * @param {number} sideLength Tile count per board side.
     * @param {Array<object>} blockData List of Block initialization data.
     */
    resetLevel(sideLength, blockData) {
        this.#clearBlocks(); // clear all old block data
        this.#setupBoard(sideLength, blockData); // load fresh puzzle data
        this.renderBlocks(); // pre-render puzzle
    }
}