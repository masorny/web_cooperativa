/**
 * @typedef {Object} WndOpts
 * @property {boolean} closeable Closeable window.
 * @property {string} title Window title.
 */

/**
 * @typedef {HTMLDivElement} WndElement
 */

/**
 * @overloads Creates a Window element.
 */

/**
 * Creates a Window element.
 * @param {WndOpts} options Options to set.
 * @returns {WndElement}
 */
function createWindow(options = {}) {
    const wnd = $(`
        <div class="window">
            <div class="window-title">
                <span>Primeros Pasos</span>
            </div>
            <div class="window-content">
            </div>
        </div>
    `);

    $(".window-title span", wnd).text(options?.title ?? "Window Title");

    if (options?.closeable) {
        $(".window-title", wnd).append(`<button><i class="fas fa-times"></i></button>`);
    }
    
    return wnd;
}

function setContent(wnd, ) {
    
}

function displayWindow(wnd) {

}
