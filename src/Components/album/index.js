const Album = (props)=>{
    return(
        <div>
            <div className="container1">
            <img src={props.images} alt="Bohemian" className="gambar"/>
            <p className="albumName">{props.name}</p>
            <p>{props.artists}</p>
            <button type="button"  className="button">Select</button>
            </div>
        </div>
    )
};

export default Album;