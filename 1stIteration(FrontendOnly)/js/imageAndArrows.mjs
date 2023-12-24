import { getImages, deleteImage } from "./api.mjs";
import {deleteCommentArea, updateComments, setUpCommentsArea} from "./comments.mjs"

export function handleCurrentPicture()
{
    const Images_Gallery = getImages();
    let indCurrImg = localStorage.getItem("CurrInd");
    deleteOldHTMLArtAndArrows();
    deleteCommentArea();
    //Delete last argument, if it exists, to clear space for our new one
    //Check if the current index has a picture associated with it
    if (Images_Gallery[indCurrImg * 1])
    {
        //Get element where we'll be editing our element
        const id_of_cont = document.getElementById("art_info_cont");
        const art_title_elmt = document.createElement("h1");
        art_title_elmt.className = "art_info";
        art_title_elmt.id = "art_title"
        art_title_elmt.innerText = `${Images_Gallery[indCurrImg].title}`
        id_of_cont.append(art_title_elmt);
        const artist_elmt = document.createElement("header");
        artist_elmt.className = "art_info";
        artist_elmt.id = "art_info"
        artist_elmt.innerText = `Posted by ${Images_Gallery[indCurrImg].artist} on ${Images_Gallery[indCurrImg].date}`
        id_of_cont.append(artist_elmt);
        //Finished our art information area, now start putting the picture
        const pic_cont = document.createElement("div");
        pic_cont.className = "current_image_container";
        pic_cont.id = "img_container";
        document.getElementById("img_arr_cont").append(pic_cont);
        const pic = document.createElement("img");
        pic.className = "display_image";
        pic.id = "picture";
        pic.src = `${Images_Gallery[indCurrImg].url}`
        document.getElementById("img_container").append(pic)
        handleDeleteButton();
        localStorage.setItem("CommentGroup", 0)
        setUpCommentsArea();
        localStorage.setItem("CommentGroup", 0)
        updateComments(Images_Gallery[indCurrImg].imageId);
        //Check to see if we should allow the user to select the next image

        if(Images_Gallery[indCurrImg*1 + 1])
        {
            handleRightArrow(indCurrImg);
        }
        //See if we should add a left arrow
        if (indCurrImg == 0)
        {
            return;
        }
        handleLeftArrow(indCurrImg);
        return
    }
    //currIndex is not defined, check if the array is empty. If not, we reset the website to beginning picture
    if (Images_Gallery[0])
    {
        localStorage.setItem("CurrInd", 0);
        handleCurrentPicture();
        return;
    }
    //At this point, we know that the array is empty, add nothing.
    return;
}

function handleRightArrow(indCurrImg) {
    const RightArrowHTMLIns = document.createElement("div");
    RightArrowHTMLIns.className = "right_arrow right_picture_arrow";
    RightArrowHTMLIns.id = "right_picture_arrow";
    document.getElementById("img_arr_cont").append(RightArrowHTMLIns);
    document.getElementById("right_picture_arrow").addEventListener("click", function(e)
    {
        localStorage.setItem("CurrInd", 1*indCurrImg + 1);
        handleCurrentPicture();
    });
}

function handleLeftArrow(indCurrImg) {
    const left_arrow = document.createElement("div");
    left_arrow.className = "left_arrow left_picture_arrow";
    left_arrow.id = "left_pic_arrow";
    document.getElementById("img_arr_cont").prepend(left_arrow);
    document.getElementById("left_pic_arrow").addEventListener("click", function(e){
        localStorage.setItem("CurrInd", 1*indCurrImg - 1);
        handleCurrentPicture();
    });
}


function deleteOldHTMLArtAndArrows() {
    if (document.getElementById("art_title") && document.getElementById("art_info"))
    {
        document.getElementById("art_title").remove();
        document.getElementById("art_info").remove();
        document.getElementById("picture").remove();
        document.getElementById("delete_button").remove();
        document.getElementById("img_container").remove();
    }
    //Delete both arrows, we check below to see if we need them.
    if (document.getElementById("left_pic_arrow"))
    {
        document.getElementById("left_pic_arrow").remove();
    }
    if (document.getElementById("right_picture_arrow"))
    {
        document.getElementById("right_picture_arrow").remove();
    }
}



function handleDeleteButton()
{
    const deleteBtnID = document.createElement("img");
    deleteBtnID.className = "deleteButton";
    deleteBtnID.id = "delete_button";
    document.getElementById("img_arr_cont").append(deleteBtnID);
    document.getElementById("delete_button").addEventListener("click", function(e) {
        const ArrayofImages = getImages();
        deleteImage(ArrayofImages[localStorage.getItem("CurrInd")].imageId);
        handleCurrentPicture();
    });
}