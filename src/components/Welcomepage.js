//Author: Fenil Shah
//Created on: 21st June,2021
import React, {useEffect, useState,useRef} from "react";
import {NavigationBar} from "../Navigation";
import { useHistory } from "react-router";
import Playlist from "react-mp3-player";
import '../css/Welcomepage.css';
import TableWithPagination from "./TableWithPagination";
import cookie from "react-cookies";

const Welcome = () =>{
    // const tracks = [{ img: 'https://icon-library.net/images/music-icon-transparent/music-icon-transparent-11.jpg', name:'MP3', desc: 'Description 1', src:'Audio.mp3'},
    //     { img: 'https://icon-library.net/images/music-icon-transparent/music-icon-transparent-11.jpg', name:'MP3 #2', desc: 'Description 2', src:'Audio2.mp3'}]
    const playlistOverideStylingOpts = {
        offset : {
            left : 0,
            "background-color": "black",
            opacity: 0.9,
            "color": "#50f2f2",
        },

    };

    const [playingTracks,setPlayingTracks] = useState([]);
    const [userId,setUserId] = useState(cookie.load('userId'));
    const history = useHistory();

    useEffect(()=>{
        console.log("User:",userId);
    if (userId===undefined || userId===''){
       history.push("/")
    }
    },[]);

   
    function playTracks(tracks){
        // setPlayingTracks(tracks);
        let historyTracks = [];

        historyTracks.push({
                img:"",
                name:tracks.track_name,
                desc:tracks.artist_name,
                src:tracks.track_source
            });
        setPlayingTracks(historyTracks);
        // console.log("WelcomePage Tracks",tracks);
    }
    
    return (
        
        <div className="MusicApp">
            <NavigationBar/>
            <div style={{paddingBottom:'70px'}}>
            <div style={{width:'auto',height:'auto'}}><label className="pageLabel">Recently Played</label></div>
            <TableWithPagination userId={userId} playTracks = {playTracks}></TableWithPagination>
            </div>
            <footer>
                { playingTracks.length > 0 && 
                <div className="footer">
                <Playlist tracks={playingTracks} opts={playlistOverideStylingOpts}/>
                </div>
                }
                
            </footer>
        </div>
    );
}



export default Welcome;