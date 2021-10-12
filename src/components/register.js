//Author: Simar Saggu
// Created on: 16th July,2021
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,  Container,Col, Row} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import '../css/register.css';
import imgHolder from '../images/imgHolderFemale.png';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { base64StringToBlob } from 'blob-util';
import imageToBase64 from 'image-to-base64/browser';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Notify} from "./Notify";
import {ToastContainer} from "react-toastify";


const registerUrl="https://csci-5709-musico-backend.herokuapp.com/register";
const Register =()=>{

    let history = useHistory();

    const [ name, setName] = useState('');
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const [country,setCountry]=useState('');
    const [ confirmPassword, setConfirmPassword] = useState('');
    const [ phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    var nameValid = false;
    var numberValid = false;
    var emailValid = false;
    var passwordValid = false;
    var passwordMatch = false;
    var fieldsValidated;

    // Referred this package to convert image to base64
  //https://www.npmjs.com/package/image-to-base64
    const checkImg=()=>{
        if(image.length===0)
        {
            imageToBase64(imgHolder).then(res=>{console.log(res);setImage(res);}) 
        }
      }
    
    const validateName = () => {
        var regex = /[a-zA-Z]+\s+[a-zA-Z]+$/;
        if(name===""){
            nameValid= false;
            return "E.g.,John Doe";
        }
        if(!name.match(regex)){
            nameValid =false;
            return "Invalid name";
        }
        nameValid=true;
        return "Looks good!";  
    }
    const validatePhoneNumber = () =>{
        var regex = /^[0-9]+$/;
        if (phoneNumber===""){
            numberValid=false;
            return "Number with area code";
        }
        if(phoneNumber.length < 10){
            numberValid=false;
            return "Cannot be less than 10 digits";
        }
        if(!phoneNumber.match(regex)){
            numberValid=false;
            return "Invalid number";
        }
        numberValid=true;
        return "Looks good!";

    } 
    const validatEmail = () => {
        var emailReg = /^[a-zA-z0-9_.]+@[a-zA-z0-9_]+\.(com|info|in|co|org|aus|ca|us|net)/;
        if(email===""){
            emailValid=false;
            return "e.g., george.kv_25@outlook.com";
        }
        if(!email.match(emailReg)){
            emailValid=false;
            return "Invalid email format";
        }
        emailValid=true;
        return "Looks good!";
    }

    const validatePassword= () => {
        var regex = /^[a-zA-Z0-9!@#$%^&*()]+$/;
        if(password===""){
            passwordValid=false;
            return "Only:A-z,a-z,!,@,#,$,%,^,&,*,(,)";
        }
        if (password.length < 8 || password.length > 15){
            passwordValid=false;
            return "Password length should be between 8 to 15";
        }
        if (!password.match(regex)){
            passwordValid=false;
            return "Invalid Password";
        }
        passwordValid=true;
        return "Looks good!";
    }

    const checkPasswordMatch = ()=>{
        if(confirmPassword===""){
            return "Confirm your password";
        }
        if (password !== confirmPassword){
            passwordMatch=false;
            return "Passwords don't match";
        }
        passwordMatch=true;
        return "Looks,good!";
    }
   

    const checkFieldFilled = () => {
        fieldsValidated = nameValid && numberValid && emailValid && passwordMatch && passwordValid;
        return !fieldsValidated;   
    }
    
    let data={
        "email" : email,
        "name": name,
        "country": country,
        "password": password,
        "phoneNumber":phoneNumber,
        "profileImage":image
    }

    async function callApi(){
        setFormLoading(true);
        console.log(data);
        await axios({
            method: "POST",
            headers: { 
              'Content-type': 'application/json'
            },
            data:JSON.stringify(data),
            url: registerUrl
        })
        .then(res=>{
            setFormLoading(false);
            if(res['data']['message']==="Success" && res['data']['statusCode']===200){
                // <Modal text="You have been registered with us. Welcome to musicO" />
                alert("You have been registered with us. Welcome to musicO")
                history.push("/")
            }
            else if(res['data']['message']==="Failed" && res['data']['statusCode']===403){
                alert("You are already registered with us. Login using registered email Id/phone number")
                history.push("/")
            }
            else if(res['data']['message']==="Failed" && res['data']['statusCode']===500){
                alert("You could not be registered with us due to server error")
                history.push("/register")   
            }
            else{
                alert("You could not be registered with us due to idk error")
                history.push("/register")   
            }    
        }).catch(err=>{
            setFormLoading(false);
            console.log("err"+err);
                alert("You could not be registered with us")
                history.push("/register")
                console.log(err);
        });
    }    
     const handleSubmit=(e)=>{
        e.preventDefault();
        if (fieldsValidated)
        {
            callApi(); 
        }
    }
    
    useEffect(() => {
        checkImg();
    });

    // Referred this package to convert image to base64
  //https://www.npmjs.com/package/image-to-base64
    const convertImageBytes=(event)=>{
        var file = event.target.files[0];
        imageToBase64(URL.createObjectURL(file)) 
        .then((response) => {
            console.log(response); 
            setImage(response);
        })
        .catch((error) => {
            console.log(error); 
        })
    }
   
    return(
        <div className='form-container'>
            <ToastContainer/>
            <Container fluid>
                <header>
                <div className="register-header">Register With Us!</div>
                </header>
                
              {/* Referred this package to create loader:https://www.npmjs.com/package/react-loader-spinner */}
                <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} visible={formLoading}/>
                <form method="post">
                    <Row className="profile-row">
                        <div className="profile-img-ctnrs">
                            <div className="img-holder">
                                <img src={URL.createObjectURL(base64StringToBlob(image, "image/png"))} className="img"/>
                            </div>
                            <input type="file" name="profile" accept="image/*" id="input-img" max-file-size="500000" onChange={(event)=>{ convertImageBytes(event);  }} />
                            <label htmlFor="input-img" name="profile">
                                <img src="https://img.icons8.com/metro/20/ffffff/upload.png"/>
                            </label>
                            <small>   Max size 500MB</small>
                        </div>
                        </Row>      
                        <Row>
                        <Col md={6}>
                        <Row >
                            <input type="text" className="form-control" onChange={(event)=>setName(event.target.value)} id="nameId" name="name" placeholder="Enter full name"></input>
                            <div className="errorMsg">
                                {validateName()} 
                            </div>
                        </Row>
                        <Row>
                            <input type="text"  className="form-control" onChange={(event)=>setPhoneNumber(event.target.value)} id="numberId" name="number" placeholder="Enter phone number"></input>
                            <div className="errorMsg">
                                {validatePhoneNumber()} 
                            </div>
                        </Row>
                        <Row>
                            <input type="text" className="form-control" onChange={(event)=>setEmail(event.target.value)} id="email-id" name="email" placeholder="Enter email"></input>
                            <div className="errorMsg">
                                {validatEmail()}
                            </div> 
                        </Row>
                        </Col>
                        <Col md={6}>
                        <Row>
                            <input type="password" className="form-control" onChange={(event)=>setPassword(event.target.value)} id="password-id" name="password" placeholder="Enter password"></input>
                            <div className="errorMsg">
                                {validatePassword()} 
                            </div>
                        </Row>
                        <Row>
                            <input type="password" className="form-control" onChange={(event)=>setConfirmPassword(event.target.value)} id="confirm-password-id" name="confirmPassword" placeholder="Confirm password"></input>
                            <div className="errorMsg">
                                {checkPasswordMatch()}
                            </div>
                        </Row>
                        <Row> 
                            <select className="form-control" onSelect={(event)=>{
                                setCountry(event.target.value)
                            }}>
                                <option defaultValue>select your country</option>
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
                        </Row>
                        </Col>
                        <Button type="submit" id="form-reg-btn"  onClick={handleSubmit}  disabled={checkFieldFilled()} className="form-reg-btn" >
                            Register
                        </Button>
                    </Row> 
                </form>
        </Container>
    </div>
    )
}
export default Register;