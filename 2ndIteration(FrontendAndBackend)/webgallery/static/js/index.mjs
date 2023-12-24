import {handlePicSubmit } from "./SubmitBtns.mjs";
import { runPicButtonFunctionalities } from "./minMaxInputs.mjs";
import {handleCurrentPicture} from "./imageAndArrows.mjs"
import {getItem, setItem} from "./api.mjs"

//Determines the index at which we are getting our image from the Backend Database
if (!getItem("CurrInd"))
{
    setItem("CurrInd", 0);
}

//Determines the set of 10 comments that we will be recieving from our backend database
if (!getItem("CommentGroup"))
{
    setItem("CommentGroup", 0)
}


if(!getItem("CurrentImageID"))
{
    setItem("CurrentImageID", -1)
}

//Set Up event listeners for the show/hide toggle and both picture and submit buttons
runPicButtonFunctionalities();
handlePicSubmit();
handleCurrentPicture();



