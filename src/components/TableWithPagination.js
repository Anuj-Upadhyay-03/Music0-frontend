//Author: Fenil Shah
//Created on: 21st June,2021
import React, {useEffect, useState,useRef} from "react";
import { useHistory } from "react-router";
import Axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { PencilSquare, HandThumbsUp,HandThumbsUpFill } from "react-bootstrap-icons";
import DropdownButton from 'react-bootstrap/DropdownButton'
import '../css/Welcomepage.css';
import { OverlayTrigger,Tooltip,Spinner } from "react-bootstrap";
import AddtoPlaylistMenu from "./AddtoPlaylistMenu";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import cookie from "react-cookies";
import {Notify} from "./Notify";



const userData = {"userId":"usr_243c54ccb56c45c8b06a937e6c1eb9ca"}
const TableWithPagination = (props) =>{
    const appHistory = useHistory();
    const [isLoading,setIsLoading] = useState(false);
    const [recentHistory,setRecentHistory] = useState([]);
    const [userPlaylists,setUserPlaylists] = useState([]);
    const [like,setLike] = useState(false);
    const [userId,setUserId] = useState(props.userId);
    
    const headers = {
        'Content-Type':'application/json'
    }

    async function fetchData(){
      setIsLoading(true);
      await Axios({
          method:'get',
          url:'https://csci-5709-musico-backend.herokuapp.com/getPlayingHistory',
          headers:{'Content-Type':'application/json; charset=utf-8'},
          params:{'userId':userId}
      })
      .then((response) => {
        setIsLoading(false);
        // props.playTracks(response.data.data);
          setRecentHistory(response.data.data);
          console.log("NewData",response.data.data);
      });
  }

    async function fetchUserPlaylists(){
        await Axios({
            method:'get',
            url:'https://csci-5709-musico-backend.herokuapp.com/playlist',
            params:{'user_id':userId}
        })
        .then((response) => {
            setUserPlaylists(response.data);
            console.log("Playlists",response.data);
        });
    }

    useEffect(() => {
      console.log(props.userId);
      fetchData().then(fetchUserPlaylists());
      },[]);

      async function likeSong(index,row) {
        setIsLoading(true);
        await Axios({
          method:'post',
          url:'https://csci-5709-musico-backend.herokuapp.com/likesong',
          params:{
            'user_id':userId,
            'track_id':row.track_id
          }
        })
        .then((response) => {
          // setUserPlaylists(response.data);
            console.log('Show success notification!');
            fetchData();
            setIsLoading(false);
            // const updatedhistory = {...recentHistory};
            // updatedhistory[index].isLiked = !recentHistory[index].isLiked;
            // setRecentHistory(updatedhistory);            
        })
        .catch(
          function (error) {
            setIsLoading(false);
            // console.log(error);
            Notify("ERROR!" + error,true);
          });
      }

      function createNewPlaylist()
      {
        appHistory.push("/playlist");
      }

      async function addSongToPlaylist(trackId,playlistId,playlistName)
      {
        await Axios({
          method:'get',
          url:'https://csci-5709-musico-backend.herokuapp.com/addsong',
          params:{
            'user_id':userId,
            'playlist_id':playlistId,
            'playlist_name':playlistName,
            'song_id':trackId
          }
        })
        .then((response) => {
          // setUserPlaylists(response.data);
          Notify('Song added to playlist!',false)
          console.log('Song added to playlist!',playlistName);
            //changeicon
        })
        .catch(
          function (error) {
            
            Notify('Error adding song to playlist!',false)
            console.log('Error adding song to playlist!',playlistName);
          });
      }

      async function unlikeSong(index,row){
        setIsLoading(true);
        await Axios({
          method:'get',
          url:'https://csci-5709-musico-backend.herokuapp.com/deletesongs',
          params:{
            'user_id':userId,
            'playlist_name':'Liked Songs',
            'song_id':row.track_id
          }
        })
        .then((response) => {
          fetchData();
          setIsLoading(false);
        })
        .catch(
          function (error) {
            console.log('Show error notification!');
            setIsLoading(false);
            Notify(error,true);
          });
      }

      // const notify = (text,isError) => {
      //   if(isError)
      //   {
      //     toast.error(text,
      //       {position:"top-right",
      //           autoClose:1000,
      //           hideProgressBar:true,
      //           newestOnTop:false,
      //           closeOnClick:true,
      //           rtl:false,
      //           pauseOnFocusLoss:true,
      //           draggable : false,
      //           pauseOnHover:true,
      //         }
      //       );
      //   }
      //   else
      //   {
      //     toast.success(text,
      //       {position:"top-right",
      //           autoClose:1000,
      //           hideProgressBar:true,
      //           newestOnTop:false,
      //           closeOnClick:true,
      //           rtl:false,
      //           pauseOnFocusLoss:true,
      //           draggable : false,
      //           pauseOnHover:true,
      //         }
      //       );
      //   }
      // }

      function goToAlbum(cell, row, rowIndex, colIndex)
      {
        return(
          <a href={"/album/" + row.album_id}>{row.album_name}</a>
        );
      }

      function goToArtist(cell, row, rowIndex, colIndex)
      {
        return(
          <a href={"/artist/" + row.artist_id}>{row.artist_name}</a>
        );
      }

      function playSong(cell, row, rowIndex, colIndex)
      {
        return(
          <a href="#" onClick={()=>{props.playTracks(row);}}>{row.track_name}</a>
        );
      }

      function cellFormatter(cell, row, rowIndex, colIndex)  {
        let likedKey = 'L'.concat(rowIndex.toString());
        let dislikedkey = 'D'.concat(rowIndex.toString());  
        return(
              <div className="icon">
              <a onClick={()=>{row.isLiked ? unlikeSong(rowIndex,row) : likeSong(rowIndex,row)}}>
                { row.isLiked ? 
                  <OverlayTrigger 
                    key={likedKey.concat('ovrlay')}
                    placement='top'
                    overlay={
                      <Tooltip id={likedKey.concat('-tooltip')}>
                          Unlike!
                      </Tooltip>
                    }
                  >
                    <HandThumbsUpFill style={{ display: row.isLiked ? 'block' : 'none'}} color="black" key={likedKey}  size={20}></HandThumbsUpFill>
                  </OverlayTrigger>
                  : 
                  <OverlayTrigger 
                    key={dislikedkey.concat('ovrlay')}
                    placement='top'
                    overlay={
                      <Tooltip id={dislikedkey.concat('-tooltip')}>
                          Like!
                      </Tooltip>
                    }
                  >
                    <HandThumbsUp style={{ display: row.isLiked ? 'none' : 'block'}} color="black" key={dislikedkey} size={20}></HandThumbsUp>
                  </OverlayTrigger>
                }
              </a>
              { 
                userPlaylists.length > 0 
                ?
                <OverlayTrigger 
                  placement='top'
                  overlay={
                    <Tooltip>
                      Add to Playlist
                    </Tooltip>
                  }
                >
                  <AddtoPlaylistMenu list={userPlaylists} userId={row.user_id} trackId={row.track_id} addtoPlaylist={addSongToPlaylist} createNewPlaylist={createNewPlaylist}/>
                </OverlayTrigger>  
                :
                <OverlayTrigger 
                  placement='top'
                  overlay={
                    <Tooltip>
                      Create a Playlist
                    </Tooltip>
                  }>
                    <a href="/playlist" style={{ marginLeft: '0.75rem' }}> <PencilSquare color="black"  size={20}/></a>
                </OverlayTrigger>          
              }

              </div>
          )            
          }      

      const columns = [{
        dataField: 'track_name',
        text: 'Song',
        formatter: playSong,
      }, {
        dataField: 'album_name',
        text: 'Album',
        formatter: goToAlbum,
      }, {
        dataField: 'artist_name',
        text: 'Artist',
        formatter:goToArtist,
      }, {
        dataField: 'track_id',
        text: "",
        formatter: cellFormatter,
      }];

    return (
        <div className="container">
                      <ToastContainer/>
                      <Loader className="centered" type="ThreeDots" color="#00BFFF" style={{display:'flex',justifyContent:'flex-center'}} height={80} width={80} visible={isLoading}/>
            {/* {loading && <Spinner animation="border" role="status"></Spinner>} */}
            {
              // recentHistory && recentHistory.length > 0 && 
              <BootstrapTable   bootstrap4 keyField='hist_id' noDataIndication={()=>{return <p className="pageLabel">No data found</p>}} data={ recentHistory } bordered={false} columns={ columns } pagination={ paginationFactory() } />
              // : <div><p className="pageLabel">No data found</p></div>
            }
        </div>
    );
}

export default TableWithPagination;