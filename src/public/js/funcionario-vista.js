/**
 * Gets the parent element from child element.
 * @param {string} parentSelector Parent selector.
 * @param {T} childElement Child element in parent.
 * @template T
 */
function getParentElement(parentSelector, childElement) {
    
    function matchesParentSelector() {
        if (childElement === null || childElement instanceof Document) {
            childElement = null;
            return true;
        }

        const value = parentSelector.slice(1);

        if (
                (parentSelector[0] === "." && childElement.classList.contains(value)) ||
                (parentSelector[0] === "#" && childElement.id === value) ||
                (![".", "#"].includes(parentSelector[0]) && childElement.tagName === value)
            ) {
            return true;
        }

        return false;
    }
    
    while ( !matchesParentSelector() )
        childElement = childElement.parentNode;

    return childElement;
}

$(".boton-ver-funcionario").click(function(e) {
    const el = getParentElement(".boton-ver-funcionario", e.target);
    const id = $(el).attr("id");

    $(".window-funcionario").removeClass("hidden");
});

$(".window-title button").click(function(e) {
    $(".window-funcionario").addClass("hidden");
})