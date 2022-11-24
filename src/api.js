const BASE_API_URL = import.meta.env.VITE_API_BASE_URL
export const ACCESS_TOKEN='ACCESSTOKEN'
export const TOKEN_TYPE='TOKENTYPE'
export const EXPIRES_IN='EXPIRESIN'
import { logout } from "./common"


const getAccessToken=()=>{
    const accessToken= localStorage.getItem(ACCESS_TOKEN)
    const tokenType= localStorage.getItem(TOKEN_TYPE)
    const ExpireIn= localStorage.getItem(EXPIRES_IN)
    if(Date.now()<ExpireIn){
        return({accessToken,tokenType})

    }else{
        logout();
    }

}
const createAPIConfig=({accessToken,tokenType}, method="GET")=>{
    return {
        headers:{
            Authorization:`${tokenType} ${accessToken}`
        },
        method
    }
}

export const fetchRequest=async(endpoint)=>{
    const url=`${BASE_API_URL}${endpoint}`
    const result=await fetch(url,createAPIConfig(getAccessToken()));
    return result.json();
}