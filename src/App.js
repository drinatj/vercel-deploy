// import logo from './logo.svg';
import './App.css';
import data from './data/dataspotify.js';
import Album from './Components/album/index';
import Search from './Components/search/index';
import listlagu from './data/listspotify';
// import axios from "axios";

function App() {
  // console.log(process.env.REACT_APP_GIPHY_KEY);
  return (
    <div className="container">
      <Search />
      <div className="cont-lagu">
      {listlagu.map((lagu, index) => (
      <div key={index}>
        <Album images={lagu.album.images[1].url} name={lagu.album.name} artists={lagu.artists[0].name}/>
          {/* <img src={lagu.album.images[1].url} alt=""/> */}
      </div>
      ))}
      </div>
    </div>
  );
}

export default App;
