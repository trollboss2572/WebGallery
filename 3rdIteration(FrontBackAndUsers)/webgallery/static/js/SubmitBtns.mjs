import { addComment, getItem, addImage} from "./api.mjs";
import { setUpCommentsArea, updateComments } from "./comments.mjs";
import { handleCurrentPicture } from "./imageAndArrows.mjs";
import {deleteCommentArea} from "./comments.mjs"

export function handlePicSubmit(artist) 
{
    document.getElementById("submit_art_btn").addEventListener("click", function (e) {
        e.preventDefault();
        const art = document.getElementById("art_name").value;
        const file = document.getElementById("art_file").files[0];
        if (validateInput(art, file))
        {
            addImage(art, file, function (err, res)
            {
                if (err)
                    console.log(err)
                handleCurrentPicture(artist);
                return null
            })
            
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
        const content = document.getElementById("comment_content").value;
        if (content !== "")
        {
            const currentImageID = getItem("CurrentImageID")
            addComment(currentImageID, name, content, function (err, res) 
            {
                if(err)
                    return err

            });
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