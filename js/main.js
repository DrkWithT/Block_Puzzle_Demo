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
        let ModalDiv = doc.getElementById('modal-overlay');

        let CanvasElement = doc.getElementById('screen');
        CanvasElement.setAttribute('width', TILE_SCREEN_DIM * BOARD_SIDE_COUNT); // pre-size canvas
        CanvasElement.setAttribute('height', TILE_SCREEN_DIM * BOARD_SIDE_COUNT);

        let ChoiceIndicator = doc.getElementById('choice-indicator');
        let ButtonList = doc.getElementsByClassName('pg-btn');

        let ForwardBtn = ButtonList.item(0);
        let BackwardBtn = ButtonList.item(1);
        let InfoBtn = ButtonList.item(2);

        /// Main game objects:
        /** @type {Board|null} */
        let BoardObj = null;

        /** @type {Modal} */
        let ModalObj = null;

        /// Helper functions:
        function disableGameBtns() {
            ForwardBtn.setAttribute('disabled', 'true');
            BackwardBtn.setAttribute('disabled', 'true');
            InfoBtn.setAttribute('disabled', 'true');
        }

        function endGame() {
            alert('The puzzle is solved!');
            disableGameBtns();
        }

        try {
            BoardObj = new Board(CanvasElement, BOARD_SIDE_COUNT, DEMO_DATA);
            ModalObj = new Modal(ModalDiv);
        } catch (err) {
            console.log(`Setup error:\n${err}`);
        } finally {
            // prepare listners safely: check if the game objects were setup well
            if (BoardObj !== null) {
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
                        let tile_x = Math.floor(event.offsetX / TILE_SCREEN_DIM);
                        let tile_y = Math.floor(event.offsetY / TILE_SCREEN_DIM);

                        let tile_coord = {
                            x: tile_x,
                            y: tile_y
                        };

                        let choice_idx = BoardObj.selectBlockByTile(tile_coord);

                        if (choice_idx !== -1) ChoiceIndicator.innerText = `${choice_idx}`;
                    });
            }

            if (ModalObj !== null) {
                InfoBtn.addEventListener('click', (event) => {
                    if (event.button == 0) ModalObj.toggleDisplay(); // only accept left clicks
                    else event.preventDefault();
                });
            }
        }

        BoardObj.renderBlocks(); // pre-render blocks before game begins

        console.log(`Block Puzzle by ${AUTHOR}`);
    }
)(document);