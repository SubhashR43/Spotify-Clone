//Access for html tags for javascript palyer

const audioPlayer = document.querySelector("#audioPlayer");

const playBtn = document.querySelector(".playBtn");
const nextBtn = document.querySelector(".nextBtn");
const prevBtn = document.querySelector(".prevBtn");

const songImage = document.querySelector(".songImage");
const songTitle = document.querySelector(".songTitle");
const songArtist = document.querySelector(".songArtist");

const currTime = document.querySelector(".currentTime");
const duraTime = document.querySelector(".duration");
const seekBar = document.querySelector(".seek");
const seekBarContainer = document.querySelector(".seekContainer");

const songsContainer = document.querySelector("#songsContainer");
const artistContainer = document.querySelector("#artistContainer");
const albumContainer = document.querySelector("#albumContainer");

let url =
  "https://itunes.apple.com/search?term=punjabi&country=in&media=music&entity=song&limit=200";

let songs = [];

let currentSong = 0;

let isPlaying = false;

// Fetch API for song list
async function getdata() {
  try {
    let response = await fetch(url);
    let songData = await response.json();
    songs = songData.results.filter((song) => song.previewUrl);

    renderSongs();

    renderLibrarySong();

    if (songs.length > 0) {
      loadSong(currentSong);
    }
  } catch (error) {
    console.log("Error", error);
  }
}

//Render Songs in playlist library
function renderLibrarySong() {
  const songList = document.querySelector("#songList");

  songList.innerHTML = "";
  songs.forEach((song, index) => {
    songList.innerHTML += `<div
                    class="song-card d-flex align-items-center p-1 m-2 rounded-3" onclick="playselectedSong(${index})" style="cursor:pointer;"
                  >
                    <img class="songImage" src="${song.artworkUrl100}" alt="Image" />
                    <div class="song-detail">
                      <h6 class="songTitle">${song.trackName}</h6>
                      <p class="songArtist" class="text-secondary">${song.artistName}</p>
                    </div>
                  </div>`;
  });
}

// Render songs into carousel
function renderSongs() {
  // let firstContainer = songsContainer[0];

  songsContainer.innerHTML = "";

  // for each 5 slide card song
  for (let i = 0; i < songs.length; i += 5) {
    let activeClass = i === 0 ? "active" : "";
    let slideSongs = songs.slice(i, i + 5);
    let cardHTML = slideSongs
      .map((song, index) => {
        let realIndex = i + index;
        return `<div class="carousel-card p-2 rounded-3" onclick = "playselectedSong(${realIndex})">
             
             <img src="${song.artworkUrl100}" alt="Image"/>
             <h6>${song.trackName}</h6>
             <p>${song.artistName}</p>
             </div>
             `;
      })
      .join("");

    songsContainer.innerHTML += `<div class="carousel-item ${activeClass}">
        <div class="d-flex justify-content-center flex-wrap gap-2 mx-4">
        ${cardHTML}
        </div>
        </div>`;
  }

  // Second carousel artist
  artistContainer.innerHTML = "";

  let uniqueArtists = [];
  let artistNames = new Set();

  songs.forEach((song) => {
    if (!artistNames.has(song.artistName)) {
      artistNames.add(song.artistName);
      uniqueArtists.push(song);
    }
  });

  // for each 5 slide card song
  for (let i = 0; i < uniqueArtists.length; i += 5) {
    let activeClass = i === 0 ? "active" : "";
    let slideArtists = uniqueArtists.slice(i, i + 5);
    let cardHTML = slideArtists
      .map((artist) => {
        let songIndex = songs.findIndex(
          (song) => song.trackId === artist.trackId,
        );

        return `<div class="carousel-card p-2 rounded-3 text-center" onclick = "playselectedSong(${songIndex})">
             
             <img src="${artist.artworkUrl100}" class="img-2" alt="Image"/>
             <h6>${artist.artistName}</h6>
             <p></p>
             </div>
             `;
      })
      .join("");

    artistContainer.innerHTML += `<div class="carousel-item ${activeClass}">
        <div class="d-flex justify-content-center flex-wrap gap-2 mx-4">
        ${cardHTML}
        </div>
        </div>`;
  }

  // Third carousel Album
  albumContainer.innerHTML = "";

  let uniqueAlbums = [];
  let albumNames = new Set();

  songs.forEach((song) => {
    if (!albumNames.has(song.collectionName)) {
      albumNames.add(song.collectionName);
      uniqueAlbums.push(song);
    }
  });

  // for each 5 slide card song
  for (let i = 0; i < uniqueAlbums.length; i += 5) {
    let activeClass = i === 0 ? "active" : "";
    let slideAlbums = uniqueAlbums.slice(i, i + 5);
    let cardHTML = slideAlbums
      .map((album) => {
        let songIndex = songs.findIndex(
          (song) => song.trackId === album.trackId,
        );
        return `<div class="carousel-card p-2 rounded-3" onclick = "playselectedSong(${songIndex})">
             
             <img src="${album.artworkUrl100}" class="img-2" alt="Image"/>
             <h6>${album.collectionName}</h6>
             <p>${album.artistName}</p>
             </div>
             `;
      })
      .join("");

    albumContainer.innerHTML += `<div class="carousel-item ${activeClass}">
        <div class="d-flex justify-content-center flex-wrap gap-2 mx-4">
        ${cardHTML}
        </div>
        </div>`;
  }
}

// Play song when slect an song,artist,album
function playselectedSong(index) {
  currentSong = index;
  loadSong(index);
  playSong(index);

  audioPlayer
    .play()
    .then(() => {
      isPlaying = true;
      playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    })
    .catch((error) => {
      console.log("Play Error", error);
    });
}

// Song Card Loading JavaScript
function loadSong(index) {
  let song = songs[index];

  if (!song) {
    console.log("Song not found");

    return;
  }

  songImage.src = song.artworkUrl100;
  songTitle.innerText = song.trackName;
  songArtist.innerText = song.artistName;
  if (song.previewUrl) {
    audioPlayer.src = song.previewUrl;
  } else {
    alert("preview song is not available");
  }

  console.log(song.preview);
}

// Seek Bar JavaScript
// Time format funtion
function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${minutes}:${seconds}`;
}

// update time format with song
audioPlayer.addEventListener("timeupdate", () => {
  let current = audioPlayer.currentTime;
  let duration = audioPlayer.duration;

  if (!duration) return;

  //Show timimng
  currTime.innerHTML = formatTime(current);
  duraTime.innerHTML = formatTime(duration);

  // seek Bar width
  let progress = (current / duration) * 100;
  seekBar.style.width = `${progress}%`;
});

// Seek song with click
seekBarContainer.addEventListener("click", (e) => {
  let width = seekBarContainer.clientWidth;
  let clickX = e.offsetX;
  let durat = audioPlayer.duration;
  audioPlayer.currentTime = (clickX / width) * durat;
});

//Play and Pause control of song
playBtn.addEventListener("click", async () => {
  if (!audioPlayer.src) {
    alert("No audio Available");
    return;
  }

  try {
    if (!isPlaying) {
      await audioPlayer.play();
      isPlaying = true;
      playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } else {
      audioPlayer.pause();
      isPlaying = false;
      playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
  } catch (error) {
    console.log("Play Error", error);
  }
});

// Next song
nextBtn.addEventListener("click", async () => {
  currentSong++;
  if (currentSong >= songs.length) {
    currentSong = 0;
  }
  loadSong(currentSong);

  let nextIndex = currentSong + 1;
  if (nextIndex >= songs.length) {
    nextIndex = 0;
  }
  playSong(nextIndex);

  if (audioPlayer.src) {
    try {
      await audioPlayer.play();
      isPlaying = true;
      playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } catch (error) {
      console.log("Audio Error", error);
    }
  }
});

// Previous song
prevBtn.addEventListener("click", async () => {
  currentSong--;
  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }
  loadSong(currentSong);

  let prevIndex = currentSong - 1;
  if (prevIndex < 0) {
    prevIndex = songs.length - 1;
  }
  playSong(prevIndex);

  if (audioPlayer.src) {
    try {
      await audioPlayer.play();
      isPlaying = true;
      playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } catch (error) {
      console.log("Audio Error", error);
    }
  }
});

audioPlayer.addEventListener("ended", () => {
  let nextIndex = currentSong + 1;
  if (nextIndex >= songs.length) {
    nextIndex = 0;
  }
  playSong(nextIndex);
});

async function playSong(index) {
  currentSong = index;

  loadSong(currentSong);

  try {
    await audioPlayer.play();

    isPlaying = true;
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  } catch (error) {
    console.log("Audio Error", error);
  }
}

getdata();
