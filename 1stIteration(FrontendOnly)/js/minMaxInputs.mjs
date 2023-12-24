import { handlePicSubmit, handleCommentSubmit } from "./SubmitBtns.mjs";


export function runPicButtonFunctionalities()
{
    const cmt_btn_id = document.getElementById("PictureChangeSize");
    if (cmt_btn_id.innerText == "-")
    {
        cmt_btn_id.addEventListener("click", function (e){
        e.preventDefault();
        const pict_contain = document.getElementById("Picture_Form_Container");
        pict_contain.remove();
        const small_pic_area = document.createElement("form");
        small_pic_area.innerHTML = `<div class="form_title" id="Picture_Form_Container">Add Your Masterpiece</div>
        <button class="small_hide_show_text" id="PictureChangeSize">+</button>`;
        small_pic_area.className = "input_container";
        small_pic_area.id = "Picture_Form_Container_Condense";
        document.getElementById("input_pic_general_area").append(small_pic_area);
        runPicButtonFunctionalities();
        });
        return;
    }
    else 
    {
        cmt_btn_id.addEventListener("click", function(e){
            e.preventDefault();
            const small_pic_area = document.getElementById("Picture_Form_Container_Condense");
            small_pic_area.remove();
            const large_input_area = document.createElement("form");
            large_input_area.className = "input_container";
            large_input_area.id = "Picture_Form_Container"
            large_input_area.innerHTML =`
            <div class="form_title" >Add Your Masterpiece</div>
            <button class="small_hide_show_text" class="btn" id="PictureChangeSize">-</button>
            <input class="input_fields" placeholder="Enter Artist Name" id="artist_name"></input>
            <input class="input_fields" placeholder="Enter Artwork Name" id="art_name"></input>
            <input class="input_fields" placeholder="Enter URL of picture" id="art_pth_name"></input>
            <button class="submit_btn btn" id="submit_art_btn">Submit your art!</button>`
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
        const cmt_contain = document.getElementById("cmt_input_contain");
        cmt_contain.remove();
        const small_cmt_area = document.createElement("form");
        small_cmt_area.innerHTML = `<div class="form_title">Comment on This Piece</div>
        <button id="comment_toggle_hide_btn" class="small_hide_show_text">+</button>`;
        small_cmt_area.className = "input_container";
        small_cmt_area.id = "Cmt_Form_Container_Condense";
        document.getElementById("input_comment_general_area").append(small_cmt_area);
        runCommentButtonFunctionalities();
        });
        return;
    }
    else 
    {
        cmt_btn_id.addEventListener("click", function(e){
            e.preventDefault();
            const cmt_contain = document.getElementById("Cmt_Form_Container_Condense");
            cmt_contain.remove();
            const large_input_area = document.createElement("form");
            large_input_area.className = "input_container";
            large_input_area.id = "cmt_input_contain"
            large_input_area.innerHTML =`
            <div class="form_title">Comment on This Piece</div>
          <button id="comment_toggle_hide_btn" class="small_hide_show_text">-</button>
          <input class="input_fields" id="comment_author" placeholder="Enter Your Name"></input>
          <input class="input_fields" id="comment_content" placeholder="Enter Comment"></input>
          <button class="submit_btn btn" id="submit_comment">Submit your comment</button>`
            document.getElementById("input_comment_general_area").append(large_input_area);
            runCommentButtonFunctionalities();
            handleCommentSubmit();
        });
        return;
    }
}