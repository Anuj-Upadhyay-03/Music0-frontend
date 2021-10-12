//Author: Neehar Parupalli Ramakrishna
//Created On: 5th June 2021
import React from "react";
import {PlayFill} from "react-bootstrap-icons";
import {Container, Row, Col} from 'react-bootstrap';
import Playlist from "react-mp3-player";
import {NavigationBar} from "../Navigation";
import "../css/Artist.css";
import axios from "axios";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import cookie from "react-cookies";

class Artist extends React.Component {

    constructor(props) {
        super(props);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleError = this.handleError.bind(this);
        this.state = {
            artistImage: {},
            artistName: "",
            albums:[],
            error: "",
            showLoader:true
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        const userId = cookie.load('userId');
        if (userId == undefined) {
            this.props.history.push('/');
        }
        //The API call is placed in ComponentDidMount() function as user input is not required to place the call but rather on page load.
        axios.get("https://csci-5709-musico-backend.herokuapp.com/artist/"+id)
            .then(response => this.handleResponse(response)).catch(error => this.handleError(error));
    }

    handleResponse(response) {
        console.log(response.data);
        //API response is set in state
        if (response.data.message == "Success") {
            this.setState({showLoader:false})
            this.setState({artistImage:response.data.data.artistImage});
            this.setState({artistName:response.data.data.artistName});
            this.setState({albums:response.data.data.albums});
            this.forceUpdate();
        }
    }

    handleError(error) {
        //If the user enters the ID of an artist that does not exist in the database
        this.setState({showLoader:false})
        this.setState({error:"Artist Not Found"});
        this.forceUpdate();
    }

    render() {
        const tracks = [{img:"", name:"Sample", desc:"Sample album", src: ""}];
        const playlistOverideStylingOpts = {
            offset : {
                left:0,
                "background-color": "#0d0d0d",
                opacity: 0.9,
                "color": "#50f2f2",
            },
        };
        const artistImage = this.state.artistImage;
        const artistName = this.state.artistName;
        const albums = this.state.albums;
        const error = this.state.error;
        const showLoader = this.state.showLoader;
        //This part of the code is to render the loader dynamically. The state is updated in API response and the component is force updated.
        if (showLoader == true) {
            return(
                <div className="artist">
                    <NavigationBar/>
                    <div align="center" style={{marginTop:"5%"}}>
                    <Loader
                        type="ThreeDots"
                        color="#50f2f2"
                        height={100}
                        width={100}
                        visible={true}
                    />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="artist">
                    <NavigationBar/>
                    {error == "Artist Not Found" ?
                        <div align="center">
                            <h1 style={{color: "red", marginTop: "2%"}}>{error}</h1>
                        </div>
                        : <div align="center">
                            <img src={artistImage} style={{textAlign: "center", height: "15vw", marginTop: "2%"}}/>
                            <h1 style={{color: "white", marginTop: "2%"}} className="artist-title">{artistName}</h1>
                            <br/>
                            <Container>
                                {albums.map((album, index) => (
                                    <div>
                                        {index % 2 == 0 ?
                                            //This condition has been added to add CSS to every alternate row. I figured the best way to do this would be to check if index is divisible by 2
                                            <Row>
                                                <Col xs={6} md={8}>
                                                    <Link to={`/album/${album.albumId}`}>
                                                        <span style={{color: "#50f2f2"}}>{album.albumName}</span>
                                                    </Link>
                                                </Col>
                                                <Col xs={2} md={2}>
                                                    <Link to={`/album/${album.albumId}`}>
                                                        <PlayFill color="#50f2f2"/>
                                                    </Link>
                                                </Col>
                                                <Col xs={2} md={2}>
                                                    <label style={{color: "white"}}>{album.rating}</label>
                                                </Col>
                                            </Row>
                                            : <Row style={{backgroundColor: "#145259"}}>
                                                <Col xs={6} md={8}>
                                                    <Link to={`/album/${album.albumId}`}>
                                                        <span style={{color: "#50f2f2"}}>{album.albumName}</span>
                                                    </Link>
                                                </Col>
                                                <Col xs={2} md={2}>
                                                    <Link to={`/album/${album.albumId}`}>
                                                        <PlayFill color="#50f2f2"/>
                                                    </Link>
                                                </Col>
                                                <Col xs={2} md={2}>
                                                    <label style={{color: "white"}}>{album.rating}</label>
                                                </Col>
                                            </Row>
                                        }
                                    </div>
                                ))}
                            </Container>
                        </div>
                    }
                    <footer>
                        <Playlist tracks={tracks} opts={playlistOverideStylingOpts}/>
                    </footer>
                </div>
            );
        }
    }
}
export default withRouter(Artist);