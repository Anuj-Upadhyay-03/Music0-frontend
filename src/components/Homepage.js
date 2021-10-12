//Author: Simar Saggu
// Created on: 16th July,2021
import {Component} from "react";
import '../css/Homepage.css';
import axios from 'axios';
import {Col, Container, Row} from "react-bootstrap";
import cookie from "react-cookies";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {ToastContainer} from "react-toastify";

const loginUrl="https://csci-5709-musico-backend.herokuapp.com/login";
const passwordUrl="https://csci-5709-musico-backend.herokuapp.com/forget/password/";

class Homepage extends Component{
    constructor(props) {
        super(props);

        this.state = {
            username : '',
            password : '',
            formLoading: false
        }
    }

    handlePassword =event =>{
        this.setState({
            password : event.target.value
        })
    }

    handleUsername =event =>{
        this.setState({
            username : event.target.value
        })
    }
    handleForgetPassword = event =>{
        var email= prompt("Forgot your password?\n Please enter your registered email Id");
        if (email!=null || email!="")
        {
            axios({
                method:"GET",
                url: passwordUrl+email,  
            }).then(res=>{
                if(res['data']['message']==="sent" && res['data']['statusCode']===200)
                {
                    alert("Password is sent on your registered emailId.")
                    this.props.history.push('/');
                }
                
                else if (res['data']['message']==="user_not_found" && res['data']['statusCode']===404)
                {
                    alert("Entered emailId is not registered with us. Please enter registered emailId")
                    this.props.history.push('/');
                }
                else{
                    alert("You could not recover password due to to server error. Please try again")
                this.props.history.push('/');
                }
    
            }).catch(err=>{
                console.log(err);
                alert("You could not recover password due to to server error. Please try again")
                this.props.history.push('/');
            });
        }
        
    }
    handleLogin = event => {
        event.preventDefault()
        this.setState({formLoading:true})
        axios({
            method:"POST",
            headers: { 
                'Content-type': 'application/json'
            },
            url: loginUrl,  
            data: JSON.stringify({
                "registeredName":this.state.username,
                "password": this.state.password
            })
        }).then(res=>{
            this.setState({formLoading:false})
            if(res['data']['message']==="valid" && res['data']['statusCode']===200)
            {
                cookie.save('userId', res['data']['userId'], {path:'/',maxAge: 1000});
                console.log(cookie.load("userId"));
                this.props.history.push('/welcome');
            }
            else if (res['data']['message']==="invalid" && res['data']['statusCode']===401)
            {
                alert("You have entered Invalid credentials. Please check entered username & password")
                this.props.history.push('/');
            }
            else if (res['data']['message']==="invalid" && res['data']['statusCode']===404)
            {
                alert("Entered username is not registered with us. Please login with registered username")
                this.props.history.push('/');
            }

        }).catch(err=>{
            console.log(err);
            alert("You could not access the website due to server error. Please try again")
            this.props.history.push('/');
        });

    }

    render() {
        return(
            <div className="Homepage">
                <ToastContainer/>
                <div className="heading">
                    <div className="app-name-heading">MusicO</div>
                    <div className="app-tagline-heading">PLAY.FORWARD.REPEAT</div>

                    {/* Referred this package to create loader:https://www.npmjs.com/package/react-loader-spinner */}
                    <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} visible={this.state.formLoading}/>
                </div>
                <div className="loginForm">
                    <Container fluid="lg">
                    
                        <Row className="login-form-field"> 
                            <Col  xs={3} md={3}>
                                <div className="lbl-text">Username:</div>
                            </Col>
                            <Col  xs={9} md={9}>
                                <input type="text" value={this.state.username} onChange={this.handleUsername} placeholder="Enter email/number" required/>
                            </Col>
                        </Row>
                        
                        <Row className="login-form-field">
                            <Col  xs={3} md={3}>
                            <div className="lbl-text">Password:</div>
                            </Col>
                            <Col  xs={9} md={9}>
                                <input type="password" value={this.state.password} onChange={this.handlePassword} placeholder="Enter password" required/>
                            </Col>
                        </Row>
                        
                        <Row className="login-form-field">
                            <Col  xs={5} md={5} className="login-form-field">
                                
                            </Col>
                            <Col  xs={2} md={2} className="login-form-field">
                                <button className="btn btn-info  mr-5" onClick={this.handleLogin}>
                                    Login
                                </button>
                            </Col>
                            <Col  xs={2} md={2} className="login-form-field">
                            <button className="btn btn-info  mr-5" onClick={this.handleForgetPassword}>
                                    Forgot Password?
                            </button>
                                
                            </Col>
                            
                        </Row>
                        <Row className="login-form-field">
                        <Col  xs={7} md={7} >
                            
                        </Col>
                        <Col  xs={3} md={3} >
                        <div className="lbl-text">New user?</div>
                        </Col>
                        <Col  xs={2} md={2} >
                        <button className="btn btn-info" onClick={event=>this.props.history.push('/register')}>
                        Register
                        </button>
                        </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}
export default Homepage;
