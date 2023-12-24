import chai from "chai";
import chaiHttp from "chai-http";
import fs from 'fs';

import { getPictures, getComments, server, createTestDB, deleteTestDB } from "../app.mjs";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Testing API", () => {

  before(function () {
    createTestDB();
  })

  after(function () {
    deleteTestDB();
    server.close();
  });

  //Since our image IDs are created by our database, we will initialize them here 
  //and get them from our database to use them for later
  
  let ImageID1 = ""
  let CommentID1 = ""


  const testComment = {
    author: "DiscordKitten",
    content: "Rawr, Rawr, Rawr",
    date: "Posted by some weirdo",
    imageID: "0"
  }
  const testComment2 = {
    author: "Test2",
    content: "Test2C",
    date: "Test2D",
    imageID: "1"
  }

  const testinput = {
    title: "A widdwe catboi UwU",
    artist: "Some guy",
    date: "Posted on Dec 31st, 1969",
    pic: "./test/testupload/testpictures"
  }

  const testinput2 = {
    title: "Person2 Art",
    artist: "Person2",
    date: "Posted on Test 2",
    pic: "./test/testupload/testpictures"
  }

  it("it should add a picture", function (done) {
    chai
      .request(server)
      .post("/api/picture/")
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
          expect(pics[0]).to.have.property("artist", testinput.artist)
          expect(pics[0]).to.have.property("date", testinput.date)
          done();
        });
    });
  });

  it("it should add another picture", function (done) {
    chai
      .request(server)
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
          expect(pics[1]).to.have.property("artist", testinput2.artist)
          expect(pics[1]).to.have.property("date", testinput2.date)
          done();
        });
    });
  });
  it("it should get the first picture", function (done) {
    chai
      .request(server)
      .get("/api/pictureInfo/1")
      .end(function (err, res) {
        if (err)
          return done(err)
        expect(res).to.have.status(200);
        expect(res.body.art_info).to.have.property("_id")
        ImageID1 = res.body.art_info._id;
        expect(res.body.art_info).to.have.property("title", testinput2.title)
        expect(res.body.art_info).to.have.property("artist", testinput2.artist)
        expect(res.body.art_info).to.have.property("date", testinput2.date)
        done();
        });
    });


    it("it should add a comment picture", function (done) {
      chai
        .request(server)
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
            expect(comments[0]).to.have.property("author", testComment.author)
            expect(comments[0]).to.have.property("date", testComment.date)
            expect(comments[0]).to.have.property("imageID", testComment.imageID)
            done();
          })
          
          });
        });
    it("it should add another comment", function (done) {
      chai
        .request(server)
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
            expect(comments[1]).to.have.property("author", testComment2.author)
            expect(comments[1]).to.have.property("date", testComment2.date)
            done();
          })
          
          });
        });
    it("it should get the first comment only", function (done) {
      chai
        .request(server)
        .get("/api/comments/0/0")
        .set("content-type", "application/json")
        .end(function (err, res) {
          if (err)
            return done(err)
          expect(res).to.have.status(200);
          expect(res.body.comments[0]).to.have.property("_id")
          CommentID1 = res.body.comments[0]._id
          expect(res.body.comments[0]).to.have.property("content", testComment.content)
          expect(res.body.comments[0]).to.have.property("author", testComment.author)
          expect(res.body.comments[0]).to.have.property("date", testComment.date)
          done();
          });
      });
    it("it should delete the first picture only", function (done) {
      chai
        .request(server)
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
      chai
        .request(server)
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