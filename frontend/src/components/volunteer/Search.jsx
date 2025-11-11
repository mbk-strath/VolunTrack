import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import React from "react";

function Search({ onSearch, onFilter }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="search"
      />
      <button onClick={handleSearch}>
        <FaSearch />
      </button>
      <button onClick={onFilter}>
        <FaFilter />
      </button>
    </div>
  );
}

export default Search;
