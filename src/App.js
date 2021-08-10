import React, { useState, useEffect } from "react";
import axios from 'axios'
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import "./App.css";
import Album from './Components/album/index';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import {Button } from '@material-ui/core';
import {useStyles} from './Components/material-ui/custom-ui';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

function App(){
  const [accessToken, setAccessToken] = useState()
  const [searchKeyword, setSearchKeyword] = useState()
  const [trackData, setTrackData] = useState()
  const [isAuthentic, setAuthentic] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState([])
  const classes = useStyles();

  const getParamsFromUrl = (hash) => {
    const stringAfterHashtag = hash.substring(1)
    const paramsInUrl = stringAfterHashtag.split("&")
    const paramsSplitUp = paramsInUrl.reduce((acc, currentVal) => {
      const [key, value] = currentVal.split("=")
      acc[key] = value
      return acc
    }, {})
    return paramsSplitUp
  }

  const handleLogin = () => {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
  }


  //cek dah masuk apa belom
  const renderAuthenticBtn = () => {
    if (isAuthentic){
      return (
        <div >
          <div className="navBar">
            <h1 className="navBrand">Moosick</h1>
            <div className="searchContainer">
              <Paper component="form" className={classes.root}>
                <InputBase
                  onChange={handleSetSearchKey} 
                  className={classes.input}
                  placeholder="Search"
                />
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick={handleSearchPlaylist}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </div>
          </div>
          <ul>
            <li><a className="active" href="./create-playlist">Home</a></li>
            <li><a href="#create">Create Playlist</a></li>
            <li className="logout"><a href="/">Logout</a></li>
          </ul>
        </div>
      )
    }
    else{
      return(
        <div className="login">
          <h2>Moosick</h2>
          <Button className={classes.buttonLogin} variant="contained" onClick={handleLogin}>
          Login
          </Button>
        </div>
      )
    }
  }

  const handleKeySpace = (keyword) => {
    const keywordString = keyword.replace(" ","+")
    return keywordString
  }

  const handleSetSearchKey = (e) => {
    setSearchKeyword(handleKeySpace(e.target.value))
  }

  const handleSearchPlaylist = async () => {
    await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        'Authorization' : `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      params: {
        api_key: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        q: searchKeyword,
        type: "track",
        limit: 12
      },
    })
    .then((res) => {
      setTrackData(res.data.tracks.items)
    })
  }

  const handleSelectTrack = (trackData) => {
    if (selectedTrack.includes(trackData)) {
      setSelectedTrack([
        ...selectedTrack.filter((uri) => uri !== trackData),
      ]);
    }else {
      setSelectedTrack([...selectedTrack, trackData]);
    }
  }

  const renderShowTracksPage = () => {
    if (isAuthentic){
      let renderShowPage = (
        <div>
          <div>
            <div className="cont-lagu">
              {trackData && 
              trackData.map((track) => {
                return(
                  <Album key={track.id} images={track.album.images[1].url} name={track.name} artists={track.artists[0].name}
                  isSelected={selectedTrack.includes(track.uri)}
                  onSelect={() => handleSelectTrack(track.uri)}
                 />
                )
              })}
            </div>
          </div>
        </div>
      )
      return renderShowPage
    }
  }

  //ambil token
  useEffect(() => {
    if (window.location.hash) {
      const {access_token} = getParamsFromUrl(window.location.hash)
      setAccessToken(access_token)
    }
    if (accessToken){
      setAuthentic(true)
    }
  }, [accessToken])

  return(
    <Router>
      <Switch>
      <Route path="/create-playlist">
        {isAuthentic ? (
          <></>
        ) : (
          <Redirect to="/"/>
        )}
        </Route>
        <Route path="/">
        {renderAuthenticBtn()}
        {renderShowTracksPage()}
        
        </Route>
      </Switch>
    </Router>
  )
}
export default App;
