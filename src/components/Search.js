//Author: Neehar Parupalli Ramakrishna
//Created On: 20th June 2021
import React, {useEffect,useState} from "react";
import {Card, Container, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {NavigationBar} from "../Navigation";
import Playlist from "react-mp3-player";
import "../css/Search.css";
import {Link,useLocation} from "react-router-dom";
import axios from "axios";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Notify} from "./Notify";
import { base64StringToBlob } from 'blob-util';
import { useHistory  } from "react-router-dom";
import { AddToHistory } from './AddToHistory';
import cookie from "react-cookies";
import { ToastContainer,toast } from 'react-toastify';
import {Redirect} from "react-router";

const Search = () =>{  

    const history = useHistory();
    let location = useLocation();
    const [searchText,setSearchText] = useState(location.state.searchText);
    const [artists,setArtists] = useState([]);
    const [albums,setAlbums] = useState([]);
    const [showLoader,setShowLoader] = useState(true);
    const [users,setUsers] = useState([]);
    const [songs,setSongs] = useState([]);
    const [loggedinUser,setLoggedinUser] = useState('');
    const [playingTracks,setPlayingTracks] = useState([{img:"", name:"", desc:"", src: ""}]);


    useEffect(()=>{
        setLoggedinUser(cookie.load('userId'));
        setSearchText(location.state.searchText);
        fetchSearchData();
    },[searchText,location]);

    function splitArray(dataArr){
        if(dataArr != null)
        {
            return new Array(Math.ceil(dataArr.length/3))
            .fill()
            .map(_=>dataArr.splice(0,3))
        }
        else
        {
            return [];

        }

    }

    async function fetchSearchData(){
        setShowLoader(true);
        await axios.get(`https://csci-5709-musico-backend.herokuapp.com/search/${searchText}`)
        .then((response)=>{
            console.log(response.data);
          if(response.data.message === "Success")
          {
              setArtists(splitArray(response.data.data.artists));
              setAlbums(splitArray(response.data.data.albums));
              setSongs(splitArray(response.data.data.tracks));
              setUsers(splitArray(response.data.data.users));
              setShowLoader(false);
            }
          else
          {
            setShowLoader(false);
            Notify("No Data found",true);
          }  
        })
        .catch((error)=>{
            setShowLoader(false);
            console.log(error)
            Notify("ERROR Occurred. Try again after some time",true);
        })
    }

    async function followUser(friend){
        setShowLoader(true);
        await axios({
            method:'post',
            url:'https://csci-5709-musico-backend.herokuapp.com/addFriend',
            data:{
                userId:loggedinUser,
                friendId:friend.userId
            }
        })
        .then((response)=>{
            setShowLoader(false);
            response.data 
            ? Notify("You started following " + friend.username,false)
            : Notify("Error following " + friend.username + " Please Try again",true) 
        })
        .catch((error)=>{
            setShowLoader(false);
            Notify("ERROR Occurred. Try again after some time",true);
        });
    }

    function playSong(track){
        //add to Player
        console.log("PlayingTrack",track);
        setPlayingTracks([{ img: "", name:track.trackName, desc: track.artistName, src:track.trackSource}]);
        {AddToHistory(track.trackId,loggedinUser)}
        // {tracks : [{ img: this.state.cover, name:this.state.tracks_list[track_no-1].track_name, desc: this.state.artist_name, src:this.state.tracks_list[track_no-1].track_source}]}

    }






    // const tracks = [{img:"", name:"Daydreaming", desc:"A Moon Shaped Pool", src: process.env.PUBLIC_URL+"Radiohead - Daydreaming.mp3"}];
    const playlistOverideStylingOpts = {
            offset : {
                left:0,
                "background-color": "black",
                opacity: 0.9,
                "color": "#50f2f2",
            }}

    return(
        <div className="search">
            <NavigationBar/>
            <ToastContainer/>
                {showLoader ? 
                    <div align="center" style={{marginTop:"5%"}}>
                    <Loader
                        type="ThreeDots"
                        color="#50f2f2"
                        height={100}
                        width={100}
                        visible={true}
                    />
                    </div>
                    :  
                <div align="center" style={{paddingBottom:'70px'}}>
                    {artists.length > 0 &&
                        <Container style={{marginTop:"2%", minWidth:"50%"}}>
                            <h3 style={{color:"#FFFFFF"}}>Artists</h3>
                            <div id="artistCarousel" className="carousel slide" data-interval="false">
                                <div className="carousel-inner">
                                    {artists.map((x,i)=>{
                                        let itemClass="";
                                        i === 0 ? itemClass = "carousel-item active" : itemClass="carousel-item"
                                        return(
                                            <div className={itemClass}>
                                                <Row style={{maxWidth:'50%'}}>
                                                    {
                                                        x.map((y)=>{
                                                            return(
                                                                <Card style={{ backgroundColor:'#1f8c8c',maxWidth:'50%'}}>
                                                                    <Link to={"/artist/" + y.artistId}>
                                                                        <img src={y.artistImage} className="search-card-img-top" />
                                                                        <span className="search-card-text wrapper"><b>{y.artistName}</b></span>
                                                                    </Link>
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            </div>
                                        )
                                    })}
                                </div>
                                <a className="carousel-control-prev" href="#artistCarousel" role="button"
                                    data-slide="prev">
                                    <span className="carousel-control-prev-icon" style={{color:"#0d0d0d"}} aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#artistCarousel" role="button"
                                    data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                        </Container>
                    }
                    {songs.length > 0 &&
                        <Container style={{marginTop:"2%", minWidth:"50%"}}>
                            <h3 style={{color:"#FFFFFF"}}>Songs</h3>
                            <div id="songsCarousel" className="carousel slide" data-interval="false">
                                <div className="carousel-inner">
                                    {songs.map((x,i)=>{
                                        let itemClass="";
                                        i === 0 ? itemClass = "carousel-item active" : itemClass="carousel-item"
                                        return(
                                            <div className={itemClass}>
                                                <Row style={{maxHeight:'10%'}}>
                                                    {
                                                        x.map((y)=>{
                                                            return(
                                                                <Card style={{ width: '18rem', backgroundColor:"#1f8c8c"}} onClick={()=>{playSong(y);}}>
                                                                    <span className="search-card-text wrapper"><b>{y.artistName}</b></span>
                                                                    <span className="search-card-text wrapper">{y.trackName}</span>
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            </div>
                                        )
                                    })}
                                </div>
                                <a className="carousel-control-prev" href="#songsCarousel" role="button"
                                    data-slide="prev">
                                    <span className="carousel-control-prev-icon" style={{color:"#0d0d0d"}} aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#songsCarousel" role="button"
                                    data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                                </a>
                            </div>
                        </Container>
                    }
                    {albums.length > 0 &&
                        <Container style={{marginTop:"2%", minWidth:"50%"}}>
                            <h3 style={{color:"#FFFFFF"}}>Albums</h3>
                            <div id="artistCarousel" className="carousel slide" data-interval="false">
                                <div className="carousel-inner">
                                {albums.map((x,i)=>{
                                    let itemClass="";
                                    i === 0 ? itemClass = "carousel-item active" : itemClass="carousel-item"
                                        return(
                                            <div className={itemClass}>
                                                <Row style={{maxWidth:'50%'}}>
                                                    {
                                                        x.map((y)=>{
                                                            return(
                                                                <Card style={{ maxWidth:'50%', backgroundColor:'#1f8c8c'}}>
                                                                    <Link to={"/album/" + y.albumId}>
                                                                    <img src={y.albumCover} className="search-card-img-top" />
                                                                    
                                                                    <span className="search-card-text wrapper"><b>{y.albumName}</b></span>
                                                                    {/* <span className="search-card-text wrapper">{y.albumName}</span> */}
                                                                    </Link>
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            </div>
                                        )
                                })}
                            </div>
                            <a className="carousel-control-prev" href="#artistCarousel" role="button"
                               data-slide="prev">
                                <span className="carousel-control-prev-icon" style={{color:"#0d0d0d"}} aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#artistCarousel" role="button"
                               data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </Container>
                    }
                    {users.length > 0 &&
                        <Container style={{marginTop:"2%", minWidth:"50%"}}>
                            <h3 style={{color:"#FFFFFF"}}>Profiles</h3>
                            <div id="songsCarousel" className="carousel slide" data-interval="false">
                                <div className="carousel-inner">
                                {users.map((x,i)=>{
                                    let itemClass="";
                                    i === 0 ? itemClass = "carousel-item active" : itemClass="carousel-item"
                                    return(
                                        <div className={itemClass}>
                                            <Row style={{maxWidth:'50%'}}>
                                                {x.map((y)=>{
                                                    return(
                                                        <Card style={{maxWidth:'50%', backgroundColor:"#1f8c8c"}} >
                                                            <Card.Body style={{ width: '30rem'}}>
                                                                <img src={URL.createObjectURL(base64StringToBlob(y.userImage,"image/jpg"))} className="search-card-img-top" style={{maxWidth:'50%'}}/>
                                                                <br/>
                                                                <span className="search-card-text wrapper"><b>{y.username}</b></span>
                                                            </Card.Body>
                                                            <Button type="button" size="sm" style={{backgroundColor:'#011526',marginLeft:"2%", width:"50%",marginBottom:"20px"}} onClick={()=>{followUser(y)}}>Follow</Button>
                                                        </Card>
                                                    )                                                        
                                                })}
                                            </Row>
                                        </div>
                                    )
                                })}
                                </div>
                                <a className="carousel-control-prev" href="#songsCarousel" role="button"
                                    data-slide="prev">
                                    <span className="carousel-control-prev-icon" style={{color:"#0d0d0d"}} aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#songsCarousel" role="button"
                                    data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                        </Container>
                    }            
                </div>}
                <footer>
                    {
                        playingTracks && <Playlist tracks={playingTracks} opts={playlistOverideStylingOpts} />
                    }
                </footer>
            </div>
        );
}

export default Search;
