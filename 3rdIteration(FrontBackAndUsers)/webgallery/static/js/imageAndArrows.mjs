import { createNewElement } from "./HTMLHelperFunctions.mjs";
import { getImage, deleteImage, setItem, getItem } from "./api.mjs";
import {deleteCommentArea, updateComments, setUpCommentsArea} from "./comments.mjs"

export function handleCurrentPicture(artist)
{
    let indCurrImg = getItem("CurrInd");
    setItem("currArtist", artist)
    deleteOldHTMLArtAndArrows();
    deleteCommentArea();
    //Delete last argument, if it exists, to clear space for our new one
    //Check if the current index has a picture associated with it
    getImage(+indCurrImg, artist, function (err, res) 
    {
        if(err)
        {
            console.log(err)
            return
        }
        if (res.art_info)
        {
            //Update our ImageID field
            setItem("CurrentImageID", res.art_info._id)
            //Get element where we'll be editing our element
            const id_of_cont = document.getElementById("art_info_cont");
            const art_title_elmt = createNewElement("h1", "art_info", "art_title","", `${res.art_info.title}`);
            id_of_cont.append(art_title_elmt);
            const artist_elmt = createNewElement("header", "art_info", "art_info", ""
                                                , `Posted by ${res.art_info.artist} on ${res.art_info.date}`);
            id_of_cont.append(artist_elmt);
            const pic_cont = createNewElement("div", "current_image_container", "img_container", "", "");
            document.getElementById("img_arr_cont").append(pic_cont);
            const pic = createNewElement("img", "display_image", "picture", "", "");
            pic.src = `/api/picture/${indCurrImg}/${artist}`
            document.getElementById("img_container").append(pic)
            handleDeleteButton(artist);
            setItem("CommentGroup", 0)
            setUpCommentsArea();
            updateComments(res.art_info._id);
            //Check to see if we should allow the user to select the next image
            if (res.doRightArrow)
            {
                handleRightArrow(+indCurrImg, artist)
            }
            //See if we should add a left arrow
            if (+indCurrImg === 0)
            {
                return;
            }
            handleLeftArrow(+indCurrImg, artist);
            return
        }
        //currIndex is not defined, check if the array is empty. If not, we reset the website to beginning picture
        if (!res.art_info)
        {
            getImage(0, artist, function (err, res2) 
            {
                if (+res2.status == 404)
                    return
                if (err)
                    console.log(err)
                if (res2.art_info)
                {
                    setItem("CurrInd", 0)
                    handleCurrentPicture(artist);
                }
            })
        }
        if (err)
            console.log(err)
    })
}

function handleRightArrow(indCurrImg, artist) {
    const RightArrowHTMLIns = createNewElement("div", "right_arrow right_picture_arrow", "right_picture_arrow", "", "");
    document.getElementById("img_arr_cont").append(RightArrowHTMLIns);
    document.getElementById("right_picture_arrow").addEventListener("click", function(e)
    {
        setItem("CurrInd", 1*indCurrImg + 1);
        handleCurrentPicture(artist);
    });
}

function handleLeftArrow(indCurrImg, artist) {
    const left_arrow = createNewElement("div", "left_arrow left_picture_arrow", "left_pic_arrow", "", "");
    document.getElementById("img_arr_cont").prepend(left_arrow);
    document.getElementById("left_pic_arrow").addEventListener("click", function(e){
        setItem("CurrInd", 1*indCurrImg - 1);
        handleCurrentPicture(artist);
    });
}


function deleteOldHTMLArtAndArrows() {
    if (document.getElementById("art_title") && document.getElementById("art_info"))
    {
        document.getElementById("art_title").remove();
        document.getElementById("art_info").remove();
        document.getElementById("picture").remove();
        document.getElementById("deletePicButton").remove();
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

function handleDeleteButton(artist)
{
    const deleteBtnID = createNewElement("img", "deleteButton", "deletePicButton", "", "");
    document.getElementById("img_arr_cont").append(deleteBtnID);
    document.getElementById("deletePicButton").addEventListener("click", function(e) {
        deleteImage(getItem("CurrentImageID"), function (err, res) {
            if (err)
            {
                console.log("delete Image in handleDeleteButton returned with" + err)
                return
            }
            handleCurrentPicture(artist);
        });
        
    });
}