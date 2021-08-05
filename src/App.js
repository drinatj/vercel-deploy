import React, { useState, useEffect } from "react";
import axios from 'axios'
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import "./App.css";
import Album from './Components/album/index';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';


function App(){
  const [accessToken, setAccessToken] = useState()
  const [searchKeyword, setSearchKeyword] = useState()
  const [trackData, setTrackData] = useState()
  const [isAuthentic, setAuthentic] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState([])

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
              <input type="text" placeholder="Search.." className="search" onChange={handleSetSearchKey} />
              <button className="searchButton" onClick={handleSearchPlaylist}>Search</button>
            </div>
          </div>
          <ul>
            <li><a className="active" href="/">Home</a></li>
            <li><a href="#create">Create Playlist</a></li>
            <li className="logout"><a href="#logout">Logout</a></li>
          </ul>
        </div>
      )
    }
    else{
      return(
        <div className="login">
          <h2>Moosick</h2>
          <Button 
          style={{
            borderRadius: 15,
            backgroundColor: "#dabdbe",
            padding: "10px 25px",
            fontSize: "12px",
            color: "#1B2021",
          }}
          variant="contained" color="primary" onClick={handleLogin}>
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
