//Thanks Thierry for the backend framework, I'm not reinventing the wheel here.
import { join } from "path";
import { createServer } from "http";
import express from "express";
import Datastore from "nedb";
import multer from "multer"
import path from "path"
import session from "express-session"
import { rmSync } from "fs";
import {genSalt, hash, compare} from "bcrypt"
import {serialize, parse} from "cookie"

const PORT = 3000;
const app = express();

let upload = multer({ dest: path.resolve('uploads') });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "RawrXDNUzzlePouncesOnYouUwU",
    resave: false,
    saveUninitialized: true,
  }),
);

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

let users = new Datastore({
  filename: join("db", "/users.db"),
  autoload: true,
  timestampData: true,
});

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

function AuthenticateMeSenpai(req, res, next)
{
  if (!req.session.username)
  {
    return res.status(401).end("access denied");
  }
  next();
}

app.post("/signUser", function(req, res, next) 
{
  const username = req.body.username;
  const password = req.body.password;
  if(!username)
    return res.status(400).end("username is missing");
  if(!password)
    return res.status(400).end("password is missing");
  users.findOne({_id: username}, function(err, user)
  {
    if (err)
      return res.status(500).end(err);
    if (user)
      return res.status(409).end("username " + username + " already exists");
    genSalt(10, function (err, salt)
    {
      hash(password, salt, function(err, hash)
      {
        users.update(
          {_id: username},
          {_id: username, hash: hash},
          {upsert: true},
          function (err) {
            if (err) return res.status(500).end(err);
        return res.end("account created");
          });
      });
      })
    });
})

app.post("/checkSignIn", function(req, res, next)
{
  const username = req.body.username;
  const password = req.body.password;
  if(!(username))
    return res.status(400).end("username is missing");
  if(!(password))
    return res.status(400).end("password is missing");
  users.findOne({_id: username}, function (err, user) {
  if (err) return res.status(500).end(err);
    if (!user) return res.status(401).end("access denied");
    compare(password, user.hash, function (err, valid) {
      if (err) return res.status(500).end(err);
      if (!valid) return res.status(401).end("access denied");
      // start a session
      req.session.username = username;
      res.setHeader(
        "Set-Cookie",
        serialize("username", username, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }),
      );
      return res.json({username: username})
    })
  })
});

//Prof. Thierry designed this endpoint
app.get('/signout/', function(req, res, next){
  req.session.destroy();
  res.setHeader('Set-Cookie', serialize('username', '', {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
  }));
  return res.json({});
});

app.get("/getAllUsers", AuthenticateMeSenpai, function(req, res, next) {
  getUsers(function (err, users) {
    if (err) return res.status(500).end("Error retrieving users")
    if (users) {
      return res.json({userArr: users});
    }
  })
})

app.post("/api/picture/", AuthenticateMeSenpai, upload.single("picture"), function (req, res, next) {
  pictures.insert({title: req.body.title,
                    artist: req.session.username,
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

app.post("/api/comment/", AuthenticateMeSenpai, function(req, res, next) {
  comments.insert({
    imageID: req.body.imageID,
    author: req.session.username,
    content: req.body.content,
    date: req.body.date
  }, (err, comment) => {
    if (err)
      return res.status(500).end(err);
    return res.redirect("/")
  })
})



app.get("/api/picture/:index/:artist", AuthenticateMeSenpai, function (req, res, next) {
  pictures
  .find({artist: req.params.artist})
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

app.get("/api/pictureInfo/:index/:artist", AuthenticateMeSenpai, function (req, res, next) {
  pictures
  .find({artist: req.params.artist})
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
app.get("/api/comments/:imageID/:chapter", AuthenticateMeSenpai, (req, res, next) => {
  comments
  .find({imageID: req.params.imageID})
  .sort({createdAt: -1})
  .exec((err, comments) => {
    if (err)
      return res.status(500).end(err);
    if(!comments[10 * +req.params.chapter])
    {
      
      return res.json({})
    }
    let indexOfDBArr = 0
    let returnArr = []
    let rightArrow = false;
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


app.delete("/api/picture/:id/", AuthenticateMeSenpai, function (req, res, next) {
  pictures.findOne({ _id: req.params.id }, function (err, picture) {
    if(err) return res.status(500).end(err);
    if (!picture)
      {
        return res.status(404).end("Picture id #" + req.params.id + " does not exist");
      }
    if (req.session.username === picture.artist)
    {
      pictures.remove({ _id: picture._id }, { multi: false, returnUpdatedDocs: true}, function (err, number) 
      {
      if(err)
        return res.status(500).end(err);
      if (number != 1)
        return res.status(501).end("More or less than one element was removed")
      return res.json({})
      });
    }
    else
    {
      return res.status(401).end("Access denied");
    }
  });
});

app.delete("/api/comment/:id/", AuthenticateMeSenpai, function (req, res, next) {
  comments.findOne({ _id: req.params.id }, function (err, comment) {
    if 
      (err) return res.status(500).end(err);
      if (!comment)
        {
          return res.status(404).end("Comment id #" + req.params.id + " does not exist");
        }
        pictures.findOne({_id: comment.imageID}, function (err, pictureCommentedOn) {
          if (err) return res.status(500).end(err);
          if (req.session.username === comment.author || pictureCommentedOn.artist === req.session.username)
          {
            comments.remove({ _id: comment._id }, { multi: false, returnUpdatedDocs: true}, function (err, number) 
            {
            if(err)
              return res.status(500).end(err);
            
            if (number != 1)
              return res.status(501).end("More or less than one element was removed")
            return res.json({})
            });
          }
          else
          {
            return res.status(401).end("Access denied");
          }
        })
      
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

export function getUsers(callback) {
  return users
    .find({})
    .sort({ createdAt: 1 })
    .exec(function (err, users) {
      if (err) return callback(err, null);
      return callback(err, users);
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
      timestampData: true
    });
    users = new Datastore({
      filename: "./testdb/testusers.db",
      autoload: true,
      timestampData: true
    })
}

export function deleteTestDB() {
  rmSync("testdb", { recursive: true, force: true })
}


export const server = createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
