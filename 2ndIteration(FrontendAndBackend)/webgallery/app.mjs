//Thanks Thierry for the backend framework, I'm not reinventing the wheel here.
import { join } from "path";
import { createServer } from "http";
import express from "express";
import Datastore from "nedb";
import multer from "multer"
import path from "path"
import { rmSync } from "fs";

const PORT = 3000;
const app = express();

let upload = multer({ dest: path.resolve('uploads') });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("static"));

let comments = new Datastore({
  filename: join('db', '/comments.db'), 
  autoload: true, 
  timestampData : true})


let pictures = new Datastore({
  filename: join("db", "/pictures.db"),
  autoload: true,
  timestampData: true,
});

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});



app.post("/api/picture/", upload.single("picture"), function (req, res, next) {
  pictures.insert({title: req.body.title,
                    artist: req.body.artist,
                    date: req.body.date,
                    pic: req.file
    }, function (err, picture) {
    if (err) 
    {
      return res.status(500).end(err);
    }
    return res.redirect("/")
  });
});

app.post("/api/comment/", function(req, res, next) {
  comments.insert({
    imageID: req.body.imageID,
    author: req.body.author,
    content: req.body.content,
    date: req.body.date
  }, (err, comment) => {
    if (err)
      return res.status(500).end(err);
    return res.redirect("/")
  })
})



app.get("/api/picture/:index", function (req, res, next) {
  pictures
  .find({})
  .sort({createdAt: 1}) 
  .exec((err, pictures) => {
    if (err) 
      return res.status(500).end(err);
    if (!pictures[req.params.index])
    {
      return
    }
    const pathToPic = pictures[req.params.index].pic
    res.setHeader('Content-Type', pathToPic.mimetype);
    res.sendFile(pathToPic.path);
  });
});

app.get("/api/pictureInfo/:index", function (req, res, next) {
  pictures
  .find({})
  .sort({createdAt: 1}) 
  .exec((err, pictures) => {
    if (err) 
      return res.status(500).end(err);
    let RightArrow = false
    if (!pictures[+req.params.index])
    {
      return res.json({})
    }
    if (pictures[+req.params.index + 1])
    {
      RightArrow = true
    }
    res.json({art_info: pictures[req.params.index], doRightArrow: RightArrow})
  });
});


//Chapter means a new list of 10
app.get("/api/comments/:imageID/:chapter", (req, res, next) => {
  comments
  .find({imageID: req.params.imageID})
  .sort({createdAt: -1})
  .exec((err, comments) => {
    if (err)
      return res.status(500).end(err);
    console.log(comments)
    if(!comments[10 * +req.params.chapter])
    {
      
      return res.json({})
    }
    let indexOfDBArr = 0
    let returnArr = []
    let rightArrow = false;
    console.log("UwU")
    while(comments[10 * req.params.chapter + indexOfDBArr] && indexOfDBArr < 10)
    {
      returnArr[indexOfDBArr] = comments[10 * req.params.chapter + indexOfDBArr]
      indexOfDBArr++;
    }
    //We need to check if our frontend should do a right arrow for next comment chapter
    if (indexOfDBArr == 10 && comments[10 * req.params.chapter + indexOfDBArr])
    {
      rightArrow = true;
    }
    
    res.json({comments: returnArr,
              doRightArrow: rightArrow})
  })
})


app.delete("/api/picture/:id/", function (req, res, next) {
  pictures.findOne({ _id: req.params.id }, function (err, picture) {  
    if 
      (err) return res.status(500).end(err);
    if (!picture)
    {
      return res.status(404).end("Picture id #" + req.params.id + " does not exist");
    }
    pictures.remove({ _id: picture._id }, { multi: false, returnUpdatedDocs: true}, function (err, number) 
    {
      if(err)
        return res.status(500).end(err);
      if (number != 1)
        return res.status(501).end("More or less than one element was removed")
      return res.json({})
    });
  });
});

app.delete("/api/comment/:id/", function (req, res, next) {
  comments.findOne({ _id: req.params.id }, function (err, comment) {
    if 
      (err) return res.status(500).end(err);
    if (!comment)
      return res.status(404).end("Comment id #" + req.params.id + " does not exist");
    comments.remove({ _id: comment._id }, { multi: false });
    return res.json({})
  });
})


//The code below is only used for testing
//___________________________________________________________________________________
//Thanks Thierry for the testing code structure
export function getPictures(callback) {
  return pictures
    .find({})
    .sort({ createdAt: -1 })
    .exec(function (err, pics) {
      if (err) return callback(err, null);
      return callback(err, pics.reverse());
    });
}

export function getComments(callback) {
  return comments
    .find({})
    .sort({ createdAt: -1 })
    .exec(function (err, comments) {
      if (err) return callback(err, null);
      return callback(err, comments.reverse());
    });
}

export function createTestDB() {
  comments = new Datastore({ 
    filename: './testdb/testcomments.db', 
    autoload: true, 
    timestampData : true})
    pictures = new Datastore({
      filename: "./testdb/testpictures.db",
      autoload: true,
      timestampData: true,
    });
  upload = multer({ dest: path.resolve('testuploads') });
}

export function deleteTestDB() {
  rmSync("testdb", { recursive: true, force: true })
  rmSync("testuploads", { recursive: true, force: true })
  //Remove before prod run, or will delete all pictures when tested !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  rmSync("uploads", { recursive: true, force: true })
}


export const server = createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
