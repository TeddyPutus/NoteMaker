let apiRoot = "http://localhost:5001/" //append specific api calls to this

let user; //this will keep all of our user data once we are logged in!

function createLogInForm(){
    // <div id="login-form">
    //         <h2>Log in</h2>
    //         <input type="text" id="login-email" placeholder="Email">
    //         <input type="password" id="login-password" placeholder="Password">
    //         <div id="login-form-btn-area">
    //             <button id="sign-in-btn">Sign in</button>
    //             <button id="sign-up-btn">Sign up</button>
    //         </div>
    //     </div>

    //we are going to be adding to main
    const mainArea = document.querySelector("main");

    const formDiv = document.createElement('div');
    formDiv.setAttribute('id','login-form');

    const loginTitle = document.createElement('h2');
    loginTitle.setAttribute('id','login-title');
    loginTitle.innerText = "Log in";

    const emailInput = document.createElement('input');
    emailInput.setAttribute('id','login-email');
    emailInput.setAttribute('type','text');
    emailInput.setAttribute('placeholder','Enter email...');

    const passwordInput = document.createElement('input');
    passwordInput.setAttribute('id','login-password');
    passwordInput.setAttribute('type','password');
    passwordInput.setAttribute('placeholder','Enter password...');

    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('id','login-btn-div');

    const logInBtn = document.createElement('button');
    logInBtn.setAttribute('id','login-btn');
    logInBtn.innerText = "Log in";
    logInBtn.addEventListener('click', () => {
        logIn(emailInput.value, passwordInput.value);
    })

    const signUpBtn = document.createElement('button');
    signUpBtn.setAttribute('id','signup-btn');
    signUpBtn.innerText = "Sign up";

    buttonDiv.append(signUpBtn, logInBtn);
    formDiv.append(emailInput, passwordInput, buttonDiv);
    mainArea.append(formDiv);
}

async function logIn(email, password){
    //     fetch(`${apiRoot}users/login`, {
    //         method: 'post',
    //         mode:'cors',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //           "email" : email,
    //           "password" : password
    //         }),
    // })
    // .then(response => response.json())
    // .then(response => console.log(JSON.stringify(response)))


    const response = await postData(`users/login`, { email: email, password: password })
//   .then((response) => {
    if(response.data) user = response.data; //data is all the user details, save it so we can do other api calls without always entering password etc.
    console.log(response.data);
    console.log(response.status);
//   });
}

// This function takes a url and a
async function postData(url = '', data = {}) {
    const response = await fetch(`${apiRoot}${url}`, { //creates the url to post, all api calls start with the root
      method: 'POST', 
      mode: 'cors', //Must be cors, or nothin will appear in the body!
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    let dataToSend = response.status === 200 ? response.json() : false;
    
    return {data: dataToSend, status: response.status}; // parses JSON response into native JavaScript objects
  }

createLogInForm();