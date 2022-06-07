/**
 * @file modal.js
 * @author Derek T
 */

class Modal {
    /** @type {HTMLDivElement} The div containing the static modal's body, which appears over the page. */
    #overlayBox;

    /** @type {HTMLButtonElement} The modal's dismiss button. */
    #closeBtn;

    /** @type {boolean} Whether the modal should show or not. */
    #isVisible;

    /**
     * @constructor
     * @param {HTMLDivElement} overlayDiv 
     */
    constructor (overlayDiv) {
        this.#overlayBox = overlayDiv;
        this.#closeBtn = this.#overlayBox.querySelector('button');
        this.#isVisible = false;

        this.#setupCloseListener();
    }

    /**
     * @method
     * @brief Toggles the display property of this modal. Shows or hides the modal.
     */
    toggleDisplay() {
        this.#isVisible = !this.#isVisible;

        if (this.#isVisible) this.#overlayBox.style.display = 'block';
        else this.#overlayBox.style.display = 'none';
    }

    /**
     * @method
     * @brief Registers a hider function to this modal's dismiss button.
     */
    #setupCloseListener() {
        this.#closeBtn.addEventListener('click', (event) => {
            if(event.button === 0) this.toggleDisplay(); // close only on left click
            else event.preventDefault();
        })
    }
}