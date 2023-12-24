

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
          callback(null, xhr.responseText);
      }
    };
    xhr.open(method, url, true);
    xhr.send(formdata);
  }


function send(method, url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200)
        callback("[" + xhr.status + "]" + xhr.responseText, null);
      else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    if (!data) xhr.send();
    else {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));
    }
  }

export function addImage(artName, file, callback) {
    const full_date = new Date();
    const curr_date = `Posted on ${full_date.getMonth() + 1}-${full_date.getDate()}-${full_date.getFullYear()}`
    sendFiles("POST", "/api/picture", {title: artName,
                              date: curr_date,
                            picture: file}, callback)
}


// Gets all images from gallery as an array of image objects
export function getImage(currInd, currArtist, Textcallback) {
    send("GET", `/api/pictureInfo/${+currInd}/${currArtist}`, null, Textcallback)
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

//Prof. Sans wrote this method. Thx
export function getAllUsers(callback) {
  send("GET", "/getAllUsers", null, callback)
}

export function signUpUser(username, password, callback) {
  send("POST", "/signUser", {username: username,
  password: password}, callback)
}

export function logInUser(username, password, callback) {
  send("POST", "/checkSignIn", {username: username,
                                password: password}, callback)
}

export function SignOutUser()
{
  send ("GET", "/signout/", null, function (err, res) {
    if (err) return console.log(err)
  })
}

export function getCurrentUser() {
  let username = document.cookie.split("username=")[1];
  if (username.length == 0) return null;
  return username;
}

export function setItem(key, value)
{
    localStorage.setItem(key, value)
}