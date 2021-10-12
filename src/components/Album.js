//Author:Venkata Kanakayya Prashant Vadlamani
//Created On: 21 June 2021
import {NavigationBar} from "../Navigation";
import {Col, Container, Row} from "react-bootstrap";
import Playlist from "react-mp3-player";
import '../css/Album.css';
import {Component} from "react";
import axios from "axios";
import {PlayFill} from "react-bootstrap-icons";
import {RangeStepInput} from 'react-range-step-input';
import cookie from "react-cookies";
import Loader from "react-loader-spinner";
import {Notify} from "./Notify";
import {ToastContainer} from "react-toastify";

const playlistOverideStylingOpts = {
    offset : {
        left : 0,
        "background-color": "black",
        opacity: 0.9,
        "color": "#50f2f2",
    },
};

class Album extends Component{
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            album_name: '',
            artist_name : '',
            cover : '',
            tracks_list : [],
            rating : 0,
            tracks :[{ img: '', name:'', desc: '', src:''}],
            random : -1,
            modalOpen : false,
            showLoader : true
        }

    }

    handleResponse(response){
        if(response.data.status === true){
            this.setState({showLoader:false})
            this.forceUpdate()
            console.log(response)
        }
    }

    handleRating= event => {
        event.preventDefault()
        let userid = cookie.load("userId")
        console.log(userid)
        const album_rating = {
            rating: this.state.rating,
            album_name: this.state.album_name,
            userid : userid
        }

        const headers = {
            'Content-type': 'application/json'
        }
        console.log(album_rating)
        let url = "https://csci-5709-musico-backend.herokuapp.com/album/"+this.state.id

        axios.post(url, album_rating,{headers}).then(response =>
            this.handleResponse(response));
        Notify("Rating submitted!",false);
    }

    handlePlaySong= (track_no) => {
        console.log(track_no)
        console.log(this.state.tracks_list[track_no-1].track_name)
        this.setState({tracks : [{ img: this.state.cover, name:this.state.tracks_list[track_no-1].track_name, desc: this.state.artist_name, src:this.state.tracks_list[track_no-1].track_source}]})
    }

    handleShufflePlay= event => {
        event.preventDefault()
        this.state.tracks.length = 0
        for(let i=0;i<this.state.tracks_list.length;i++){
            this.state.tracks.push({ img: this.state.cover, name:this.state.tracks_list[i].track_name, desc: this.state.artist_name, src:this.state.tracks_list[i].track_source})
        }
        this.setState({tracks : this.state.tracks})
        for(let i=0;i<this.state.tracks.length;i++){
            const random = Math.floor(Math.random() * i);
            let temp = this.state.tracks[i]
            this.state.tracks[i] = this.state.tracks[random]
            this.state.tracks[random] = temp
        }
        console.log(this.state.tracks)
    }

    handlePlayAll= event => {
        event.preventDefault()
        this.state.tracks.length = 0
        for(let i=0;i<this.state.tracks_list.length;i++){
            this.state.tracks.push({ img: this.state.cover, name:this.state.tracks_list[i].track_name, desc: this.state.artist_name, src:this.state.tracks_list[i].track_source})
        }
        console.log(this.state.tracks)
        this.setState({tracks : this.state.tracks})
    }

    componentDidMount() {
        const userId = cookie.load('userId');
        if (userId == undefined) {
            this.props.history.push('/');
        }
        else{
            axios.get(`https://csci-5709-musico-backend.herokuapp.com/album/${this.state.id}`).then(response=>{
                this.setState({album_name: response.data.data.albumName});
                this.setState({artist_name: response.data.data.artistName});
                this.setState({cover: response.data.data.albumImage});
                this.setState({tracks_list:response.data.data.songs});
                this.setState({showLoader : false});
                console.log(this.state.tracks_list.length)
            });
        }
    }

    handleError(){
        Notify('invalid error',true)
    }

    onChange(e) {
        const newVal = e.target.value;
        this.setState({rating: newVal});
    }

    render() {
        if (this.state.showLoader === true) {
            return(
                <div className="Albumpage">
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
        }
        else {
            return (
                <div className="Albumpage">
                    <NavigationBar/>
                    <div class="details">
                        <div className="albumdetails">
                            <img className="albumimage" src={this.state.cover}/>
                            <h3>{this.state.album_name}</h3>
                        </div>
                        <div className="artistalbum">
                            <p>{this.state.artist_name}</p>
                        </div>
                        <ToastContainer/>
                    </div>
                    <div class="albumsongs">
                        <div className="mt-5">
                            <button className="btn btn-dark mr-5" onClick={this.handlePlayAll}>
                                Play All
                            </button>
                            <button className="btn btn-dark mr-5" onClick={this.handleShufflePlay}>
                                Shuffle Play
                            </button>
                            <RangeStepInput
                                min={0} max={5}
                                value={this.state.rating} step={1}
                                onChange={this.onChange.bind(this)}
                            />
                            {this.state.rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn btn-dark" onClick={this.handleRating}>
                                Rate Album
                            </button>
                        </div>
                        <br></br>
                        <Container fluid="md">
                            <Row className="heading">
                                <Col>#</Col>
                                <Col>SongName</Col>
                                <Col>Play</Col>
                            </Row>
                            {this.state.tracks_list.map(song => (
                                song.track_no % 2 === 0 ?
                                    <Row>
                                        <Col>{song.track_no}</Col>
                                        <Col>{song.track_name}</Col>
                                        <Col>
                                            <a className="play" onClick={() => this.handlePlaySong(song.track_no)}>
                                                <PlayFill color="#50f2f2"/></a>
                                        </Col>
                                    </Row> :
                                    <Row className="striped">
                                        <Col>{song.track_no}</Col>
                                        <Col>{song.track_name}</Col>
                                        <Col>
                                            <a className="play" onClick={() => this.handlePlaySong(song.track_no)}>
                                                <PlayFill color="#50f2f2"/></a>
                                        </Col>
                                    </Row>
                            ))}
                        </Container>
                    </div>
                    <footer>
                        <Playlist tracks={this.state.tracks} opts={playlistOverideStylingOpts}/>
                    </footer>
                </div>
            )
        }
    }
}

export default Album;