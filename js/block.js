/**
 * @file block.js
 * @author Derek T
 */

/** @type {object} Enum for block orientations. */
const ORIENTATIONS = {
	UP: 0,   // +y
	DOWN: 1, // -y
	LEFT: 2, // -x
	RIGHT: 3 // +x
}

/** @type {number} How many tiles a block can move at a time. */
const MOVE_SPEED = 1

class Block {
	/** @type {Array<object>} An array of 2d coords of all tiles in the block. */
	#tilePoints

	/** @type {number} Count of tiles taken by this block. */
	#tileCount

	/** @type {number} See ORIENTATIONS for all possible values. */
	#orientation

	/** @type {string} See `color` param in `Block()`. */
	#renderColor

	/** @type {boolean} If this block is the targeted block that must be moved to the other side. ("Solve" condition) */
	#forGoal

	/**
	 * @constructor
	 * @param {object} originPoint
	 * @param {number} length
	 * @param {number} orientation
	 * @param {string} color Render color of this block.
	 * @param {boolean} isForGoal See Block.#forGoal for information.
	 */
	constructor (originPoint, length, orientation, color, isForGoal) {
		let generate_x = originPoint.x
		let generate_y = originPoint.y
		let x_step = 0
		let y_step = 0

		// NOTE: since the canvas origin is at the top left corner: y-directions are actually reversed.
		switch (orientation) {
			case ORIENTATIONS.UP:
				y_step = -1
				break
			case ORIENTATIONS.DOWN:
				y_step = 1
				break
			case ORIENTATIONS.LEFT:
				x_step = -1
				break
			case ORIENTATIONS.RIGHT:
				x_step = 1
				break
			default:
				throw new Error('Unknown Orientation code. See constant ORIENTATIONS.')
		}

		this.#tilePoints = []
		this.#tileCount = length
		this.#orientation = orientation
		this.#renderColor = color;
		
		// NOTE: generate a gapless sequence of tile locations taken by this block, based on the given orientation. Extend from the origin location tile!
		for(var iter = 0; iter < this.#tileCount; iter++) {
			this.#tilePoints.push(
				{x: generate_x, y: generate_y}
			)
			generate_x += x_step
			generate_y += y_step
		}

		this.#forGoal = isForGoal
	}

	get getLength() { return this.#tileCount }

	get getDrawColor() { return this.#renderColor }

	get isGoalBlock() { return this.#forGoal }

	/**
	 * @method
	 * @param {number} idx 
	 * @returns {object} The coords of a block's member tile or undefined..
	 */
	getTileByIdx(idx) { return this.#tilePoints[idx] }

	/**
	 * @method
	 * @description Returns a coordinate object of where the moving tip of the block WILL be. Depends on the direction relative to the block. For collision checks.
	 * @param {boolean} goForward If the block is being moved forward along it's orientation axis.
	 * @returns {object} The coords of the future location of the block's moving tip.
	 */
	getFutureEdge(goForward) {
		let edge_index = undefined // location of original edge
		/** @type {object} */
		let edge_pt = null // future location of edge 

		// Determine location of moving edge tile: backwards goes to origin BUT forwards goes "out" from origin. Thus, the backwards tip is the origin AND the forwards tip is the last block tile from the origin.
		(goForward) ? edge_index = this.#tileCount - 1 : edge_index = 0

		// Set copy of block's moving edge tile!
		edge_pt = Object.assign({}, this.#tilePoints[edge_index])

		// Modify the edge tile's coord copy to be the future coord.
		switch (this.#orientation) {
			case ORIENTATIONS.UP:
				edge_pt.y -= MOVE_SPEED
				break
			case ORIENTATIONS.DOWN:
				edge_pt.y += MOVE_SPEED
				break
			case ORIENTATIONS.LEFT:
				edge_pt.x -= MOVE_SPEED
				break
			case ORIENTATIONS.RIGHT:
				edge_pt.x += MOVE_SPEED
				break
			default:
				break
		}

		return edge_pt
	}

	/**
	 * @method
	 * @param {object} tileLocation Coords of the tile location to check if it's inside this block. Form is `{x: <int>, y: <int>}`.
	 */
	hasTileLocation(tileLocation) {
		let tile_x = tileLocation.x
		let tile_y = tileLocation.y
		let along_block = false
		let inside_block_span = false

		switch (this.#orientation) {
			case ORIENTATIONS.UP:
				along_block = (tile_x === this.#tilePoints[0].x)
				inside_block_span = (tile_y <= this.#tilePoints[0].y && tile_y >= this.#tilePoints[this.#tileCount - 1].y)
				break
			case ORIENTATIONS.DOWN:
				along_block = (tile_x === this.#tilePoints[0].x)
				inside_block_span = (tile_y >= this.#tilePoints[0].y && tile_y <= this.#tilePoints[this.#tileCount - 1].y)
				break
			case ORIENTATIONS.LEFT:
				along_block = (tile_y === this.#tilePoints[0].y)
				inside_block_span = (tile_x <= this.#tilePoints[0].x && tile_x >= this.#tilePoints[this.#tileCount - 1].x)
				break
			case ORIENTATIONS.RIGHT:
				along_block = (tile_y === this.#tilePoints[0].y)
				inside_block_span = (tile_x >= this.#tilePoints[0].x && tile_x <= this.#tilePoints[this.#tileCount - 1].x)
				break
			default:
				break
		}

		return along_block && inside_block_span
	}

	moveSelf(goForward) {
		let step_factor = undefined // +1 or -1 for forward or backward respectively
		let x_step = 0 // x-jump
		let y_step = 0 // y-jump

		(goForward) ? step_factor = 1: step_factor = -1

		switch (this.#orientation) {
			case ORIENTATIONS.UP:
				y_step = -1 * step_factor
				break
			case ORIENTATIONS.DOWN:
				y_step = 1 * step_factor
				break
			case ORIENTATIONS.LEFT:
				x_step = -1 * step_factor
				break
			case ORIENTATIONS.RIGHT:
				x_step = 1 * step_factor
				break
		}

		// Update coords of each tile in this block.
		for (var iter = 0; iter < this.#tileCount; iter++) {
			this.#tilePoints[iter].x += x_step
			this.#tilePoints[iter].y += y_step
		}
	}
}