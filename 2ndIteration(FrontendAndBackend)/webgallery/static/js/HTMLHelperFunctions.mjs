export function createNewElement(tag, HTMLclass, id, innerText, innerHTML)
{
    const new_elmt = document.createElement(tag);
    new_elmt.className = HTMLclass;
    new_elmt.id = id;
    new_elmt.innerText = innerText;
    new_elmt.innerHTML = innerHTML;
    return new_elmt;
}