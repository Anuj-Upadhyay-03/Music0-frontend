//Author: Utkarsh Patel
// Created on: 17th July,2021
import React from 'react';
import "../css/Friends.css";
import {Navbar, Nav, Form, FormControl, Button, NavDropdown, Card, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import { useEffect, useState } from 'react';
import cookie from "react-cookies";
import {NavigationBar} from "../Navigation";
import * as ReactBootStrap from 'react-bootstrap';
import { base64StringToBlob } from 'blob-util';
import Loader from "react-loader-spinner";


export default function Friends() {
    const history = useHistory();
    const [friendList, setFriends] = useState([]);
    const [searchUser, setSearchUser] = useState('')
    const [user_id, setUserId] = useState(cookie.load('userId'));
    var [isloading, setloading] = useState(true)
    var secondColumnStart = '';
    var thirdColumnStart = '';

    useEffect(() => {
        if(user_id===undefined || user_id===''){
            history.push("/")
        }
    },[]);
    useEffect(() => {
        async function fetchFriends(){
            await axios.get("https://csci-5709-musico-backend.herokuapp.com/friendspage", {
                params: {
                "user_id":user_id
                }
            }).then((res) => {
                setFriends(res.data);
                setloading(false);                
            });
        }
        fetchFriends();
    },[]);

    async function handleClick(id){
        const confirmBox = window.confirm(
            "Do you really want to unfollow?"
          )
          if (confirmBox === true) {
            await axios.get("https://csci-5709-musico-backend.herokuapp.com/removeFriend", {
                params: {
                    "user_id":user_id,
                    "friend_id":id
                }
            })
            setFriends(friendList.filter(item => item.friend_id !== id))
        }
        
    }
    async function viewProfile(id,name){
        history.push("/friendsplaylist/",{Friend_id : id,Friend_name : name});
    }
    if(isloading == true){
        return(
            <div>
                <body>
                <NavigationBar/>
                <Loader
                    type="ThreeDots"
                    color="#50f2f2"
                    height={100}
                    width={100}
                    visible={true}
                />
                </body>
            </div>
        )
    }
    else if(friendList == ''){
        return(
            <body>
                <NavigationBar/>
                <div style={{display:'flex', justifyContent:'center'}}>
                <h1 style={{color: 'white', alignContent:'center'}}>Friends Page</h1>
                <input type="text" className="form form-control-sm" style={{marginLeft:"55%", marginTop:"20px"}} placeholder="Search Friend..." onChange={event => {setSearchUser(event.target.value)}}></input>
                </div>
            <div><h1 style={{marginLeft:'35%'}}>You have no friends</h1></div>
            </body>
        )
    }
    else{
    return(
        <body>
            <NavigationBar/>
            <div style={{display:'flex', justifyContent:'center'}}>
            <h1 style={{color: 'white', alignContent:'center'}}>Friends Page</h1>
            <input type="text" className="form form-control-sm" style={{marginLeft:"55%", marginTop:"20px"}} placeholder="Search Friend..." onChange={event => {setSearchUser(event.target.value)}}></input>
            </div>
            <div className="row">
                <div className="col-md-4">
            {friendList.filter((val) => {
                if(searchUser == ""){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
                else if(val.friend_name.toLowerCase().includes(searchUser.toLowerCase())){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
                else if(val.friend_email.toLowerCase().includes(searchUser.toLowerCase())){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
            }).slice(0,secondColumnStart).map((r) => {
                const ImageURL = URL.createObjectURL(base64StringToBlob(r.friend_photo,"image/jpg"))
                return(
                    <Container>
                    <div classname="card">
                    <div classname="childcard">
                        <Card style={{ width: '18rem', backgroundColor:'#1f8c8c'}}>
                            <Card.Img variant="top" src={ImageURL}/>
                                <Card.Body>
                                    <Card.Title>{r.friend_name}</Card.Title>
                                    <Card.Subtitle style={{color: '#0d0d0d'}}>{r.friend_email}</Card.Subtitle>
                                    <br/>
                                    <Card.Text>
                                    {r.friend_bio}
                                    </Card.Text>
                                    <div classname="wrapper">
                                    <Button onClick={() => viewProfile(r.friend_id,r.friend_name)} size="sm"style={{backgroundColor:'#011526', position:'relative'}}>View Profile</Button>
                                    <Button onClick={() => handleClick(r.friend_id)} size="sm"style={{backgroundColor:'#011526', marginLeft:'50px'}}>Unfollow</Button>  
                                    </div>
                                </Card.Body>
                        </Card>
                    </div> 
                    </div>
                    </Container>
                )
            })}
            </div>
            <div className="col-md-4">
            {friendList.filter((val) => {
                if(searchUser == ""){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
                else if(val.friend_name.toLowerCase().includes(searchUser.toLowerCase())){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
                else if(val.friend_email.toLowerCase().includes(searchUser.toLowerCase())){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
            }).slice(secondColumnStart,thirdColumnStart).map((r) => {
                const ImageURL = URL.createObjectURL(base64StringToBlob(r.friend_photo,"image/jpg"))
                return(
                    <Container>
                    <div classname="card">
                    <div classname="childcard">
                        <Card style={{ width: '18rem', backgroundColor:'#1f8c8c'}}>
                            <Card.Img variant="top" src={ImageURL}/>
                                <Card.Body>
                                    <Card.Title>{r.friend_name}</Card.Title>
                                    <Card.Subtitle style={{color: '#0d0d0d'}}>{r.friend_email}</Card.Subtitle>
                                    <br/>
                                    <Card.Text>
                                    {r.friend_bio}
                                    </Card.Text>
                                    <div classname="wrapper">
                                    <Button onClick={() => viewProfile(r.friend_id,r.friend_name)} size="sm"style={{backgroundColor:'#011526', position:'relative'}}>View Profile</Button>
                                    <Button onClick={() => handleClick(r.friend_id)} size="sm"style={{backgroundColor:'#011526', marginLeft:'50px'}}>Unfollow</Button>  
                                    </div>
                                </Card.Body>
                        </Card>
                    </div> 
                    </div>
                    </Container>
                )
            })}
            </div>
            <div className="col-md-4">
            {friendList.filter((val) => {
                if(searchUser == ""){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
                else if(val.friend_name.toLowerCase().includes(searchUser.toLowerCase())){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
                else if(val.friend_email.toLowerCase().includes(searchUser.toLowerCase())){
                    secondColumnStart = Math.ceil(friendList.length/3);
                    thirdColumnStart = Math.ceil(friendList.length/1.5);
                    return val
                }
            }).slice(thirdColumnStart).map((r) => {
                const ImageURL = URL.createObjectURL(base64StringToBlob(r.friend_photo,"image/jpg"))
                return(
                    <Container>
                    <div classname="card">
                    <div classname="childcard">
                        <Card style={{ width: '18rem', backgroundColor:'#1f8c8c'}}>
                            <Card.Img variant="top" src={ImageURL}/>
                                <Card.Body>
                                    <Card.Title>{r.friend_name}</Card.Title>
                                    <Card.Subtitle style={{color: '#0d0d0d'}}>{r.friend_email}</Card.Subtitle>
                                    <br/>
                                    <Card.Text>
                                    {r.friend_bio}
                                    </Card.Text>
                                    <div classname="wrapper">
                                    <Button onClick={() => viewProfile(r.friend_id,r.friend_name)} size="sm"style={{backgroundColor:'#011526', position:'relative'}}>View Profile</Button>
                                    <Button onClick={() => handleClick(r.friend_id)} size="sm"style={{backgroundColor:'#011526', marginLeft:'50px'}}>Unfollow</Button>  
                                    </div>
                                </Card.Body>
                        </Card>
                    </div> 
                    </div>
                    </Container>
                )
            })}
            </div>
            </div>
        </body>
    ) 
}     
}        