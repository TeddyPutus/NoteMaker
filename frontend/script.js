let apiRoot = "http://localhost:5001/" //append specific api calls to this

let user; //this will keep all of our user data once we are logged in!

/** --------------------------------------------------------------------------------------------------*/
/** ----------------------------- DOM manipulation functions -----------------------------------------*/
/** --------------------------------------------------------------------------------------------------*/

function createLogInSignUpForm(loginOrSignup = 'login'){
    const mainArea = document.querySelector("main");
    mainArea.innerHTML = ""; //clear previous form, so we can use this function to switch between log in and sign up

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

    const usernameInput = document.createElement('input');
    usernameInput.setAttribute('id','login-username');
    usernameInput.setAttribute('type','text');
    usernameInput.setAttribute('placeholder','Enter username...');

    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('id','login-btn-div');

    const logInBtn = document.createElement('button');
    logInBtn.setAttribute('id','login-btn');
    logInBtn.innerText = "Log in";
    

    const signUpBtn = document.createElement('button');
    signUpBtn.setAttribute('id','signup-btn');
    signUpBtn.innerText = "Sign up";

    if(loginOrSignup === "login"){
        logInBtn.addEventListener('click', () => {
            logIn(emailInput.value, passwordInput.value);
        })
        signUpBtn.addEventListener('click', () => {
            createLogInSignUpForm("signup");
        })
        usernameInput.classList.add("hide");
    } else { //we are making the sign up form, we have different callbacks, and the username input will show
        signUpBtn.addEventListener('click', () => {
            signUp(emailInput.value, usernameInput.value, passwordInput.value);
        })
        logInBtn.addEventListener('click', () => {
            createLogInSignUpForm();
        })
    }

    buttonDiv.append(signUpBtn, logInBtn);
    formDiv.append(emailInput, usernameInput, passwordInput, buttonDiv);
    mainArea.append(formDiv);
}

function createMainPage(){
    const mainArea = document.querySelector("main");
    mainArea.innerHTML = ""; //clear page

    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('id','main-page-btn-div');

    const publicPostBtn = document.createElement('button');
    publicPostBtn.setAttribute('id','public-post-btn');
    publicPostBtn.innerText = "All Public Posts";
    
    const privatePostBtn = document.createElement('button');
    privatePostBtn.setAttribute('id','private-post-btn');
    privatePostBtn.innerText = "Your Private Posts";

    const createPostBtn = document.createElement('button');
    createPostBtn.setAttribute('id','create-post-btn');
    createPostBtn.innerText = "New Post";

   
    publicPostBtn.addEventListener('click', () => {
        showPublicPosts();
    })
    privatePostBtn.addEventListener('click', () => {
        showPrivatePosts();
    })
    createPostBtn.addEventListener('click', () => {
        createUpdatePostForm('create');
    })

    const postArea = document.createElement('div');
    postArea.setAttribute('id', 'post-area');

    buttonDiv.append(publicPostBtn, privatePostBtn, createPostBtn);
    mainArea.append(buttonDiv, postArea);

    //logout button created in header
    const header = document.querySelector('header');
    const logOutBtn = document.createElement('button');
    logOutBtn.setAttribute('id','logout-btn');
    logOutBtn.innerText = "Logout";

    logOutBtn.addEventListener('click', () => {
        logOut(user.email, user.password);

        header.innerHTML="";
        const title = document.createElement('h1');
        title.innerText = "Post It!";
        header.append(title);
    });

    header.append(logOutBtn);
}

function createUpdatePostForm(createOrUpdate = 'create', data = {}){
    const postArea = document.getElementById("post-area");
    postArea.innerHTML = "";

    const formDiv = document.createElement('div');
    formDiv.setAttribute('id','post-form');

    const formTitle = document.createElement('h2');
    formTitle.setAttribute('id','form-title');
    formTitle.innerText = "New Post";

    const titleInput = document.createElement('input');
    titleInput.setAttribute('id','new-post-title');
    titleInput.setAttribute('type','text');
    titleInput.setAttribute('placeholder','Enter Title...');

    const contentInput = document.createElement('TEXTAREA');
    contentInput.setAttribute('id','new-post-content');
    contentInput.setAttribute('placeholder','Enter content...');

    const isPrivateInput = document.createElement('input');
    isPrivateInput.setAttribute('id','is-private-checkbox');
    isPrivateInput.setAttribute('type','checkbox');

    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('id','create-btn-div');

    const createBtn = document.createElement('button');
    createBtn.setAttribute('id','create-btn');
    

    if(createOrUpdate === "create"){
        createBtn.addEventListener('click', () => {
            createNewPost(titleInput.value, contentInput.value, isPrivateInput.checked)
        })
        createBtn.innerText = "Create Post";
    } else { //pre-fill all the values, change button text and use a different callback for the event listener
        createBtn.addEventListener('click', () => {
            updatePost(titleInput.value, contentInput.value, isPrivateInput.checked, data.id)
        })

        createBtn.innerText = "Update Post";
        titleInput.setAttribute('value',data.title);
        contentInput.setAttribute('value', data.content);
        contentInput.innerText = data.content;
        if(data.isPrivate) isPrivateInput.setAttribute('checked', true);
    }

    buttonDiv.append(createBtn);
    formDiv.append(formTitle, titleInput, contentInput, isPrivateInput, buttonDiv);
    postArea.append(formDiv);
}

/** --------------------------------------------------------------------------------------------------*/
/** ----------------------------------------- Post Drawing functions ---------------------------------*/
/** --------------------------------------------------------------------------------------------------*/

//function to get and display all public posts
async function showPublicPosts(){
    try {
            const postList = await getData('posts/'); //returns an object {data: json, status: integer}

            const postArea = document.getElementById("post-area");
            postArea.innerHTML = "";

            console.log(postList);
            for(let post of postList.data){
                //create each post card, append to the post area
                let postDiv = document.createElement("div");
                postDiv.classList.add('post-div');
                let postTitle = document.createElement("h2")
                postTitle.classList.add('post-title');
                postTitle.innerText = post.title;
                let postContents = document.createElement("p");
                postContents.classList.add('post-contents');
                postContents.innerText = post.content;

                let postAuthor = document.createElement("p");
                postAuthor.classList.add('post-author');
                postAuthor.innerText = post.user.username;

                postDiv.append(postTitle, postContents, postAuthor);

                if(post.user.id === user.id){
                    let buttonDiv = document.createElement('div');
                    buttonDiv.classList.add('post-btn-div')

                    let editButton = document.createElement("button");
                    editButton.classList.add('edit-post-button');
                    editButton.innerText = "Edit post";

                    editButton.addEventListener('click', () => {
                        createUpdatePostForm("update", post);
                    })

                    let deleteButton = document.createElement("button");
                    deleteButton.classList.add('delete-post-button');
                    deleteButton.innerText = "Delete";

                    deleteButton.addEventListener('click', () => {
                        deletePost(post.id);
                    })

                    buttonDiv.append(editButton, deleteButton);
                    postDiv.append(buttonDiv)
                }

                postArea.append(postDiv);
            }
    } catch (error) {
        console.log(error);
    }
    
}

async function showPrivatePosts(){
    try {
            const postList = await getData(`posts/private/${user.id}/${user.password}`); //returns an object {data: json, status: integer}

            const postArea = document.getElementById("post-area");
            postArea.innerHTML = "";

            console.log(postList);
            for(let post of postList.data){
                //create each post card, append to the post area
                let postDiv = document.createElement("div");
                postDiv.classList.add('post-div');
                let postTitle = document.createElement("h2")
                postTitle.classList.add('post-title');
                postTitle.innerText = post.title;
                let postContents = document.createElement("p");
                postContents.classList.add('post-contents');
                postContents.innerText = post.content;

                postDiv.append(postTitle, postContents);
                postArea.append(postDiv);
            }
    } catch (error) {
        console.log(error);
    }
    
}

/** --------------------------------------------------------------------------------------------------*/
/** ------------------------------ API Call - User functions -----------------------------------------*/
/** --------------------------------------------------------------------------------------------------*/

async function signUp(email, username, password){
    const response = await postData(`users/`, { email: email, username: username, password: password })

    if(response.status === 200){
        //success, redraw the login page and give an alert
        createLogInSignUpForm();
        alert("User created! Please log in to continue")
    } else if (response.status === 400){
        createLogInSignUpForm("signup");
        alert("Username or email already taken!")
    }
}

async function logIn(email, password){
    await postData(`users/login`, { email: email, password: password }).then((response) => {
        if(response.data){ 
            user = response.data; //data is all the user details, save it so we can do other api calls without always entering password etc.
            console.log(user);
            createMainPage();
            return;
        } 
        switch(response.status){
            case 406:
                alert("User already logged in");
                break;
            case 401:
                alert("Incorrect password");
                break;
            case 404:
                alert("No such user");
                break;
        }
        createLogInSignUpForm();
    })   
}

async function logOut(email, password){
    await postData(`users/logout`, { email: email, password: password }).then((response) => {
        if(response.data){ 
            user = ""; //we've logged out, forget the user
            createLogInSignUpForm();
            return;
        } 
        switch(response.status){
            case 406:
                alert("User already logged in");
                break;
            case 401:
                alert("Incorrect password");
                break;
            case 404:
                alert("No such user");
                break;
        }
        
    })   
}



/** --------------------------------------------------------------------------------------------------*/
/** --------------------------------- HTTP Request functions -----------------------------------------*/
/** --------------------------------------------------------------------------------------------------*/

// This function takes a url and a data object - can be used for any post API call
async function postData(url = '', data = {}) {
    const response = await fetch(`${apiRoot}${url}`, { //creates the url to post, all api calls start with the root
      method: 'POST', 
      mode: 'cors', //Must be cors, or nothin will appear in the body!
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    let dataToSend = response.status === 200 ? await response.json() : false; //you need to await .json in this case, because the fetch promis is fulfilled once the header returns, NOT the data
    
    return {data: dataToSend, status: response.status}; // parses JSON response into native JavaScript objects
  }

  async function getData(url = '') {
    try {
        const response =  await fetch(`${apiRoot}${url}`);
        const data = await response.json();

        let dataToSend = response.status === 200 ? data : false; //you need to await .json in this case, because the fetch promis is fulfilled once the header returns, NOT the data
        
        return {data: dataToSend, status: response.status}; // parses JSON response into native JavaScript objects
    } catch (error) {
        return error;
    }
    
  }

  async function putData(url = '', data = {}) {
    const response = await fetch(`${apiRoot}${url}`, { //creates the url to post, all api calls start with the root
      method: 'PUT', 
      mode: 'cors', //Must be cors, or nothin will appear in the body!
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    let dataToSend = response.status === 200 ? await response.json() : false; //you need to await .json in this case, because the fetch promis is fulfilled once the header returns, NOT the data
    
    return {data: dataToSend, status: response.status}; // parses JSON response into native JavaScript objects
  }

  async function deleteData(url = '', data = {}) {
    const response = await fetch(`${apiRoot}${url}`, { //creates the url to post, all api calls start with the root
      method: 'DELETE', 
      mode: 'cors', //Must be cors, or nothin will appear in the body!
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    let dataToSend = response.status === 200 ? await response.json() : false; //you need to await .json in this case, because the fetch promis is fulfilled once the header returns, NOT the data
    
    return {data: dataToSend, status: response.status}; // parses JSON response into native JavaScript objects
  }

  

/** --------------------------------------------------------------------------------------------------*/
/** ----------------------------------- API - Post functions -----------------------------------------*/
/** --------------------------------------------------------------------------------------------------*/

async function createNewPost(title, content, isPrivate){
    try {
        await postData(`posts/${user.id}`, {title: title, content: content, isPrivate: isPrivate})
        alert("Post created successfully!");
    } catch (error) {
        console.log(error);
    }
}

async function updatePost(title, content, isPrivate, postId){
    try {
        await putData(`posts/${postId}`, {title: title, content: content, isPrivate: isPrivate, userID: user.id, password: user.password})
        alert("Post updated successfully!");
    } catch (error) {
        console.log(error);
    }
}

async function deletePost(postId){
    try {
        await deleteData(`posts/${postId}`, {userID: user.id, password: user.password})
        alert("Post deleted successfully!");
    } catch (error) {
        console.log(error);
    }
}


createLogInSignUpForm();

