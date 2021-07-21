import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
// import Player from "./Player";
import "./App.css";
import { Redirect } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      search: '',
      data: [],
    };

    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.tick = this.tick.bind(this);
  }

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    })
  }

  handleClick =  async () =>{
    const link = `https://api.spotify.com/v1/search?api_key=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&q=${this.state.search}&limit=12`;
    const result = await fetch(link);
    const gifs = await result.json();

    this.setState({
      data: gifs.data,
    })
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
    }

    // set interval for polling every 5 seconds
    this.interval = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.token) {
      this.getCurrentlyPlaying(this.state.token);
    }
  }


  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/search",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="login">
        {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && !this.state.no_data && (
            <div>
            <input type="text" onChange={this.handleSearch} />
            <button onClick={this.handleClick}>Search</button>
            {
              this.state.data
                .map(gif => {
                  return(
                    <img src={gif.images.original.url} alt="" key={gif.id} width="100"/>
                  );
                })
            }
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
