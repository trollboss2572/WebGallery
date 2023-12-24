import { deleteComment, getItem, setItem, getComments } from "./api.mjs";
import { createNewElement } from "./HTMLHelperFunctions.mjs";
import { runCommentButtonFunctionalities} from "./minMaxInputs.mjs";
import {handleCommentSubmit} from "./SubmitBtns.mjs"

export function updateComments(imageID) {
    getComments(+getItem("CommentGroup"), imageID, function (err, res)
    {
    if (err)
      console.log(err)
    
    if (res.comments)
    {
      if (res.doRightArrow)
      {
        handleRightCommentArrow(+getItem("CommentGroup"));
      }
      if (+getItem("CommentGroup") > 0)
      {
        handleLeftCommentArrow(+getItem("CommentGroup"))
      }

      res.comments.forEach(comment => {
        newComment(comment)
      });
      //Set an on-click listener that fills the rest of the array for the next arrow if doArrows (also need to keep track of where in the array we are)
    }
  })
}

function handleRightCommentArrow(comment_grp)
{

  const right_arrow = createNewElement("div", "right_arrow comment_arrow", "", "", "");
  right_arrow.addEventListener("click", function (e){
    setItem("CommentGroup", comment_grp + 1)
    deleteCommentArea();
    setUpCommentsArea();
    updateComments(getItem("CurrentImageID"));
  })
  document.getElementById("comment_arrows_container").append(right_arrow);
}


function handleLeftCommentArrow(comment_grp)
{
  const left_arrow = createNewElement("div", "left_arrow comment_arrow", "", "", "");
  left_arrow.addEventListener("click", function(e){
    setItem("CommentGroup", +comment_grp - 1)
    deleteCommentArea();
    setUpCommentsArea();
    updateComments(getItem("CurrentImageID"));
  })
  document.getElementById("comment_arrows_container").prepend(left_arrow)
}

function newComment(comment)
{
  const Newcomment = createNewElement("div", "single_comment_title_container", "", "", `<div class="single_comment_container">
  <div class="single_comment_title_container">
    <div class="deleteButton deleteComment" id="deleteComment${comment._id}"></div>
    <h1 class="comment_single_title" id="UserCmtTitle">${comment.author}</h1>
    <h5 class="small_text" id="DateInput">${comment.date}</h5>
  </div>
  <h3 class="single_comment_content" id="CommentContent">${comment.content}</h3>
  </div>`);
  document.getElementById("comments").append(Newcomment)
  document.getElementById(`deleteComment${comment._id}`).addEventListener("click", function(e) {
    deleteCommentArea();
    deleteComment(comment._id, function (err, res) 
    {
      if (err)
        console.log(err)
      setItem("CommentGroup", 0)
      setUpCommentsArea();
      updateComments(getItem("CurrentImageID"));
    });
    
  });
}

export function setUpCommentsArea() {
    const commentInputArea = createNewElement("div", "", "input_comment_general_area", "", `<form class="input_container" id="cmt_input_contain">
    <div class="form_title">Comment on This Piece</div>
    <button id="comment_toggle_hide_btn" class="small_hide_show_text">-</button>
    <input class="input_fields" placeholder="Enter Comment" id="comment_content"></input>
    <button class="submit_btn btn" id="submit_comment">Submit your comment</button>
            </form>`);
  document.getElementById("EntireCommentArea").prepend(commentInputArea);
    const commentSetUpArea = createNewElement("div", "comment_area_container", "comment_area_container", "", 
                  `<div class="comment_title">Comments on Current Piece</div><div class="comments_area" id="comments"></div>`);
    document.getElementById("EntireCommentArea").append(commentSetUpArea);
    const commentArrowsContainer = createNewElement("div", "comment_arrows_container", "comment_arrows_container", "", "")
    document.getElementById("EntireCommentArea").append(commentArrowsContainer);
    runCommentButtonFunctionalities();
    handleCommentSubmit();
    return;
}

export function deleteCommentArea() {
  if (document.getElementById("input_comment_general_area") && document.getElementById("comment_area_container"))
  {
    document.getElementById("comment_arrows_container").remove()
    document.getElementById("input_comment_general_area").remove()
    document.getElementById("comment_area_container").remove();
  }
}