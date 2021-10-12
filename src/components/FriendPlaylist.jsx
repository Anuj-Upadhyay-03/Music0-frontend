//Author: Anuj Upadhyay
// Created on: 16th July,2021
import React,{useState,useEffect} from 'react';
import {NavigationBar} from "../Navigation";
import Player from 'react-mp3-player';
import Accordion from 'react-bootstrap/Accordion';
import {Button,Card,Modal} from 'react-bootstrap';
import "../css/FriendPlaylist.css";
import cookie from 'react-cookies';
import {useHistory} from "react-router-dom";
import Axios from "axios";
import ReactLoading from 'react-loading';

 function Playlisttree(props) {

    const history = useHistory();
    const [userId, setUserId] = useState(cookie.load('userId'));
    const [friend_id, setfriend_id] = useState("");
    const [friend_name, setfriend_name] = useState(""); 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);   
    const handleShow = () => setShow(true);
    const [importmessage, setimportmessage] = useState("");
    const [loader,setloader]=useState(false);
    const [noplaylistmessage, setnoplaylistmessage] = useState(false);
    const tracks = [{ img: 'https://icon-library.net/images/music-icon-transparent/music-icon-transparent-11.jpg', name:'MP3', desc: 'Description 1', src:'Audio.mp3'},
    { img: 'https://icon-library.net/images/music-icon-transparent/music-icon-transparent-11.jpg', name:'MP3 #2', desc: 'Description 2', src:'Audio2.mp3'}]
  
    const [playlist,setplaylist] = useState({}); 

    useEffect(()=>{
            if(userId===undefined || userId ===''){
                history.push("/");
            }
            else{
                 setfriend_id(props.location.state.Friend_id);
                 setfriend_name(props.location.state.Friend_name);
                 setloader(true);
                 Axios({
                    method: 'get',
                    url: 'https://csci-5709-musico-backend.herokuapp.com/friendsplaylist',
                    params:{
                     friend_id:props.location.state.Friend_id
                    }
                  })
                  .then((response)=> {
                    setloader(false);
                    if(Object.entries(response.data).length === 0){
                        setnoplaylistmessage(true)
                    }
                    else{
                    setplaylist(response.data);
                    setnoplaylistmessage(false);
                    }
                  });

                // setplaylist({"playlist1":[{"Playlist_id":"1","Song_Number":"1","song":"The Moment","Album":"Album1"},{"Playlist_id":"anuj","Song_Number":"2","song":"The Moment","Album":"Album2"}],
                // "playlist2":[{"Playlist_id":"2","Song_Number":"3","song":"The Moment","Album":"ALBUM3"},{"Playlist_id":"2","Song_Number":"4","song":"The Moment","Album":"ALBUM4"}]});
            }
        },[]);


    

    const playlistOverideStylingOpts = {
        offset : {
          left : 0,
          "backgroundColor": "black",
          opacity: 0.9
        },
        breakpoint : {
          maxWidth : 768
          }
      };

      function importplaylist(playlist_id){
        setloader(true);
            Axios({
                method: 'get',
                url: 'https://csci-5709-musico-backend.herokuapp.com/importplaylist',
                params:{
                  user_id:userId,
                  friend_id:friend_id,
                  playlist_id:playlist_id
                }
              })
              .then((response)=> {
                setloader(false);
                setimportmessage(response.data);
                handleShow();
              });
      }


    return (
        <>

        <div style={{height:'775px'}}>
              <NavigationBar/>

              <Modal show={show}  onHide={handleClose} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{importmessage}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>

           <div style={{"textalign": "justify"}}><label className="friendplaylist-label">{friend_name}'s Playlist</label></div> 
              <form className="Playlistform" >
              <ReactLoading type="bars" color="#fff" className="displayloader" style={{display:loader? "block" : "none"}}/>
              <div style={{display:noplaylistmessage?"block":"none"}}>
              <h2 className="displayerrormsg">{friend_name} has no Playlist!!</h2>
              </div>
               <Accordion style={{display:noplaylistmessage?"none":"block"}}>
               {
            Object.entries(playlist).map(([key,value],i)=>{
                return(
                <Card className="card-style">
                            <Card.Header className="cardheader-style">
                            <Accordion.Toggle as={Button} variant="link" eventKey={i+1} className="btncolor-style">
                            {key}
                            </Accordion.Toggle>
                            <Button id={value[0].playlist_id} className="import-button" onClick ={()=>importplaylist(value[0].playlist_id)}>Import</Button>    
                            </Card.Header>
                            <Accordion.Collapse className="cardcollapse-style" eventKey={i+1}>
                                <div  style={{float:'left',padding: '0px 11px'}}>
                                <Card.Body style={{paddingBottom:'0px'}}>
                                    <div className="row playlist-heading txtunderline" style={{width:'788px'}}> 
                                        <div className="col-sm-2">#</div>
                                        <div className="col-sm-5">Song Name</div>
                                        <div className="col-sm-5">Album</div>
                                    </div> 
                                </Card.Body>
                                    {
                                        value.map(eachplaylistsong=>{
                                            if(eachplaylistsong.songs === null){
                                                return(
                                                    <Card.Body style={{paddingBottom:'0px'}}>
                                                    <div className="row playlist-heading nosongs" style={{width:'788px'}}>
                                                        No songs in this playlist !!!
                                                    </div> 
                                                </Card.Body>
                                                )
                                            }
                                            else{
                                            return(
                                            <Card.Body style={{paddingBottom:'0px'}}>
                                            <div className="row playlist-heading" style={{width:'788px'}}> 
                                                <div className="col-sm-2">{eachplaylistsong.row_num}</div>
                                                <div className="col-sm-5">{eachplaylistsong.songs}</div>
                                                <div className="col-sm-5">{eachplaylistsong.album}</div>
                                            </div> 
                                        </Card.Body>
                                        )}})
                                    }
                              
                               
                        </div>
                            </Accordion.Collapse>
                </Card>
               
            )})
         }
                </Accordion>
                </form>
                
                {/* <div>
                <Player tracks={tracks} opts={playlistOverideStylingOpts}/>
                </div> */}


        </div>
        </>
    );
}

export default Playlisttree;