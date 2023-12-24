/*  ******* Data types *******
    image objects must have at least the following attributes:

        - (String) imageId 
        - (String) title
        - (String) artist
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) artist
        - (String) content
        - (Date) date

****************************** */

class Image {
    constructor(imageId, title, artist, url, date) {
        //Int
        this.imageId = imageId;
        //Strings
        this.title = title;
        this.artist = artist;
        this.url = url;
        this.date = date;
    }
}

class Comment {
    constructor(commentID, imageID, author, content, date)
    {
        this.commentID = commentID;
        this.imageID = imageID;
        this.author = author;
        this.content = content;
        this.date = date;
    }
}

// add an image to the gallery
export function addImage(title, artist, url) 
{
    const images = getImages();
    let potentialID = 0
    //Iterate through the JSON Local Storage to find a potential image ID to use
    for (let index = 0; images[index]; index++)
    {
        if (images[index].imageId >= potentialID)
        {
            potentialID = images[index].imageId + 1;
        }  
    }
    const full_date = new Date();
    const curr_date = `${full_date.getMonth() + 1}-${full_date.getDate()}-${full_date.getFullYear()}`
    let input_img = new Image(potentialID, title, artist, url, curr_date);
    localStorage.setItem(potentialID, JSON.stringify(input_img));
    return;
}

// Gets all images from gallery as an array of image objects
export function getImages() {
    let imgs_arr = [];
    let i = 0;
    const arrayOfKeys = Object.keys(localStorage);
    for (let key in arrayOfKeys)
    {
        //Ignore all the other data we keep in localStorage
        if (arrayOfKeys[key] == "CurrInd")
        {
            continue;
        }
        if (arrayOfKeys[key] == "CommentJSON")
        {
            continue;
        }
        if (arrayOfKeys[key] == "CommentGroup")
        {
            continue;
        }
        imgs_arr[i] = JSON.parse(localStorage.getItem(arrayOfKeys[key]));
        i++;
    }
    return imgs_arr;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    localStorage.removeItem(imageId);
}

//get all the comments
function getComments() {
    let comments_arr = [];
    let i = 0;
    const JSONOfComments = JSON.parse(localStorage.getItem("CommentJSON"))
    for (let keys in JSONOfComments)
    {
        if (JSONOfComments[keys])
        {
            comments_arr[i] = JSONOfComments[keys]
            i++;
        }
    }
    return comments_arr;
}

//Returns all the comments of a specific imageID
export function getCommentsImageID(imageID) {
    let comments_arr = getComments();
    let return_arr = [];
    let return_index = 0;
    for (let index in comments_arr)
    {
        if(comments_arr[index].imageID == imageID)
        {
            return_arr[return_index] = comments_arr[index];
            return_index++;
        }
    }
    return return_arr
}

// add a comment to an image
export function addComment(imageId, author, content) {
    const comments = getComments();
    let potentialID = 0
    //Iterate through the JSON Local Storage to find a potential comment ID to use
    for (let index = 0; comments[index]; index++)
    {
        if (comments[index].commentID >= potentialID)
        {
            potentialID = comments[index].commentID + 1;
        }  
    }
    const full_date = new Date();
    const curr_date = `Posted on ${full_date.getMonth() + 1}-${full_date.getDate()}-${full_date.getFullYear()}`
    let input_cmt = new Comment(potentialID, imageId, author, content, curr_date);
    let localStorageJSOn = localStorage.getItem("CommentJSON");
    let CommentJSON = JSON.parse(localStorageJSOn);
    CommentJSON[potentialID] = input_cmt;
    localStorage.setItem("CommentJSON", JSON.stringify(CommentJSON));
    return;
}

// delete a comment to an image
export function deleteComment(commentId) {
    let localStorageJSOn = localStorage.getItem("CommentJSON")
    let CommentJSON = JSON.parse(localStorageJSOn)
    delete CommentJSON[commentId]
    localStorage.setItem("CommentJSON", JSON.stringify(CommentJSON)) 
}