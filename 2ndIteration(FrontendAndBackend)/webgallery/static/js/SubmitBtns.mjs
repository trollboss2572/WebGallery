import { addComment, getItem, addImage} from "./api.mjs";
import { setUpCommentsArea, updateComments } from "./comments.mjs";
import { handleCurrentPicture } from "./imageAndArrows.mjs";
import {deleteCommentArea} from "./comments.mjs"

export function handlePicSubmit() 
{
    document.getElementById("submit_art_btn").addEventListener("click", function (e) {
        e.preventDefault();
        const name = document.getElementById("artist_name").value;
        const art = document.getElementById("art_name").value;
        const file = document.getElementById("art_file").files[0];
        if (validateInput(name, art, file))
        {
            addImage(art, name, file, function (err, res)
            {
                if (err)
                    console.log(err)
                handleCurrentPicture();
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
        const name = document.getElementById("comment_author").value;
        const content = document.getElementById("comment_content").value;
        if (validateInput(name, content, name))
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