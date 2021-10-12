//Author: Simar Saggu
// Created on: 16th July,2021
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Profile.css';
import React, { useState,useEffect  } from "react";
import {  Container,Col, Row, Button, Dropdown,DropdownButton} from 'react-bootstrap';
import imgHolder from '../images/imgHolderFemale.png';
import {NavigationBar} from "../Navigation";
import Player from '../Player';
import axios from 'axios';
import cookie from "react-cookies";
import { base64StringToBlob } from 'blob-util';
import imageToBase64 from 'image-to-base64/browser';
import { useHistory, useParams  } from "react-router-dom";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Notify} from "./Notify";
import {ToastContainer} from "react-toastify";


const profileUrl="https://csci-5709-musico-backend.herokuapp.com/profile/view/";
const editUrl="https://csci-5709-musico-backend.herokuapp.com/profile/edit/";
const deleteUrl = "https://csci-5709-musico-backend.herokuapp.com/profile/delete/";

//Menu icon:https://icons8.com/icons/set/menu
//Default Image:https://www.clipartkey.com/view/oTwJoo_woman-profile-icon-png-clipart-png-download-woman/

function Profile() {
  
  const [name, setName]=useState('');
  const [image, setImage] = useState('');
  const [bio, setBio]=useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email,setEmail ]=useState('');
  const [password, setPassword]=useState('');
  const [cpassword, setCPassword]=useState('');
  const [country, setCountry] = useState('');
  const [followers, setFollowers] = useState();
  const [following, setFollowing ]= useState();
  const [playlist, setPlaylist ]= useState();
  const [formState, setFormState] = useState(true);
  const [formLoading, setFormLoading] = useState(true);

  let parameter = useParams();
  let history = useHistory();

  // Referred this package to convert image to base64
  //https://www.npmjs.com/package/image-to-base64
  const checkImg=()=>{
    if(image.length===0)
        {
            imageToBase64(imgHolder).then(res=>{console.log(res);setImage(res);}) 
        }
  }

  useEffect(()=>{
    //Referred this package for cookies
    //https://www.npmjs.com/package/react-cookies
    var userId = cookie.load("userId");
    if (userId===undefined || userId!=parameter.userId){
       history.push("/")
    }
    getUser();
    checkImg();
  },[]);

  const editForm=(event)=>{
    setFormState(false);
  }

  let data = {
      "name": name,
      "country": country,
      "password": password,
      "cpassword":cpassword,
      "profileImage":image,
      "bio":bio,
      "userId":parameter.userId
  }

  async function saveUser(){
    setFormLoading(true);
    await axios({url:editUrl,
      method:"PUT",
      headers:{
        'Content-type': 'application/json'
      },
      data: JSON.stringify(data) 
    }).then(res=>{
      setFormLoading(false);
      if(res['data']['message']==="Updated" && res['data']['statusCode']===200){
        
        alert("updated profile successfully!")
        history.push("/profile/"+parameter.userId);
      }
      else if(res['data']['message']==="name_invalid" && res['data']['statusCode']===422){
        alert("Name field is invalid. Please enter proper name. Eg John Doe")
        history.push("/profile/"+parameter.userId);
      }
      else if(res['data']['message']==="pass_not_match" && res['data']['statusCode']===422){
        alert("Entered passwords do not match")
        history.push("/profile/"+parameter.userId);
      }
      else if(res['data']['message']==="Failed" && res['data']['statusCode']===500){
        alert("Your profile could not be updated due server error. Please contact administrator");
        history.push("/profile/"+parameter.userId);
      }
    }).catch((err)=>{
      setFormLoading(false);
      Notify("Profile could not be updated!",true)
    });
  }

  const validateName = () => {
    var regex = /[a-zA-Z]+\s+[a-zA-Z]+$/;
    if(name===""){
        return "Name cannot be empty";
    }
    if(!name.match(regex)){
        return "Invalid name";
    }
}

  const validatePassword= () => {
    var regex = /^[a-zA-Z0-9!@#$%^&*()]+$/;
    if(password===""){
      return "";
    }
    if (password.length < 8 || password.length > 15){
        return "Password should be between 8 to 15 characters";
    }
    if (!password.match(regex)){
        return "Invalid Password";
    }
}

const checkPasswordMatch = () =>{
    if (password !== cpassword){
        return "Passwords don't match";
    }
}

  const saveForm=(event)=>{
    setFormState(true);
    saveUser();
  }

  const shareForm=(event)=>{
    Notify("Copy this url to share your profile:\n"+profileUrl+parameter.userId,false)
  }

 async function getUser(){
  setFormLoading(true);
    await axios.get(profileUrl+parameter.userId).then(res=>{
      setFormLoading(false);
      if(res['data']['message']==="exists" && res['data']['statusCode']===200){
        setCountry(res['data']['country']);
        setImage(res['data']['profileImage']);
        setName(res['data']['name']);
        setPhoneNumber(res['data']['phoneNumber']);
        setEmail(res['data']['email']);
        setFollowers(res['data']['followers']);
        setFollowing(res['data']['following']);
        setPlaylist(res['data']['playlists']);
        setBio(res['data']['bio']);
      }
      
    }).catch((err)=>{
      setFormLoading(false);
      console.log(err);
    });
  }

  //Referred this package to convert image to base64
  //https://www.npmjs.com/package/image-to-base64
  const convertImageBytes=(event)=>{
    var file = event.target.files[0];
    imageToBase64(URL.createObjectURL(file)) 
    .then((response) => {
       setImage(response);})
    .catch((error) => {
        console.log(error); 
      })
    }

async function deleteAccCall(){
  await axios({
  url:deleteUrl+parameter.userId,
  method:"DELETE"
}).then(res=>{
  
  if(res['data']['message']==="deleted" && res['data']['statusCode']===200)
  {
    alert("Your account is deleted successfully");
    history.push("/");
  }
  else if(res['data']['message']==="not_exists" && res['data']['statusCode']===404){
    alert("This account does not exist");
    history.push("/");
  }
  else{
    alert("Your account could not be deleted due to internal server error!");
    history.push("/welcome");
  }})
.catch(err=>Notify("Account could not be deleted",true));
}

const deleteAccount=()=>{
  var deleteStatus= window.confirm("Are you sure you want to delete this account! Once this account is deleted, you cannnot recover it.")
  if (deleteStatus){
    deleteAccCall();
    //Referred this package for cookies
    //https://www.npmjs.com/package/react-cookies
    cookie.remove("userId",{path:"/"});
  }
}

   return (<div>
      <NavigationBar/>
    <div className="Profile">
        <ToastContainer/>
      <Container fluid>
      {/* Referred this package to create loader:https://www.npmjs.com/package/react-loader-spinner */}
      <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} visible={formLoading}/>
        <form  method="post">
          <Row>
            <Col  md={3} lg={3} className="left-menu">
              <Row>
                
                <div className="profile-img-ctnr">
                    <div className="img-holder">
                      <img src={URL.createObjectURL(base64StringToBlob(image, "image/jpg"))} className="imgDisplay"/>
                    </div>
                    <input type="file" name="profile" accept="image/*" id="input-img" onChange={(event)=>{ convertImageBytes(event);}} disabled={formState} />
                    <label htmlFor="input-img" name="profile">
                      <img src="https://img.icons8.com/metro/26/ffffff/upload.png"/>
                    </label>
                </div>
              </Row>
              <Row>
                <Container className="card">
                <Row>
                  <label className="bio-ctnr-label">Bio</label>
                </Row>
                <textarea className="bio-ctnr-txt" id="bio" defaultValue={bio} placeholder="Tell others about you.." disabled={formState} onChange={event=>setBio(event.target.value)} rows="4" cols="auto"></textarea>
                </Container>
              </Row>
            </Col>
            <Col  md={9} lg={9}>
              <Row>
                <Col md={10} lg={10}>
                 <input className="name-lbl" defaultValue={name} onChange={(event)=>setName(event.target.value)} disabled={formState}></input>
                 {validateName()}
                </Col>
                <Col md={2} lg={2}>
                <DropdownButton  id="menu" className="menu" title={<img src="https://img.icons8.com/ios-glyphs/30/000000/squared-menu.png"/>}>
                <Dropdown.Item  className="menuItem" onClick={editForm}>Edit</Dropdown.Item>
                <Dropdown.Item className="menuItem" onClick={shareForm}>Share</Dropdown.Item>
                <Dropdown.Item className="menuItem" onClick={deleteAccount}>Delete Account</Dropdown.Item>
                </DropdownButton>
                </Col>
              </Row>
              <Row>
              <Col>
                <div className="follow-cntr">
                  <Row>
                    <div className="follow">
                    Following
                    </div>
                  </Row>
                  <Row>
                  <div className="follow">
                    {following}
                    </div>
                  </Row>
                </div>
              </Col>
              <Col>
              <div className="follow-cntr">
                  <Row>
                  <div className="follow">
                  Followers
                  </div>
                  </Row>
                  <Row>
                    <div className="follow">
                    {followers}
                    </div>
                  </Row>
                </div>
              </Col>
              <Col>
                  <div className="follow-cntr">
                      <Row>
                      <div className="follow">
                      Playlist
                      </div>
                      </Row>
                      <Row>
                      <div className="follow">
                        {playlist}
                        </div>
                      </Row>
                    </div>
                </Col>
              </Row>
              <Row>
                <div className="form-detail">
                  <Row>
                    <Col>
                    Phone number
                    </Col>
                    <Col>
                    <input type="text" className="form-inputs" defaultValue={phoneNumber} disabled={true}></input>
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row>
                  <Col>
                    Email Id
                    </Col>
                    <Col>
                    <input  type="text" className="form-inputs"  defaultValue={email} disabled={true}></input>
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row>
                  <Col>
                    Password
                    </Col>
                    <Col>
                    <input  type="password" className="form-inputs" disabled={formState} onChange={(event)=>setPassword(event.target.value)}  placeholder="Enter password"></input>
                    </Col>
                    <Col className="errorMsgs">{validatePassword()} 
                    </Col>
                    
                  </Row>
                  <Row>
                    <Col>
                    Confirm Password
                    </Col>
                    <Col>
                    <input type="password" className="form-inputs" disabled={formState} placeholder="Confirm password" onChange={(event)=>setCPassword(event.target.value)}></input>
                    </Col>
                    <Col className="errorMsgs">
                    {checkPasswordMatch()}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    Country
                    </Col>
                    <Col>
                    <select className="form-detail" disabled={formState} onChange={(event)=>setCountry(event.target.value)}>
                                <option defaultValue>{country}</option>
                                <option value="America">America</option>
                                <option value="Australia">Australia</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Canada">Canada</option>
                                <option value="China">China</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Japan">Japan</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Russia">Russia</option>
                                <option value="South Africa">South Africa</option>
                            </select> 
                            </Col>
                            <Col></Col>
                  </Row>
                  <Row>
                <Col>
                <Button type="submit" variant="info"  disabled={formState} onClick={saveForm} className="form-save-btn">
                            Save
                        </Button>
                </Col>
                </Row>
                </div>
              </Row>
            </Col>
          </Row>
          </form>
      </Container>
      </div>
      <Player/>
    </div>
    );
}

export default Profile;
