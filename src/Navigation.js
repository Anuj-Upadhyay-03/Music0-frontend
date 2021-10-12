import React,{useState} from 'react';
import { Nav, Navbar, Form, FormControl,InputGroup,FormGroup } from 'react-bootstrap';
import styled from 'styled-components';
import cookie from "react-cookies";
import { useHistory  } from "react-router-dom";



const Styles = styled.div`
    .navbar { background-color: #011526; }
a, .navbar-nav, .navbar-light .nav-link {
    color: #50f2f2;
&:hover { color: white; }
}
.navbar-brand {
    font-size: 1.4em;
    color: #50f2f2;
&:hover { color: white; }
}
.form-center {
    position: absolute;
    left: 25%;
    right: 25%;
}
.app-name-heading{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-left: 2%;
    font-size: 3vw;
    /*Font taken from:https://fonts.google.com/*/
    font-family: Monoton;
    color:whitesmoke;
  }
`;

export const NavigationBar = () =>{
    let history = useHistory();
    const [searchText,setSearchText] = useState('');
    const profile=()=>{
        //Referred this package for cookies
        //https://www.npmjs.com/package/react-cookies
        history.push("/profile/"+cookie.load("userId"))
    }
    const logout =()=>{
        //Referred this package for cookies
        //https://www.npmjs.com/package/react-cookies
        cookie.remove("userId", {path: "/"});
        console.log(cookie.load("userId"))
        history.push("/")
    }

    const showSearchResults = target => {
        if(target.key === 'Enter'){
            // console.log(searchText);
            history.push({
                pathname:'/search',
                state: {searchText:searchText }
            });
        }        
    }
return (
    <Styles>
        <Navbar expand="lg" >
            <Navbar.Brand className="app-name-heading" href="/welcome">Musico</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">                    
                    <Navbar.Brand href="/Friends">Friends</Navbar.Brand>
                    <Navbar.Brand href="/playlist">Playlists</Navbar.Brand>
                    <FormGroup className="form-center">
                        <InputGroup>
                            <FormControl type="text" placeholder="Search" className="" onChange={(e)=>setSearchText(e.target.value)} onKeyPress={showSearchResults}/>
                        </InputGroup>
                    </FormGroup>
                    <Navbar.Brand onClick={profile}>Profile</Navbar.Brand>
                    <Navbar.Brand  onClick={logout}>Logout</Navbar.Brand>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </Styles>
)
}
