export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
export const redirectUri = "http://localhost:3000/";
export const scopes = "playlist-modify-private";
