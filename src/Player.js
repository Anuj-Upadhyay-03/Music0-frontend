import Playlist from "react-mp3-player";
const Player=()=>{
    const tracks = [{ img: 'https://icon-library.net/images/music-icon-transparent/music-icon-transparent-11.jpg', name:'MP3', desc: 'Description 1', src:'Audio.mp3'},
        { img: 'https://icon-library.net/images/music-icon-transparent/music-icon-transparent-11.jpg', name:'MP3 #2', desc: 'Description 2', src:'Audio2.mp3'}]
    const playlistOverideStylingOpts = {
        offset : {
            left : 0,
            "backgroundColor": "#0d0d0d",
            opacity: 0.9,
            "color": "#50f2f2"
        },

    };
    return(
        <Playlist tracks={tracks} opts={playlistOverideStylingOpts}/>
    );
}
export default Player;