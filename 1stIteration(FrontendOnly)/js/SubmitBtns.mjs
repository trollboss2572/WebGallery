import { addComment, addImage} from "./api.mjs";
import { setUpCommentsArea, updateComments } from "./comments.mjs";
import { handleCurrentPicture } from "./imageAndArrows.mjs";
import {deleteCommentArea} from "./comments.mjs"

export function handlePicSubmit() 
{
    document.getElementById("submit_art_btn").addEventListener("click", function (e) {
        e.preventDefault();
        const name = document.getElementById("artist_name").value;
        const art = document.getElementById("art_name").value;
        const URL = document.getElementById("art_pth_name").value;
        if (validateInput(name, art, URL))
        {
            addImage(art, name, URL);
            handleCurrentPicture();
            document.getElementById("Picture_Form_Container").reset();
        }
        else
        {
            alert("You must fill out all fields before submitting.");
        }
    });
}

export function handleCommentSubmit() {
    document.getElementById("submit_comment").addEventListener("click", function (e) {
        e.preventDefault();
        const name = document.getElementById("comment_author").value;
        const content = document.getElementById("comment_content").value;
        if (validateInput(name, content, name))
        {
            const keyForCurrImg = localStorage.getItem("CurrInd")
            const currentImageID = JSON.parse(localStorage.getItem(keyForCurrImg)).imageId;
            addComment(currentImageID, name, content);
            document.getElementById("cmt_input_contain").reset();
            deleteCommentArea();
            setUpCommentsArea();
            updateComments(currentImageID);
        }
        else
        {
            alert("You must fill out all fields before submitting.")
        }
    });
}

function validateInput(val1, val2, val3)
{
    return !(val1 === "" || val2 === "" || val3 === "")
}