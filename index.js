const song = document.getElementById("song")
const song_box = document.getElementsByClassName("song-card")
const songinfo = document.getElementsByClassName("song-bar-info")
const play_button = document.getElementById("play-button")
const pause_button = document.getElementById("pause-button")
const progress_bar = document.getElementById("progress")
const duration = document.getElementById("song-duration")
const next_song_button = document.getElementById("next-song")
const prev_song_button = document.getElementById("prev-song")
let selectedFolder = "songs";
let timeout_id = null;
let autoplay_id = null;
let songs_link = [];
let songs_data = []
let duration_id = null;
let audio = new Audio
//fetching song on basis of album clicked 
const album = document.querySelectorAll(".album-card-image").forEach(album => {
    album.addEventListener("click", () => {
        selectedFolder = album.dataset.folder;
        console.log("album clicked ", selectedFolder)
        startApp();
    })
})
const album2 = document.querySelectorAll(".artist").forEach(album => {
    album.addEventListener("click", () => {
        selectedFolder = album.dataset.folder;
        console.log("album clicked ", selectedFolder)
        startApp();
    })
})
//getting songs fom the local machine
async function getsongs() {
    let a = await fetch(`song/${selectedFolder}`)
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let link = div.getElementsByTagName("a");
    for (let i = 1; i < link.length; i++) {
        const element = link[i];
        if (element.href.endsWith(".mp3")) {
            songs_data.push(element.href.split(`/${selectedFolder}/`)[1])
            songs_link.push(element.href)
        }
    }
    // for (const songs of songs_link) {
    //     console.log("test at 68", songs);
    // }
    return { songs_data, songs_link }

}


//loding songs on the page
async function displaySongs() {

    const data = await getsongs()
    songs_data = data.songs_data
    songs_link = data.songs_link

    // console.log(songs_link);

    songs_data.forEach((songs, i) => {
        const songArtist = songs.split("@")[1]
        // console.log("Song artist 66 =", songArtist)
        const songName = songs.split("@")[0]
        // console.log("Song Name 68  ", songName)
        let url = "logo/musiclogo.svg"
        song_box[0].innerHTML += `   <div class="songs-box" data-index=${i}>
                                    <div >
                                    <img src="${url}" alt="" srcset="">
                                    </div>
                                    <div>
                                    <p class="song-card-info-artist">${songArtist.replaceAll("%20", " ").replaceAll(".mp3", "")}</p>
                                    <p class="song-name">${songName.replaceAll("%20", " ")}</p>
                                    </div>
                                    </div>`
    });


}
let index = 0;
let singer, music;
async function boxEventlistner(e) {
    const box = e.currentTarget;
    index = parseInt(box.getAttribute("data-index"))//giving indexing to song card
    singer = box.getElementsByClassName("song-card-info-artist")[0].textContent
    music = box.getElementsByClassName("song-name")[0].textContent
    console.log("singer list", singer, music)
    songinfo[0].innerHTML = `<h3>${singer}<br/>${music}</h3>`
    console.log("song card clicked ", index);
    await audiopause()
    console.log("pause at 103")
    audio = new Audio(songs_link[index])
    await audioplay()
    console.log("play at 106")
    play_button.style.display = "none"
    pause_button.style.display = "inline"
}

//----------------------------------------------------------------------------------------------




function getNames() {
    console.log((index));
    singer = document.getElementsByClassName("song-card-info-artist")[index].textContent
    music = document.getElementsByClassName("song-name")[index].textContent
    songinfo[0].innerHTML = `<h3>${singer}<br/>${music}</h3>`
}


async function handlePlayClick() {
    console.log("play clicked");
    getNames();
    await audioplay();
}

async function handlePauseClick() {
    if (!audio.paused) {
        await audiopause();
    }
}

async function handleNextClick() {
    console.log("next clicked");
    await musicControllNext();
}

async function handlePrevClick() {
    console.log("previous clicked");
    await musicControllPrev();
}




async function musicControllNext() {
    try {
        if (audio) {
            audio.pause(); // Don't await to avoid play-pause collision
            audio.src = ""; // Unload current audio
        }
        progress_bar.value = 0;
        clearTimeout(timeout_id);
        clearInterval(duration_id);
        index = (index + 1) % songs_link.length;
        getNames();
        audio = new Audio(songs_link[index]);
        songcontroll()
        await audioplay();
        play_button.style.display = "none";
        pause_button.style.display = "inline";
    } catch (err) {
        console.error("Error in musicControllNext:", err);
    }
}
async function musicControllPrev() {
    try {
        if (audio) {
            audio.pause();
            audio.src = "";
        }
        progress_bar.value = 0;
        console.log("pause at 139")
        clearInterval(duration_id);
        clearTimeout(timeout_id);
        index = (index - 1 + songs_link.length) % songs_link.length;
        getNames()
        audio = new Audio(songs_link[index])
        songcontroll()
        await audioplay()
    }
    catch (err) {
        console.error("Error in musicControllNext:", err);
    }


}
function audiopause() {
    audio.pause();
    clearTimeout(autoplay_id)
    clearTimeout(timeout_id)
    console.log("pause clicked");
    play_button.style.display = "inline";
    pause_button.style.display = "none";
}
//-------------------------------------------------------------
let autoplay_time;
async function audioplay() {
    try {
        if (!audio) return;
        play_button.style.display = "none";
        pause_button.style.display = "inline";
        await audio.play();
        setTimeout(() => {//add a delay to give time to play 
            autoplay_time = Math.round((audio.duration - audio.currentTime) * 1000)
            console.log("play at audioplay() autoplay time ", autoplay_time);
            autoplay(autoplay_time);//transfer controll to auto play 
        }, 2000)

    } catch (err) {
        console.error("Error in audioplay:", err);
    }
}
async function autoplay(time) {
    console.log("hello inside autoplay")
    if (audiocheck()) {
        autoplay_id = setTimeout(() => {
            musicControllNext()
            console.log("time out set at ", time)
        }, time);
    }
}
function audiocheck() {
    if (!audio.paused && !audio.ended && audio.currentTime > 0) {
        console.log("Audio is playing");
        return true;
    } else {
        console.log("Audio is NOT playing");
        return false;
    }
}

function songcontroll() {
    audio.onloadedmetadata = () => {
        progress_bar.max = audio.duration;
        //logic of progress bar
        if (duration_id) clearTimeout(duration_id)
        duration_id = setInterval(() => {
            progress_bar.value = audio.currentTime;
            duration.innerHTML = formatTime(audio.currentTime);
        }, 1000);

    }
}
//time formating 
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    return `${mins}:${second < 10 ? '0' + second : second}`
}
//-----------------------------------------------------------------------------------------------------------------------------------

function main() {
    if (songs_link.length > 0) {
        audio = new Audio(songs_link[0]);
        songcontroll();
    }
    document.querySelectorAll(".songs-box").forEach(box => {
        box.addEventListener("click", boxEventlistner)
    })
    progress_bar.addEventListener("input", () => {
        if (timeout_id) clearTimeout(timeout_id);
        if (autoplay_id) clearTimeout(autoplay_id);
        audio.currentTime = progress_bar.value;
        let timeout = (audio.duration - progress_bar.value);
        console.log("subtracted value ", timeout);
        timeout = Math.round(timeout * 1000);
        console.log("progress bar value = ", timeout);
        timeout_id = setTimeout(() => {
            musicControllNext()
            nextsong = true;
        }, timeout);
    })
}




async function startApp() {
    clearTimeout(timeout_id);
    clearTimeout(autoplay_id);
    clearInterval(duration_id);
    document.querySelectorAll(".songs-box").forEach(box => {
        box.removeEventListener("click", boxEventlistner)
    })
    songs_data = [];
    songs_link = [];
    song_box[0].innerHTML = "";
    await audio.pause();
    play_button.style.display = "inline";
    pause_button.style.display = "none";
    await displaySongs(); // fetch & display fresh
    main(); // attach listeners to new song elements
}



//initial content loading
document.addEventListener("DOMContentLoaded", () => {
    play_button.addEventListener("click", handlePlayClick);
    pause_button.addEventListener("click", handlePauseClick);
    next_song_button.addEventListener("click", handleNextClick);
    prev_song_button.addEventListener("click", handlePrevClick);

    startApp();
});
