//Author: Fenil Shah
//Created on: 21st June,2021
import React,{useEffect, useState} from 'react';
import {DropdownButton,Dropdown,FormControl} from 'react-bootstrap';
import { PlusSquare,PlusSquareFill } from "react-bootstrap-icons";

const AddtoPlaylistMenu = (props) => {
    // let lists = [list.list]
    const [playlists,setPlaylists] = useState([]);
    const [userId,setUserId] = useState('');
    const [trackId,setTrackId] = useState('');

    useEffect(()=>{
        setPlaylists(props.list);
        setUserId(props.userId);
        setTrackId(props.trackId);
        console.log(playlists,"  ",userId,"  ",trackId)
    },[]);

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children}
        </a>
      ));

      const CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
          const [value, setValue] = useState('');
      
          return (
            <div
              ref={ref}
              style={style}
              className={className}
              aria-labelledby={labeledBy}
            >
              <FormControl
                autoFocus
                className="mx-3 my-2 w-auto"
                placeholder="Type to filter..."
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
              <ul className="list-unstyled">
                {React.Children.toArray(children).filter(
                  (child) =>
                    !value || child.props.children.toLowerCase().startsWith(value),
                )}
              </ul>
            </div>
          );
        },
      );

    return(
        <div>
            <Dropdown drop="down" style={{ marginLeft: '0.75rem' }}>
                <Dropdown.Toggle as={CustomToggle} id="test">
                    <PlusSquareFill color="black" size={20} />
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}>
                    { playlists.map((r)=>{
                    return(
                        <Dropdown.Item eventKey={r.playlist_id} onClick={()=>{props.addtoPlaylist(trackId,r.playlist_id,r.playlist_name)}}>{r.playlist_name}</Dropdown.Item>
                    )
                    })}
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey='newPlaylist' onClick={()=>{props.createNewPlaylist()}}>Create a new Playlist</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            
        </div>
    )


}


export default AddtoPlaylistMenu;