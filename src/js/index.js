function loginSignup(login){
    document.querySelector("#registerCont").style.display = "none";
    document.querySelector("#register").style.display = "none";
    document.querySelector("#loginCont").style.display = "block";
    document.querySelector("#signupCont").style.display = "block";

    if (login){
        document.querySelector("#login").style.display = "block";
        document.querySelector("#loginCont").style.backgroundColor = "white";
        document.querySelector("#signup").style.display = "none";
        document.querySelector("#signupCont").style.backgroundColor = "rgb(240, 240, 240)";
    }
    else {
        document.querySelector("#login").style.display = "none";
        document.querySelector("#loginCont").style.backgroundColor = "rgb(240, 240, 240)";
        document.querySelector("#signup").style.display = "block";
        document.querySelector("#signupCont").style.backgroundColor = "white";
    }
}

function registerUi(){
    document.querySelector("#login").style.display = "none";
    document.querySelector("#loginCont").style.display = "none";
    document.querySelector("#signup").style.display = "none";
    document.querySelector("#signupCont").style.display = "none";
    document.querySelector("#register").style.display = "block";
    document.querySelector("#registerCont").style.display = "block";
}

function showAcctHistory(){
    document.querySelector("#acctHistory").style.display = "block";
    document.querySelector("#acctSummary").style.display = "none";
}

function showAcctSummary(){
    document.querySelector("#acctHistory").style.display = "none";
    document.querySelector("#acctSummary").style.display = "block";
}