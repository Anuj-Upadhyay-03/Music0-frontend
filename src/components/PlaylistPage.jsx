//Author: Anuj Upadhyay
// Created on: 16th July,2021
import React,{useState,useEffect} from 'react';
import {NavigationBar} from "../Navigation";
import "../css/playliststyle.css";
import Player from 'react-mp3-player';
import {Button,Modal} from 'react-bootstrap';
import Axios from "axios";
import Carousel from "react-elastic-carousel";
import Item from "./Item";
import ReactLoading from 'react-loading';
import "../css/Carousel_style.css";
import cookie from 'react-cookies';
import {useHistory} from "react-router-dom";
import { AddToHistory } from './AddToHistory';

 const Playlist = () => {

      const [userId, setUserId] = useState(cookie.load('userId'));
      const [selectedplaylist,setselectedplaylist] = useState("");
      const [newNameError, setnewNameError] = useState("")
      const [modalShow, setModalShow] = React.useState(false);
      const [items, setItems] = useState(["Liked Songs"]);
      const [errorMessage,seterrorMessage] = useState(false);
      const [errorPlaylistSong,seterrorPlaylistSong] = useState(false);
      const [displayPlaylist,setdisplayPlaylist]=useState("none");
      const [loader,setloader]=useState(false);
      const handleClose = () => setModalShow(false);
      const [songs,setSongs] = useState([]);
      const [playerDisplay,setplayerDisplay] = useState("none");
      const history = useHistory();
  

      const [tracks,settracks] = useState([{img:"", name:"Daydreaming", desc:"A Moon Shaped Pool", src: process.env.PUBLIC_URL+""}]);
       
  
    const playlistOverideStylingOpts = {
        offset : {
          left : 0,
          "backgroundColor": "black",
          opacity: 0.9,
          display:playerDisplay
        },
        breakpoint : {
          maxWidth : 768
          }
      };

      const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2, itemsToScroll: 2 },
        { width: 768, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 }
      ];

      const handleMouseEnter=(e)=>{
        e.currentTarget.style.backgroundColor = 'darkcyan';
        e.currentTarget.style.fontStyle= 'italic';
      }

      const handleMouseOut=(e)=>{
        e.currentTarget.style.backgroundColor = '';
         e.currentTarget.style.fontStyle= 'normal';
      }


      useEffect(()=>{
                      console.log("User: ",userId);
                      if(userId===undefined || userId ===''){
                          history.push("/");
                      }
                      else{
                      setloader(true);
                        Axios({
                          method: 'get',
                          url: 'https://csci-5709-musico-backend.herokuapp.com/playlist?user_id='+userId,
                        })
                        .then(function (response) {
                          setloader(false);
                          if(response.data.length>0){
                                response.data.map(function(val){
                                   setItems(items =>([...items, `${val.playlist_name}`]));
                                  });
                                }
                        });
                      }
                     },[]);

      function MyVerticallyCenteredModal(props) {

        let textInput = React.createRef();

        const newPlaylistSubmit = () => {

                    const nextItem = textInput.current.value;
                    if(nextItem.length>0){
                        setModalShow(false);
                        setloader(true); 
                              Axios({
                                method: 'get',
                                url: 'https://csci-5709-musico-backend.herokuapp.com/addplaylist',
                                params:{
                                  user_id:userId,
                                  playlist_name:nextItem
                                }
                              })
                              .then(function (response) {
                                setloader(false);
                                setItems([...items, nextItem]);
                                seterrorMessage(false);
                              });
                    }
                    else
                    {
                      setnewNameError("Error:Please enter valid playlist name!")
                    }
                };

                return (
                  <Modal
                    {...props}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Add new playlist
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div style={{"display":"flex"}}>
                      <label className="modalClass">Name</label>
                      <input id="playlist-name" className="form-control" ref={textInput}></input>
                      </div>
                      <label className="modalClass">{newNameError}</label>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={props.onHide}>Cancel</Button>
                      <Button onClick={newPlaylistSubmit}>Submit</Button>
                    </Modal.Footer>
                  </Modal>
                );
      }

      function fetchPlaylistSongs(value){

              setselectedplaylist(value);
              setloader(true);
                Axios({
                  method: 'get',
                  url: 'https://csci-5709-musico-backend.herokuapp.com/playlistsongs',
                  params:{
                    user_id:userId,
                    playlist_name:value
                  }
                })
                .then(function (response) {
                  setloader(false);

                  if(response.data.length>0){

                    setSongs(response.data);
                    setdisplayPlaylist("none");
                    seterrorPlaylistSong(true);
                  }
                  else{
                    setdisplayPlaylist("block");
                    seterrorPlaylistSong(false);
                  }
                });
      }

      function deletePlaylistSongs(delvalue){
                setloader(true);
                Axios({
                  method: 'get',
                  url: 'https://csci-5709-musico-backend.herokuapp.com/deletesongs',
                  params:{
                    user_id:userId,
                    playlist_name:selectedplaylist,
                    song_id:delvalue
                  }
                })
                .then((response)=> {
                  setloader(false);
                  fetchPlaylistSongs(selectedplaylist);
                });
      }

      function deletePlaylist(delplaylistname){
                setloader(true);
                Axios({
                  method: 'get',
                  url: 'https://csci-5709-musico-backend.herokuapp.com/deleteplaylist',
                  params:{
                    user_id:userId,
                    playlist_name:delplaylistname
                  }
                })
                .then((response)=> {
                  setloader(false);
                  seterrorPlaylistSong(false);
                  setdisplayPlaylist("none");
                  setItems(items.filter(item => (item !== delplaylistname)));
                  if((items.length-1) === 0)
                  {
                    seterrorMessage(true);
                  }
                });
      }

      function CrossImage(props){
        const value = props.value;
        if(value !== "Liked Songs")
        return(
          <img src={process.env.PUBLIC_URL+"deleteplaylist.png"} style={{"height":'25px',"position":'absolute',"top":'23px'}} onClick ={()=>deletePlaylist(value)}></img>                                                                                                                                                                                                                                          
         )
         else
         return(<></>)
      }

      function playsongs(val){
        {AddToHistory(val.song_id,userId)}
        settracks([{ img: val.album_cover, name:val.songs, desc: val.album, src:val.mp3}]);
        setplayerDisplay("flex");
      }

       
      return (
        <div className="whole" style={{'width':'100%'}}>
          <NavigationBar/>
          <MyVerticallyCenteredModal
          show={modalShow}
          onHide={handleClose}
          />

         <div className="backgroundImage">
            <div className="newPlaylistButton" >
                   <button id="createNewButton" type="button" className="btn btn-success" onClick={() => setModalShow(true)}>Create New Playlist</button>
            </div>
       
            <div><label className="myPlaylistLabel">My Playlists</label>
            </div>
            <ReactLoading type="bars" color="#fff" className="displayloader" style={{display:loader? "block" : "none"}}/>
            <div id="playlistAndSongs">

                <div id="error" style={{display:errorMessage ? "block" : "none"}}>
                      <h2 className="displayError">It seems like you don't have any playlist. Get Started now!!</h2>
                </div>
            
                  <div id="playlistDisplay" style={{display:errorMessage ? "none" : "block"}}>
                        <div className="App_Caruosel">
                                              <div className="tainertrols-wrapper">
                                              </div>
                                              <div className="carousel-wrapper">
                                                <Carousel breakPoints={breakPoints}>
                                                  {items.map((item) => (
                                                    <>
                                                   <Item className="playlist-image" style={{backgroundImage: `url(${process.env.PUBLIC_URL+"Playlistthumbnail.jpeg"})`}} key={item} id={item} onClick={()=>fetchPlaylistSongs(item)}><h2 className="playlist-name">{item}</h2> 
                                                     </Item>
                                                    {/* <img src={Delete} style={{"height":'25px',"position":'absolute',"top":'23px'}} onClick ={()=>deletePlaylist(item)}></img>                                                                                                                                                                                                            */}
                                                     <CrossImage value={item}/>
                                                   </>
                                                  ))}
                                                </Carousel>
                                              </div>
                                              
                          </div>
                    <div id="errorMessageDisplay" style={{display:displayPlaylist}}><h2 className="displayErrorNoSong">No songs found in this playlist!!</h2></div>
                      
                    <div id="songslist" style={{display:errorPlaylistSong ? "block" : "none"}}>
                              <div style={{color: 'lightcoral',display:"flex","fontFamily": "none","paddingTop": "51px", "borderBottom": "1px solid black"}}>
                                  <div  style={{ "paddingLeft": "130px"}} className="col-sm-2" >
                                  <h3>#</h3>
                                  </div>
                                  <div className="col-3">
                                  <h3>TITLE</h3>
                                  </div>
                                  <div className="col-2">
                                  <h3>ALBUM</h3>
                                  </div>
                                  <div className="col-2">
                                  <h3>Artists</h3>
                                  </div>
                                  <div className="col-2">
                                  <h3>TIME</h3>
                                  </div>
                              </div>                    
                          {
                            songs.map((val)=>{
                                return(
                                    <div id ={val.song_id} onMouseEnter={handleMouseEnter} className="songDiv"  onMouseLeave={handleMouseOut}>
                                      <div  style={{ "paddingLeft": "130px"}} className="col-sm-2">
                                      <h5>{val.row_num}</h5>
                                      </div>
                                      <div  className="col-3">
                                      <h5>{val.songs}</h5>
                                      </div>
                                      <div  className="col-2">
                                      <h5>{val.album}</h5>
                                      </div>
                                      <div  className="col-2">
                                      <h5>{val.artist}</h5>
                                      </div>
                                      <div className="col-2">
                                      <h5><img src={process.env.PUBLIC_URL+"play.png"} onClick={()=>playsongs(val)}/></h5>
                                      </div>
                                      <div id ="Hello">
                                      <img id={val.song_id} src={process.env.PUBLIC_URL+"remove.png"} alt="Avatar" className="cross-image" onClick ={()=>deletePlaylistSongs(val.song_id)}/>
                                      </div>
                                  </div>
                            )})
                          }  
                    </div>
            </div> 
          
            </div>
        </div>
        <div>
        <Player tracks={tracks} opts={playlistOverideStylingOpts} />
        </div>
     </div>
     
    )
}

export default Playlist;
