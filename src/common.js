export const ACCESS_TOKEN='ACCESSTOKEN'
export const TOKEN_TYPE='TOKENTYPE'
export const EXPIRES_IN='EXPIRESIN'

const APP_URL= import.meta.env.VITE_APP_URL
export const ENDPOINT={
    userInfo:"/me",
    featuredPlaylists:"/browse/featured-playlists?limit=5",
    toplist:"/browse/categories/toplists/playlists?limit=10",
    playlist:"/playlists"
}

export const logout=()=>{
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_TYPE)
    localStorage.removeItem(EXPIRES_IN)
    window.location.href='${APP_URL}'
}

export const SECTIONTYPE={
    DASHBOARD:"DASHBOARB",
    PLAYLIST:"PLAYLIST",

}
