

//Thanks Thierry for the sendFiles helper function
function sendFiles(method, url, data, callback) {
    const formdata = new FormData();
    Object.keys(data).forEach(function (key) {
      const value = data[key];
      formdata.append(key, value);
    });
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200)
        callback("[" + xhr.status + "]" + xhr.responseText, null);
      else
      {
        if(url !== "GET")
          callback(null, xhr.responseText);
        else
          callback(null, JSON.parse(xhr.responseText));
      }
    };
    xhr.open(method, url, true);
    xhr.send(formdata);
  }



//Thanks Thierry for the send helper function
function send(method, url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200)
        return callback("(" + xhr.status + ")" + xhr.responseText, null);
      if (method === "POST")
      return callback(null, xhr.responseText1);
      return callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    if (!data) xhr.send();
    else {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));
    }
  }

export function addImage(artName, artist, file, callback) {
    const full_date = new Date();
    const curr_date = `Posted on ${full_date.getMonth() + 1}-${full_date.getDate()}-${full_date.getFullYear()}`
    sendFiles("POST", "/api/picture", {title: artName,
                                artist: artist, date: curr_date,
                            picture: file}, callback)
}


// Gets all images from gallery as an array of image objects
export function getImage(currInd, Textcallback) {
    send("GET", `/api/pictureInfo/${+currInd}`, null, Textcallback)
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId, callback) {
    send("DELETE", `/api/picture/${imageId}/`, null, callback)
}

//get all the comments related to a specific imageID from the backend
export function getComments(chapter, imageID, callback) {
    send("GET", `/api/comments/${imageID}/${chapter}`, null, callback)
}

// add a comment to an image
export function addComment(imageId, author, content, callback) {
    const full_date = new Date();
    const curr_date = `Posted on ${full_date.getMonth() + 1}-${full_date.getDate()}-${full_date.getFullYear()}`
    send("POST", "/api/comment/", {imageID: imageId, author: author, content: content, date: curr_date}, callback)
}

// delete a comment to an image
export function deleteComment(commentId, callback) {
    send("DELETE", `/api/comment/${commentId}/`, null, callback)
}

//Gets an item from backend and local storage given a key 
export function getItem(key)
{
    return localStorage.getItem(key)
}

export function setItem(key, value)
{
    localStorage.setItem(key, value)
}