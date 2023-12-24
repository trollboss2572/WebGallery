export function createNewElement(tag, HTMLclass, id, innerText, innerHTML)
{
    const new_elmt = document.createElement(tag);
    new_elmt.className = HTMLclass;
    new_elmt.id = id;
    if (innerText)
    {
        new_elmt.innerText = innerText;
    }
    if(innerHTML)
    {
        new_elmt.innerHTML = innerHTML;
    }
    return new_elmt;
}