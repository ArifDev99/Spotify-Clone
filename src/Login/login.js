import { ACCESS_TOKEN } from "../common";
import { TOKEN_TYPE } from "../common";
import { EXPIRES_IN } from "../common";

const APP_URL= import.meta.env.VITE_APP_URL

// var client_id = 'bbd15d7650d04cf8ad828930833eb29a';
var client_id = import.meta.env.VITE_CLIENT_ID;

// var redirect_uri = 'http://localhost:3000/Login/login.html';
var redirect_uri = import.meta.env.VITE_REDIRECT_URI;
var scope = 'user-read-private user-read-email playlist-read-private user-top-read user-library-read';
// var state = generateRandomString(16);

// localStorage.setItem(stateKey, state);
const authorize= ()=>{
    console.log("authorize function")

    const url=`https://accounts.spotify.com/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&response_type=token&show_dailog=true`;
    window.open(url,'login','width=800px, height=600px')
}

document.addEventListener('DOMContentLoaded',()=>{
    let loginbutton=document.getElementById('login-to-spotify');
    loginbutton.addEventListener('click',authorize);
})

window.setItemsInLocalStorage =(AccessToken,tokenType,expiresIn)=>{
    localStorage.setItem(ACCESS_TOKEN,AccessToken)
    localStorage.setItem(TOKEN_TYPE,tokenType)
    localStorage.setItem(EXPIRES_IN,(Date.now()+(expiresIn*1000)))
}

window.addEventListener('load',()=>{
    console.log("inside login window")
    const Access_Token_key=localStorage.getItem(ACCESS_TOKEN)
    if(Access_Token_key){
        window.location.href=`${APP_URL}/Dashboard/dashboard.html`
    }
    if(window.opener && !window.opener.closed){
        window.focus();
        if(window.location.href.includes("error")){
            window.close();
        }
        
        const hash=window.location.hash
        const searchParams=new URLSearchParams(hash)
        
        const AccessToken=searchParams.get('#access_token')
        console.log(AccessToken)
        
        const expiresIn=searchParams.get('expires_in')
        const tokenType=searchParams.get('token_type')
        if(AccessToken){
            window.close();
            window.setItemsInLocalStorage(AccessToken,tokenType,expiresIn)
            window.opener.location.href=`${APP_URL}`
        }
    }
    
})

