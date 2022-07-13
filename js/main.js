/**
 * @file main.js
 * @version 0.2.0 Added multi level support.
 * @author Derek T (DrkWithT at GitHub)
 */

/** @type {string} Major and minor version. */
const VERSION = '0.2.0';

/** @type {string} */
const AUTHOR = 'Derek T (DrkWithT at GitHub)';

(
    /**
     * @function
     * @param {Document} doc
     */
    function (doc) {
        /// DOM objects:
        let ModalDiv = doc.getElementById('modal-overlay');

        let CanvasElement = doc.getElementById('screen');

        let ChoiceIndicator = doc.getElementById('choice-indicator');
        let ButtonList = doc.getElementsByClassName('game-btn');

        let ForwardBtn = ButtonList.item(0);
        let BackwardBtn = ButtonList.item(1);
        let InfoBtn = ButtonList.item(2);

        let LevelPanel = doc.getElementById('levels-bar');

        /// Main game variables & objects:
        /** @type {number} The index of the current level's data. See DEMO_DATA in data.js! */
        let LevelID = 0;

        /** @type {Board|null} */
        let BoardObj = null;

        /** @type {Modal} */
        let ModalObj = null;

        /// Helper functions:
        function activateGameBtns(canUse) {
            ForwardBtn.disabled = !canUse;
            BackwardBtn.disabled = !canUse;
        }

        function endLevel() {
            alert('The puzzle is solved!');
            activateGameBtns(false);
        }

        try {
            // setup game objects
            BoardObj = new Board(CanvasElement, BOARD_SIDE_LENGTHS[LevelID], DEMO_DATA[LevelID]);
            ModalObj = new Modal(ModalDiv);

            BoardObj.renderBlocks(); // pre-render blocks before game begins
        } catch (err) {
            // log any error from object setup
            console.log(`Setup error:\n${err}`);
        } finally {
            // prepare listeners safely with initializer checks
            if (BoardObj !== null) {
                ForwardBtn.addEventListener('click',
                    () => {
                        if (BoardObj.updateBlock(true)) BoardObj.renderBlocks();
                        if (BoardObj.isSolved(GOAL_POSITIONS[LevelID])) endLevel();
                    });

                BackwardBtn.addEventListener('click',
                    () => {
                        if (BoardObj.updateBlock(false)) BoardObj.renderBlocks();
                        if (BoardObj.isSolved(GOAL_POSITIONS[LevelID])) endLevel();
                    });
                
                CanvasElement.addEventListener('click',
                    /** @param {MouseEvent} event */
                    (event) => {
                        let tile_x = Math.floor(event.offsetX / TILE_SCREEN_DIM);
                        let tile_y = Math.floor(event.offsetY / TILE_SCREEN_DIM);

                        let tile_coord = {
                            x: tile_x,
                            y: tile_y
                        };

                        let choice_idx = BoardObj.selectBlockByTile(tile_coord);

                        if (choice_idx !== -1) ChoiceIndicator.innerText = `${choice_idx}`;
                    });
                
                LevelPanel.addEventListener('click', (event) => {
                    let temp_id = parseInt(event.target.getAttribute('id'));

                    if (temp_id >= 0) {
                        LevelID = temp_id;
                        BoardObj.resetLevel(BOARD_SIDE_LENGTHS[LevelID], DEMO_DATA[LevelID]);
                        activateGameBtns(true);
                    }
                })
            }

            if (ModalObj !== null) {
                InfoBtn.addEventListener('click', (event) => {
                    if (event.button == 0) ModalObj.toggleDisplay(); // only accept left clicks
                    else event.preventDefault();
                });
            }
        }

        console.log(`Block Puzzle ${VERSION} by ${AUTHOR}`);
    }
)(document);
