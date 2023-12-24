import chai from "chai";
import chaiHttp from "chai-http";
import {compare} from "bcrypt";

import { getPictures, getComments, getUsers, server, createTestDB, deleteTestDB } from "../app.mjs";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Testing API", () => {

  let agent;
  let picID1;
  let picID2

  before(function () {
    agent = chai.request.agent(server)
    createTestDB();
  })

  after(function () {
    deleteTestDB(picID1, picID2);
    agent.close();
    server.close();
  });

  //Since our image IDs are created by our database, we will initialize them here 
  //and get them from our database to use them for later
  
  let ImageID1 = ""
  let CommentID1 = ""

  const testUser = {
    username: "Someone Interesting",
    password: "Depresson"
  }

  const testComment = {
    content: "Rawr, Rawr, Rawr",
    date: "Posted by some weirdo",
    imageID: "0"
  }
  const testComment2 = {
    content: "Test2C",
    date: "Test2D",
    imageID: "1"
  }

  const testinput = {
    title: "A widdwe catboi UwU",
    date: "Posted on Dec 31st, 1969",
    pic: "./test/testupload/testpictures"
  }

  const testinput2 = {
    title: "Person2 Art",
    date: "Posted on Test 2",
    pic: "./test/testupload/testpictures"
  }

  it("it should reject adding a picture", function (done) {
    agent
      .post("/api/picture/")
      .field(testinput)
      .end(function (err, res) {
        if (err)
          return done(err)
        expect(res).to.have.status(401);
        getPictures(function (err, pics) {
          if (err) 
            return done(err);
          done();
        });
    });
  });

  it("it should sign up a user", function (done) {
    agent
      .post("/signUser")
      .send(testUser)
      .end(function (err, res)
        {
          if (err)
            return done(err)
          expect(res).to.have.status(200);
          
          getUsers(function (err, users) {
            if (err) return done(err)
            expect(users[0]._id).to.be.equal(testUser.username);
            compare(testUser.password, users[0].hash, function (err, isValid)
            {
              if (err) return done(err);
              expect(isValid).to.be.true;
              done();
            })
          })
        }
      );
  })

  it("it should sign in a user", function (done) {
    agent
      .post("/checkSignIn")
      .send(testUser)
      .end(function (err, res)
        {
          if (err)
            return done(err)
          expect(res).to.have.status(200);
          expect(res.headers["set-cookie"][0]).to.be.equal('username=Someone%20Interesting; Max-Age=604800; Path=/');
          done();
        }
      );
  })

  it("it should add a picture", function (done) {
    agent
      .post("/api/picture")
      .set("content-type", 'multipart/form-data')
      .attach('picture', './test/testupload/MATC27.jpg', "MATC27.jpg")
      .field(testinput)
      .end(function (err, res) {
        if (err)
          return done(err)
        expect(res).to.have.status(200);
        getPictures(function (err, pics) {
          if (err) 
            return done(err);
          expect(pics).to.have.length(1);
          expect(pics[0]).to.have.property("title", testinput.title)
          expect(pics[0]).to.have.property("artist", testUser.username)
          expect(pics[0]).to.have.property("date", testinput.date)
          done();
        });
    });
  });

  it("it should add another picture", function (done) {
    agent
      .post("/api/picture/")
      .set("content-type", 'multipart/form-data')
      .attach('picture', './test/testupload/MathJoke.png', "MathJoke.png")
      .field(testinput2)
      .end(function (err, res) {
        if (err)
          return done(err)
        expect(res).to.have.status(200);
        getPictures(function (err, pics) {
          if (err) 
            return done(err);
          expect(pics).to.have.length(2);
          expect(pics[1]).to.have.property("title", testinput2.title)
          expect(pics[1]).to.have.property("artist", testUser.username)
          expect(pics[1]).to.have.property("date", testinput2.date)
          done();
        });
    });
  });
  it("it should get the first picture", function (done) {
    agent
      .get("/api/pictureInfo/1/Someone Interesting")
      .end(function (err, res) {
        if (err)
          return done(err)
        expect(res).to.have.status(200);
        expect(res.body.art_info).to.have.property("_id")
        ImageID1 = res.body.art_info._id;
        expect(res.body.art_info).to.have.property("title", testinput2.title)
        expect(res.body.art_info).to.have.property("artist", testUser.username)
        expect(res.body.art_info).to.have.property("date", testinput2.date)
        expect(res.body).to.have.property("doRightArrow", false)
        done();
        });
    });


    it("it should add a comment to a picture", function (done) {
      agent
        .post("/api/comment")
        .set("content-type", "application/json")
        .send(testComment)
        .end(function (err, res) {
          if (err)
            return done(err)
          expect(res).to.have.status(200);
          getComments(function (err, comments) {
            if (err)
              return done(err)
            expect(comments[0]).to.have.property("content", testComment.content)
            expect(comments[0]).to.have.property("author", testUser.username)
            expect(comments[0]).to.have.property("date", testComment.date)
            expect(comments[0]).to.have.property("imageID", testComment.imageID)
            done();
          })
          
          });
        });
    it("it should add another comment", function (done) {
      agent
        .post("/api/comment")
        .set("content-type", "application/json")
        .send(testComment2)
        .end(function (err, res) {
          if (err)
            return done(err)
          expect(res).to.have.status(200);
          getComments(function (err, comments) {
            if (err)
              return done(err)
            expect(comments[1]).to.have.property("content", testComment2.content)
            expect(comments[1]).to.have.property("author", testUser.username)
            expect(comments[1]).to.have.property("date", testComment2.date)
            done();
          })
          
          });
        });
    it("it should get the first comment only", function (done) {
      agent
        .get("/api/comments/0/0")
        .set("content-type", "application/json")
        .end(function (err, res) {
          if (err)
            return done(err)
          expect(res).to.have.status(200);
          expect(res.body.comments[0]).to.have.property("_id")
          CommentID1 = res.body.comments[0]._id
          expect(res.body.comments[0]).to.have.property("content", testComment.content)
          expect(res.body.comments[0]).to.have.property("author", testUser.username)
          expect(res.body.comments[0]).to.have.property("date", testComment.date)
          done();
          });
      });
    it("it should delete the first picture only", function (done) {
      agent
        .delete(`/api/picture/${ImageID1}`)
        .end(function (err, res) {
          if (err)
            return done(err)
          getPictures(function (err, pictures) {
            if (err)
              return done(err)
            expect(pictures).to.have.length(1);
            done();
          });
      });
    });

    it("it should delete the first comment only", function (done) {
      agent
        .delete(`/api/comment/${CommentID1}`)
        .end(function (err, res) {
          if (err)
            return done(err)
          expect(res).to.have.status(200);
          getComments(function (err, comments) {
            if (err)
              return done(err)
            expect(comments).to.have.length(1);
            done();
          });
      });
    });
});