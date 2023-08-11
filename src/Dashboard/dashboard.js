import {fetchRequest} from '../api.js';
import {logout,SECTIONTYPE} from '../common.js';
import { gsap } from 'gsap';
import { Expo } from 'gsap';
// import { createAPIConfig } from '../api.js';
// import { getAccessToken } from '../api.js';

const audio = new Audio();

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

const onPlaylistItemsClick = (event,id) => {
    // console.log(event.target);
    const Id=id
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

const onTrackSelection= (id,event)=>{
    console.log(id);
    
    document.querySelectorAll("#tracks .track").forEach(trackItem=>{
        const playButton = trackItem.querySelector("button.play");
        const trackNumber = trackItem.querySelector("span.track-no");
        
        if (trackItem.id === id) {
            trackItem.classList.add("bg-black-gray","text-green", "selected");
            if (playButton) {
                playButton.classList.remove("invisible")
            }
            if (trackNumber) {
                trackNumber.classList.add("invisible");
            }
        } else {
            trackItem.classList.remove("bg-black-gray","text-green", "selected");
            if (playButton) {
                playButton.classList.add("invisible")
            }
            if (trackNumber) {
                trackNumber.classList.remove("invisible");
            }
        }
    })
}


const loadtracksOfPlaylist=({tracks})=>{
    const tracksSection=document.querySelector("#tracks")

    let loadedTrack=[];
    let tracksNo=1
    for(let trackItem of tracks.items.filter(item=>item.track.preview_url)){
        let {artists,name,album,duration_ms:duration,preview_url:previewUrl,id}=trackItem.track
        let image=album.images.find(image=>image.height===64);
        let artistNames=Array.from(artists,artist=>artist.name).join(", ")
        let track=document.createElement("section")
        track.id=id;
        track.className=" group track px-2 py-2 grid grid-cols-[50px_2fr_1fr_1fr_50px] items-center justify-items-start rounded-md hover:bg-gray cursor-pointer";
        track.innerHTML=`<p class="relative w-full flex items-center justify-center justify-self-center"><span class="track-no group-hover:invisible">${tracksNo++}</span></p>
        <section class="grid grid-cols-[auto_1fr] place-items-center gap-2 px-1">
            <img  class="h-8 w-8" src="${image.url}" alt="${name}" srcset="">
            <article class="flex flex-col gap-1">
                <h2 class="text line-clamp-1">${name}</h2>
                <h3 class="text-sm opacity-50 line-clamp-1">${artistNames}</h3>
            </article>
        </section>
        <p class="text-sm px-1 opacity-50 line-clamp-1">${album.name}</p>
        <p class="text-sm opacity-50 line-clamp-1">12 days ago</p>
        <p class="text-sm opacity-50 line-clamp-1">${FormatTime(duration)}</p>`

        track.addEventListener("click",(event)=>playTrack(event,{image,artistNames,name,duration,previewUrl,id}))
        track.addEventListener("click",(event)=>onTrackSelection(id,event));


        const playButton = document.createElement("button");
        playButton.id = `play-track-${id}`;
        playButton.className = `play w-full absolute left-0 text-2xl invisible group-hover:visible  material-symbols-outlined`;
        playButton.textContent = "play_arrow";
        // playButton.addEventListener("click", (event) => playTrack(event, { image, artistNames, name, duration, previewUrl, id }))
        track.querySelector("p").appendChild(playButton);
        tracksSection.appendChild(track);
        loadedTrack.push({id, artists, name, album, duration, previewUrl, artistNames, image})
    }
    localStorage.setItem("LOADED_TRACKS",JSON.stringify(loadedTrack))
}

const onAudioMetadataLoaded = () => {
    const totalSongDuration = document.querySelector("#total-song-duration");
    totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`;
}

const updateIconsForPauseMode = () => {
    const playButton = document.querySelector("#play");

    playButton.querySelector("span").textContent = "play_circle";
    
}

const updateIconsForPlayMode = () => {
    const playButton = document.querySelector("#play");

    playButton.querySelector("span").textContent = "pause_circle";
}
const playTrack=(event,{image,artistNames,name,duration,previewUrl,id})=>{
    console.log({image,artistNames,name,duration,previewUrl,id})
    // document.querySelector("#now-playing-image").src=image.url
    // document.querySelector("#now-playing-song").textContent=name
    // document.querySelector("#now-playing-artists").textContent=artistNames
    if (audio.src === previewUrl) {
        toggleplaybtn();
    } else {

        setNowPlayingInfo({ image, id, name, artistNames });
        audio.src = previewUrl;
        audio.play();
    }

}

const setNowPlayingInfo = ({ image, id, name, artistNames }) => {
    const audioControl = document.querySelector("#audio-control");
    const songTitle = document.querySelector("#now-playing-song");
    const nowPlayingSongImage = document.querySelector("#now-playing-image");
    const artists = document.querySelector("#now-playing-artists");
    const songInfo = document.querySelector("#song-info");

    nowPlayingSongImage.src = image.url;
    audioControl.setAttribute("data-track-id", id);
    songTitle.textContent = name;
    artists.textContent = artistNames;
    onTrackSelection(id);
    songInfo.classList.remove("invisible");
}

const findCurrentTrack = () => {
    const audioControl = document.querySelector("#audio-control");
    const trackId = audioControl.getAttribute("data-track-id");
    if (trackId) {
        const loadedTracks = JSON.parse(localStorage.getItem("LOADED_TRACKS"));
        const currentTrackIndex = loadedTracks?.findIndex(track => track.id === trackId);
        return { currentTrackIndex, tracks: loadedTracks };


    }
    return null;
}

const playPrevTrack=()=>{
    const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {};
    if (currentTrackIndex > 0) {
        const prevTrack = tracks[currentTrackIndex - 1];
        playTrack(null, prevTrack);
    }
}

const playNextTrack=()=>{
    const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {};
    if (currentTrackIndex > -1 && currentTrackIndex < tracks?.length - 1) {
        const currentTrack = tracks[currentTrackIndex + 1];
        playTrack(null, currentTrack);
    }

}

const fillContentOfPlaylists= async(playlistid)=>{
    const playlistItems = await fetchRequest(`${ENDPOINT.playlist}/${playlistid}`);
    
    
    console.log(playlistItems);
    const { name, description, images, tracks } = playlistItems;
    const coverElement = document.querySelector("#cover-content");
    coverElement.innerHTML = `
    <div class="flex gap-2">
        <img  class="object-contain h-48 w-48 rounded-md" src="${images[0].url}" alt="${name}" />
        <section class="flex flex-col justify-center">
        <h2 id="playlist-name" class="text-5xl font-bold">${name}</h2>
        <p id="playlist-details" class="text-2xl">${description} songs</p>
        <p id="playlist-details" class="text-base">${tracks.items.length} songs</p>
        </section>
        </div>
        `
        
        // const pageHeadings = document.querySelector("#Headings");
        // pageHeadings.textContent=playlistItems.name
    const pageContent = document.querySelector("#page-content");
    pageContent.innerHTML =` <header class="p-2">
    <nav>
        <ul class="grid grid-cols-[50px_2fr_1fr_1fr_50px]">
            <li class="justify-self-center">#</li>
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
        playlistItems.addEventListener("click", (event)=>onPlaylistItemsClick(event,item.id));
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

function toggleplaybtn(){
    if (audio.src) {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }
}

function audioSectionAnim(){
    var tl = gsap.timeline();
    tl.to(".audio-items",{
        y:'0',
        duration:2,
        delay:0,
        ease:Expo.easeInOut
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const volume = document.querySelector("#volume");
    const playButton = document.querySelector("#play");
    const nextTrack = document.querySelector("#next");
    const prevTrack = document.querySelector("#prev");
    const songDurationCompleted = document.querySelector("#song-duration-completed");
    const songProgress = document.querySelector("#progress");
    const timeline = document.querySelector("#timeline");
    const audioControl = document.querySelector("#audio-control");
    audioSectionAnim();
    let progressInterval;
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

    // play music
    audio.addEventListener("loadedmetadata", onAudioMetadataLoaded);
    audio.addEventListener("play",()=>{
        progressInterval=setInterval(()=>{
            if(audio.paused){
                return
            }
            songDurationCompleted.textContent=`${audio.currentTime.toFixed(0)<10 ? "0:0"+audio.currentTime.toFixed(0) : "0:"+audio.currentTime.toFixed(0)}`;
            songProgress.style.width=`${(audio.currentTime/audio.duration)*100}%`;
        },100)
        updateIconsForPlayMode();
    })

    audio.addEventListener("pause", () => {
        if (progressInterval) {
            clearInterval();
        }
        // const selectedTrackId = audioControl.getAttribute("data-track-id");
        updateIconsForPauseMode();
    })
    prevTrack.addEventListener("click", playPrevTrack);
    nextTrack.addEventListener("click", playNextTrack)
    
    volume.addEventListener("change",()=>{
        audio.volume=volume.value / 100;
    })
    
    playButton.addEventListener("click", toggleplaybtn);
    

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
        loadSection(event.state);
    })


})