import { deleteComment, getCommentsImageID } from "./api.mjs";
import { runCommentButtonFunctionalities} from "./minMaxInputs.mjs";
import {handleCommentSubmit} from "./SubmitBtns.mjs"

export function updateComments(imageID) {
    const arrayOfComments = getCommentsImageID(imageID);
    let doRightArrow = false
    let comment_grp = +localStorage.getItem("CommentGroup")
    for (let index=0; index < 10; index++)
    {   
        if (!arrayOfComments[+(10 * comment_grp + index)])
        {
          break;
        }
        newComment(arrayOfComments[+(10 * comment_grp + index)])
        if (index >= 9 && arrayOfComments[+(10*comment_grp + 10)])
        {
          doRightArrow = true;
        }
    }
    if (doRightArrow)
    {
      handleRightCommentArrow(comment_grp);
    }
    if (comment_grp > 0)
    {
      handleLeftCommentArrow(comment_grp)
    }
    //Set an on-click listener that fills the rest of the array for the next arrow if doArrows (also need to keep track of where in the array we are)
}

function handleRightCommentArrow(comment_grp)
{
  const right_arrow = document.createElement("div")
  right_arrow.className = "right_arrow comment_arrow"
  right_arrow.addEventListener("click", function (e){
    localStorage.setItem("CommentGroup", comment_grp + 1)
    deleteCommentArea();
    setUpCommentsArea();
    updateComments(+localStorage.getItem("CurrInd"));
  })
  document.getElementById("comment_arrows_container").append(right_arrow);
}


function handleLeftCommentArrow(comment_grp)
{
  const left_arrow = document.createElement("div")
  left_arrow.className = "left_arrow comment_arrow"
  left_arrow.addEventListener("click", function(e){
    localStorage.setItem("CommentGroup", comment_grp - 1)
    deleteCommentArea();
    setUpCommentsArea();
    updateComments(+localStorage.getItem("CurrInd"));
  })
  document.getElementById("comment_arrows_container").prepend(left_arrow)
}

function newComment(commentClass)
{
  const comment = document.createElement("div");
  comment.className = "single_comment_title_container";
  comment.innerHTML= `<div class="single_comment_container">
  <div class="single_comment_title_container">
    <div class="deleteButton deleteComment" id="deleteComment${commentClass.commentID}"></div>
    <h1 class="comment_single_title" id="UserCmtTitle">${commentClass.author}</h1>
    <h5 class="small_text" id="DateInput">${commentClass.date}</h5>
  </div>
  <h3 class="single_comment_content" id="CommentContent">${commentClass.content}</h3>
</div>`
  document.getElementById("comments").append(comment)
  document.getElementById(`deleteComment${commentClass.commentID}`).addEventListener("click", function(e) {
    deleteCommentArea();
    deleteComment(commentClass.commentID);
    localStorage.setItem("CommentGroup", 0)
    setUpCommentsArea();
    const keyForCurrImg = +localStorage.getItem("CurrInd")
    updateComments(JSON.parse(localStorage.getItem(keyForCurrImg)).imageId)
  });
}

export function setUpCommentsArea() {
    const commentInputArea = document.createElement("div");
    commentInputArea.id = "input_comment_general_area"
    commentInputArea.innerHTML = `<form class="input_container" id="cmt_input_contain">
    <div class="form_title">Comment on This Piece</div>
    <button id="comment_toggle_hide_btn" class="small_hide_show_text">-</button>
    <input class="input_fields" placeholder="Enter Your Name" id="comment_author"></input>
    <input class="input_fields" placeholder="Enter Comment" id="comment_content"></input>
    <button class="submit_btn btn" id="submit_comment">Submit your comment</button>
  </form>`
  document.getElementById("EntireCommentArea").prepend(commentInputArea);
    const commentSetUpArea = document.createElement("div");
    commentSetUpArea.className = "comment_area_container";
    commentSetUpArea.id = "comment_area_container";
    commentSetUpArea.innerHTML = `<div class="comment_title">Comments on Current Piece</div><div class="comments_area" id="comments"></div>`
    document.getElementById("EntireCommentArea").append(commentSetUpArea);
    const commentArrowsContainer = document.createElement("div")
    commentArrowsContainer.className = "comment_arrows_container"
    commentArrowsContainer.id = "comment_arrows_container"
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