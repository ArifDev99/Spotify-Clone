const APP_URL=import.meta.env.VITE_APP_URL

document.addEventListener('DOMContentLoaded',()=>{

  if(localStorage.getItem('ACCESSTOKEN')){
    window.location.href=`${APP_URL}/Dashboard/dashboard.html`
  }
  else{
    window.location.href=`${APP_URL}/Login/login.html` 
  }
})
