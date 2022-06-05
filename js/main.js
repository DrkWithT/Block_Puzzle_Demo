/**
 * @file main.js
 * @version 0.1.0
 * @author Derek T
 */

/** @type {string} My nickname. */
const AUTHOR = 'Derk';

(
    /**
     * @function
     * @param {Document} doc
     */
    function (doc) {
        /// DOM objects:
        let CanvasElement = doc.getElementById('screen');
        CanvasElement.setAttribute('width', TILE_SCREEN_DIM * BOARD_SIDE_COUNT);
        CanvasElement.setAttribute('height', TILE_SCREEN_DIM * BOARD_SIDE_COUNT);

        let ChoiceIndicator = doc.getElementById('choice-indicator');
        let ButtonList = doc.getElementsByClassName('pg-btn');

        let ForwardBtn = ButtonList.item(0);
        let BackwardBtn = ButtonList.item(1);
        let ResetBtn = ButtonList.item(2);

        /// Main game object:
        /** @type {Board|null} */
        let BoardObj = null;

        /// Helper functions:
        function disableAllBtns() {
            ForwardBtn.setAttribute('disabled', 'true');
            BackwardBtn.setAttribute('disabled', 'true');
            ResetBtn.setAttribute('disabled', 'true');
        }

        function endGame() {
            alert('The puzzle is solved!');
            disableAllBtns();
        }

        try {
            BoardObj = new Board(CanvasElement, BOARD_SIDE_COUNT, DEMO_DATA);
        } catch (err) {
            console.log(`Setup error:\n${err}`);
        } finally {
            if (BoardObj !== null && BoardObj.isReady()) {
                /// setup game listeners...

                ForwardBtn.addEventListener('click',
                    () => {
                        if (BoardObj.updateBlock(true)) BoardObj.renderBlocks();
                        if (BoardObj.isSolved(GOAL_POS)) endGame();
                    });

                BackwardBtn.addEventListener('click',
                    () => {
                        if (BoardObj.updateBlock(false)) BoardObj.renderBlocks();
                        if (BoardObj.isSolved(GOAL_POS)) endGame();
                    });
                
                CanvasElement.addEventListener('click',
                    /** @param {MouseEvent} event */
                    (event) => {
                        let tile_x = event.offsetX / TILE_SCREEN_DIM;
                        let tile_y = event.offsetY / TILE_SCREEN_DIM;

                        let tile_coord = {
                            x: tile_x,
                            y: tile_y
                        };

                        let choice_idx = BoardObj.selectBlockByTile(tile_coord);

                        if (choice_idx !== -1) ChoiceIndicator.innerText = `${choice_idx}`;
                    });
                
                ResetBtn.addEventListener('click', (event) => {
                    console.log('Reset: Dummy listener.');
                });
                
                console.log('Setup is OK!');
            }
        }

        // pre-render blocks before game begins
        BoardObj.renderBlocks();

        console.log(`Block Puzzle by ${AUTHOR}`);
    }
)(document);