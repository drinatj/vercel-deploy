import React from "react";
import '../../App.css';

const Album = ({images, name, artists, isSelected, onSelect })=>{
    return(
        <div>
            <div className="container1">
            <img src={images} alt="Bohemian" className="gambar"/>
            <p className="albumName">{name}</p>
            <p>{artists}</p>
            <button className="button" onClick={onSelect}>{isSelected ? "Deselect" : "Select"}</button>
            </div>
        </div>
    )
};

export default Album;