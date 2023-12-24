import { signUpUser,logInUser } from "./api.mjs";
import { createNewElement } from "./HTMLHelperFunctions.mjs";


document.getElementById("SignUp").addEventListener("click", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (validateSignUp(username, password)) {
        signUpUser(username, password, function(err, res) {
            if (err) 
            {
                const ClearErrorText = document.getElementById("SignUpErrorText")
                if (ClearErrorText)
                {
                    ClearErrorText.remove()
                }
                const ErrorText = createNewElement("h1", "ErrorText", "SignUpErrorText", "Error Signing Up User. Username is already taken")
                document.getElementById("SignUpDocument").append(ErrorText)
                return;
            }
        })
        clearText();
    }
    else 
    {
        alert("Please fill in all fields")
    }
})

document.getElementById("SignIn").addEventListener("click", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (validateSignUp(username, password)) 
    {
        logInUser(username, password, function(err, res) {
            if (err) 
            {
                const ClearErrorLoginText = document.getElementById("LoginErrorText")
                if (ClearErrorLoginText)
                {
                    ClearErrorLoginText.remove()
                }
                const ErrorLoginText = createNewElement("h1", "ErrorText", "LoginErrorText", "Error logging in. Make sure all fields are filled correctly")
                document.getElementById("SignUpDocument").append(ErrorLoginText)
                console.log(err)
                return;
            }
            window.location.href = "/";
        })
        clearText();
    }
})

function clearText() {
    document.getElementById("username").value;
    document.getElementById("password").value;
    document.getElementById("SignUpContainer").reset();
}


function validateSignUp(user, password)
{
    return !(user === "" && password === "")
}