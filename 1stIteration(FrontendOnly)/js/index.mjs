import { handleCommentSubmit, handlePicSubmit } from "./SubmitBtns.mjs";
import {getImages, addImage, deleteImage, addComment, deleteComment} from "./api.mjs";
import { runCommentButtonFunctionalities, runPicButtonFunctionalities } from "./minMaxInputs.mjs";
import {handleCurrentPicture} from "./imageAndArrows.mjs"

if (!localStorage.getItem("CurrInd"))
{
    localStorage.setItem("CurrInd", 0);
}

if (!localStorage.getItem("CommentJSON"))
{
    localStorage.setItem("CommentJSON", '{}')
}

if (!localStorage.getItem("CommentGroup"))
{
    localStorage.setItem("CommentGroup", 0)
}

//Set Up event listeners for the show/hide toggle and both picture and submit buttons
runPicButtonFunctionalities();
handlePicSubmit();
handleCurrentPicture();



