import React, { useState, useEffect } from "react";
// import * as $ from "jquery";
import axios from 'axios'
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
// import hash from "./hash";
// import Player from "./Player";
import "./App.css";
import Album from './Components/album/index';

function App(){
  const [accessToken, setAccessToken] = useState()
  const [searchKeyword, setSearchKeyword] = useState()
  const [trackData, setTrackData] = useState()
  const [isAuthentic, setAuthentic] = useState(false)

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
        <div className="navbar">
          <h1 className="navBrand">Moosick</h1>
          <a href="/">Create Playlist</a>
        </div>
      )
    }
    else{
      return(
        <div className="login">
          <h2>Moosick</h2>
          <button className="buttonLogin" onClick={handleLogin}>Login</button>
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

  const renderShowTracksPage = () => {
    if (isAuthentic){
      let renderShowPage = (
        <div>
          <div>
            <div className="searchContainer">
            <input type="text" placeholder="Search.." className="search" onChange={handleSetSearchKey} />
            <button className="searchButton" onClick={handleSearchPlaylist}>Search</button>
            </div>
            <div className="cont-lagu">
              {trackData && trackData.map((track, index) => {
                return(
                  <Album key={track.id} images={track.album.images[1].url} name={track.name} artists={track.artists[0].name}/>
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
    <div>
      {renderAuthenticBtn()}
      {renderShowTracksPage()}
    </div>
  )
}
export default App;
