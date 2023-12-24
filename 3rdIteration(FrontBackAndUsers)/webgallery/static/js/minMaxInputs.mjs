import { createNewElement } from "./HTMLHelperFunctions.mjs";
import { handlePicSubmit, handleCommentSubmit } from "./SubmitBtns.mjs";


export function runPicButtonFunctionalities()
{
    const cmt_btn_id = document.getElementById("PictureChangeSize");
    if (cmt_btn_id.innerText == "-")
    {
        cmt_btn_id.addEventListener("click", function (e){
        e.preventDefault();
        document.getElementById("Picture_Form_Container").remove();
        const small_pic_area = createNewElement("form", "input_container", "Picture_Form_Container_Condense", "",
        `<div class="form_title" id="Picture_Form_Container">Add Your Masterpiece</div>
        <button class="small_hide_show_text" id="PictureChangeSize">+</button>`);
        document.getElementById("input_pic_general_area").append(small_pic_area);
        runPicButtonFunctionalities();
        });
        return;
    }
    else 
    {
        cmt_btn_id.addEventListener("click", function(e){
            e.preventDefault();
            document.getElementById("Picture_Form_Container_Condense").remove();
            const large_input_area = createNewElement("form", "input_container", "Picture_Form_Container", "",
            `<div class="form_title" >Add Your Masterpiece</div>
            <h5 class="center">You must be signed in for your work to be saved</h5>
            <button class="small_hide_show_text btn" id="PictureChangeSize">-</button>
            <input class="input_fields" placeholder="Enter Artwork Name" name="title" id="art_name" ></input>
            <input type="file" class="input_fields" id="art_file" accept="image/*"></input>
            <button type="submit" class="submit_btn btn" id="submit_art_btn">Submit your art!</button>`);
            document.getElementById("input_pic_general_area").append(large_input_area);
            runPicButtonFunctionalities();
            handlePicSubmit();
        });
        return;
    }
}

export function runCommentButtonFunctionalities()
{
    const cmt_btn_id = document.getElementById("comment_toggle_hide_btn");
    if (cmt_btn_id.innerText == "-")
    {
        cmt_btn_id.addEventListener("click", function (e){
        e.preventDefault();
        document.getElementById("cmt_input_contain").remove();
        const small_cmt_area = createNewElement("form", "input_container", "Cmt_Form_Container_Condense", "", `<div class="form_title">Comment on This Piece</div>
        <button id="comment_toggle_hide_btn" class="small_hide_show_text">+</button>`);
        document.getElementById("input_comment_general_area").append(small_cmt_area);
        runCommentButtonFunctionalities();
        });
        return;
    }
    else 
    {
        cmt_btn_id.addEventListener("click", function(e){
            e.preventDefault();
            document.getElementById("Cmt_Form_Container_Condense").remove();
            const large_input_area = createNewElement("form", "input_container", "cmt_input_contain", "", `
            <div class="form_title">Comment on This Piece</div>
          <button id="comment_toggle_hide_btn" class="small_hide_show_text">-</button>
          <input class="input_fields" id="comment_content" placeholder="Enter Comment"></input>
          <button class="submit_btn btn" id="submit_comment">Submit your comment</button>`);
            document.getElementById("input_comment_general_area").append(large_input_area);
            runCommentButtonFunctionalities();
            handleCommentSubmit();
        });
        return;
    }
}