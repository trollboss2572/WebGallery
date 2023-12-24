import {handlePicSubmit } from "./SubmitBtns.mjs";
import { runPicButtonFunctionalities } from "./minMaxInputs.mjs";
import {handleCurrentPicture} from "./imageAndArrows.mjs"
import {getItem, setItem, getCurrentUser, SignOutUser} from "./api.mjs"
import {runUserGalleries} from "./UserGalleries.mjs"

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

const SignInOutButtonID = document.getElementById("SignInOutButton");
if (getCurrentUser())
{
    console.log(getCurrentUser())
    SignInOutButtonID.innerText = "Sign Out"
    SignInOutButtonID.addEventListener("click", function (e)
    {
        SignOutUser();
        SignInOutButtonID.innerText = "Sign Up/In";
        if (document.getElementById("UserGalleriesLibrary")) document.getElementById("UserGalleriesLibrary").remove();
        handleCurrentPicture();
        SignInOutButtonID.addEventListener("click", function (e)
        {
            window.location.href = "/SignUser.html"
        })
    })
}
else 
{
    SignInOutButtonID.innerText = "Sign Up/In"
    SignInOutButtonID.addEventListener("click", function (e)
    {
        window.location.href = "/SignUser.html"
    })
}

//Set Up event listeners for the show/hide toggle and both picture and submit buttons
const Artist = getItem("currArtist")
runUserGalleries();
runPicButtonFunctionalities();
handlePicSubmit(Artist);
handleCurrentPicture(Artist);



