import { createNewElement } from "./HTMLHelperFunctions.mjs";
import { getAllUsers, setItem } from "./api.mjs";
import { handleCurrentPicture } from "./imageAndArrows.mjs";

export function runUserGalleries() {
    if (document.getElementById("UserGalleriesLibrary"))
    {
        document.getElementById("UserGalleriesLibrary").remove();
    }
    getAllUsers(function (err, res) {
        if (err)
            return console.log(err)
        const GalleriesContainer = createNewElement("div", "UserGalleriesContainer", "UserGalleriesLibrary", null, 
        `<div class="form_title" >User Curated Galleries</div>`);
        document.getElementById("GeneralAreaUserGalleries").append(GalleriesContainer);
        let i = 0;
        let UserGalleryButton;
        while (res.userArr[i])
        {
            UserGalleryButton = createNewElement("button", "submit_btn", `UserGalleryButton${res.userArr[i]._id}`, res.userArr[i]._id);
            document.getElementById("UserGalleriesLibrary").append(UserGalleryButton);
            document.getElementById(`UserGalleryButton${res.userArr[i]._id}`).addEventListener("click", function(e) 
            {
                setItem("CurrInd", 0);
                handleCurrentPicture(this.innerText);
            })
            i++;
        }
            
    })
    
}