import {fetchRequest} from '../api.js';
import {logout,SECTIONTYPE} from '../common.js';
// import { createAPIConfig } from '../api.js';
// import { getAccessToken } from '../api.js';

import {ENDPOINT} from "../common.js"

const onProfileClick = (event) => {
    event.stopPropagation();
    const profileMenu = document.querySelector('#profile-menu')
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector('li#logout').addEventListener('click', logout)
    }
}

const loadUserProfile = async () => {
    const profileBtn = document.querySelector("#Profile-btn")
    const defaultImage = document.querySelector("#Profile-icon")
    const displayName = document.querySelector("#display-name")
    const {
        display_name: displayname,
        images
    } = await fetchRequest(ENDPOINT.userInfo);
    console.log({
        displayname
    })
    if (images ?.length) {
        defaultImage.classList.add("hidden");
    } else {
        defaultImage.classList.remove("hidden")
    }
    profileBtn.addEventListener('click', onProfileClick)
    displayName.textContent = displayname
}

const onPlaylistItemsClick = (event) => {
    const Id=event.target.id
    const section = {
        type: SECTIONTYPE.PLAYLIST,
        playlistid:Id
    }
    history.pushState(section, "", `playlist/${Id}`)
    loadSection(section);
}



const fillPlaylistsitems = () => {
    const pageContent = document.querySelector("#page-content")
    const playlistmap = new Map([
        ["featued", "featured-playlist-items"],
        ["top list", "featured-topplaylist"]
    ])
    let innerHTML = ``;
    for (let [type, id] of playlistmap) {
        innerHTML += `<article class="p-4">
        <h1 class="text-2xl mb-1 font-bold capitalize">${type}</h1>
        <section class="freatured-songs grid grid-cols-auto-fill-cards gap-4 hover:cursor-pointer" id="${id}">
        
        </section></article>`
    }
    pageContent.innerHTML = innerHTML;
}

const FormatTime=(duration)=>{
    const min=Math.floor(duration/60_000);
    const sec=((duration %6000)/1000).toFixed(0)
    const formatedTime= sec==60? (min+1) + ":00" :min + ":"+(sec<10?"0":"")+ sec;
    return formatedTime
}



const loadtracksOfPlaylist=({tracks})=>{
    const tracksSection=document.querySelector("#tracks")


    let tracksNo=1
    for(let trackItem of tracks.items){
        let {artists,name,album,duration_ms}=trackItem.track
        let image=album.images.find(image=>image.height===64);
        let track=document.createElement("section")
        track.className="tracks px-2 py-2 grid grid-cols-[50px_2fr_1fr_1fr_50px] items-center justify-items-start rounded-md hover:bg-black-gray cursor-pointer";
        track.innerHTML=`<p>${tracksNo++}</p>
        <section class="grid grid-cols-[auto_1fr] place-items-center gap-2 px-1">
            <img  class="h-8 w-8" src="${image.url}" alt="${name}" srcset="">
            <article class="flex flex-col gap-1">
                <h2 class="text">${name}</h2>
                <h3 class="text-sm opacity-50">${Array.from(artists,artist=>artist.name).join(", ")}</h3>
            </article>
        </section>
        <p class="text-sm px-1 opacity-50">${album.name}</p>
        <p class="opacity-50">12 days ago</p>
        <p class="opacity-50">${FormatTime(duration_ms)}</p>`
        
        tracksSection.appendChild(track);
    }
}

const fillContentOfPlaylists= async(playlistid)=>{
    const playlistItems = await fetchRequest(`${ENDPOINT.playlist}/${playlistid}`);
    const pageContent = document.querySelector("#page-content");
    const pageHeadings = document.querySelector("#Headings");
    pageHeadings.textContent=playlistItems.name
    pageContent.innerHTML =` <header class="p-2">
    <nav>
        <ul class="grid grid-cols-[50px_2fr_1fr_1fr_50px]">
            <li>#</li>
            <li>TITLE</li>
            <li>ALBUM</li>
            <li>DATE ADDED</li>
            <li>🕓</li>
        </ul>
    </nav>
    </header>
    <section id="tracks">
    </section>`;
        //     <section class="grid grid-cols-[50px_2fr_1fr_1fr_50px] items-center justify-items-start rounded-md hover:bg-black-light">
        //     <p>1</p>
        //     <section class="grid grid-cols-2 gap-2">
        //         <img  class="h-8 w-8" src="h-8 w-8" alt="" srcset="">
        //         <article class="flex flex-col gap-1">
        //             <h2 class="text">songs</h2>
        //             <h3 class="text-sm ">artists</h3>
        //         </article>
        //     </section>
        //     <p>album</p>
        //     <p>12 days ago</p>
        //     <p>1.36</p>
        // </section>
    console.log(playlistItems);
    loadtracksOfPlaylist(playlistItems);

}


const loadFeaturedPlaylists = async (endpoint, Id) => {
    const {
        playlists: {
            items
        }
    } = await fetchRequest(endpoint);
    var playlistItemsSections = document.querySelector(Id)


    items.map(function(item){
        const playlistItems = document.createElement("section")
        playlistItems.className = "p-4 bg-black-light rounded hover:bg-black-gray"
        playlistItems.id = item.id
        playlistItems.setAttribute("data-type", "playlist")
        playlistItems.addEventListener("click",onPlaylistItemsClick)
        const imageUrl = item.images[0].url;
        playlistItems.innerHTML = `<img  class="rounded mb-2" src="${imageUrl}" alt="fratured" srcset="">
        <h2 class="text-base font-semibold mb-4 truncate">${item.name}</h2>
        <h3 class="text-sm opacity-50 line-clamp-2">${item.description}</h3>`
        playlistItemsSections.appendChild(playlistItems)
      
    })
    



    // for (let {
    //         name,
    //         description,
    //         images,
    //         id
    //     } of items) {
    //     const playlistItems = document.createElement("section")
    //     playlistItems.addEventListener("click", onPlaylistItemsClick('click',id))
    //     playlistItems.className = "p-4 bg-black-light rounded hover:bg-black-gray"
    //     console.log(id)
    //     playlistItems.id = id
    //     playlistItems.setAttribute("data-type", "playlist")

    //     const imageUrl = images[0].url;
    //     playlistItems.innerHTML = `<img  class="rounded mb-2" src="${imageUrl}" alt="fratured" srcset="">
    //     <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
    //     <h3 class="text-sm opacity-50 line-clamp-2">${description}</h3>`
    //     playlistItemsSections.appendChild(playlistItems)
    // }

}

const loadPlaylists = () => {
    loadFeaturedPlaylists(ENDPOINT.featuredPlaylists, "#featured-playlist-items");
    loadFeaturedPlaylists(ENDPOINT.toplist, "#featured-topplaylist");
}


const loadSection = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD) {
        fillPlaylistsitems();
        loadPlaylists();
    } else if(section.type===SECTIONTYPE.PLAYLIST) {
        // load the element of playlist
        fillContentOfPlaylists(section.playlistid)
    }

}

document.addEventListener('DOMContentLoaded', () => {


    loadUserProfile();
    const section = {
        type: SECTIONTYPE.DASHBOARD
    }
    history.pushState(section, "", "")
    loadSection(section)
    // fillContentOfPlaylists();
    // loadPlaylists()

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector('#profile-menu')
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden")
        }
    })

    // for scroll 
    document.querySelector(".content").addEventListener("scroll", (event) => {
        const header = document.querySelector(".header");
        if (event.target.scrollTop >= header.offsetHeight) {
            header.classList.add("sticky", "top-0", "bg-black-highlight")
            header.classList.remove("bg-transparent");
        } else {
            header.classList.remove("sticky", "top-0", "bg-black-highlight")
            header.classList.add("bg-transparent");

        }
    })

    window.addEventListener("popstate", (event) => {
        console.log(event)
    })


})