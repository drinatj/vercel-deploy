import React from "react";
const Search = ()=>{
    return(
        <div>
        <div className="searchContainer">
        <input type="text" placeholder="Search.." className="search" />
        <button type="submit" className="searchButton">Search</button>
        </div>
        </div>
    )
};
export default Search;