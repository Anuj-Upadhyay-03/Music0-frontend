import {BrowserRouter as Router, Route, Switch, useHistory, useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Album from './components/Album';
import Homepage from "./components/Homepage";

import Playlist from "./components/PlaylistPage";
import FriendPlaylist from "./components/FriendPlaylist";

import Artist from "./components/Artist";
import Search from "./components/Search";
import Friends from "./components/Friends";

import Welcome from "./components/Welcomepage";

import Profile from "./components/Profile";
import Grid from "./components/registerGrid";
import cookie from "react-cookies";

import NotFound from './components/Notfound';

function App() {
    
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/playlist" component={Playlist}/>
                    <Route exact path="/friendsplaylist" component={FriendPlaylist}/>
                    <Route exact path="/album/:id" component={Album}/>
                    <Route exact path="/Friends" component={Friends}/>
                    <Route exact path="/artist/:id" component={Artist}/>
                    <Route exact path="/search" component={Search}/>
                    <Route exact path="/welcome" component={Welcome}/>
                    <Route exact path="/" component={Homepage}/>
                    <Route exact path="/register" component={Grid}/>
                    <Route path="/profile/:userId">
                    <Profile/>
                    </Route>
                    <Route exact path="/error">
                        <NotFound></NotFound>
                    </Route>
                </Switch>
            </Router>
        </div>)
}
export default App;
