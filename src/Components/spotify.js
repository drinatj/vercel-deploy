import { Component } from 'react'

class Spotify extends Component{

  constructor(props){
    super(props);
    this.state = {
      search: '',
      data: [],
    };
  };

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    })
  }

  handleClick =  async () =>{
    const link = 'https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_KEY}&q={this.state.search}&limit=12';
    const result = await fetch(link);
    const gifs = await result.json();

    this.setState({
      data: gifs.data,
    })
  }

  render(){
    return(
      <div>
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
      </div>
    );
  }
}

export default Spotify;