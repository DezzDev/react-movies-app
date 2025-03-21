import { Dispatch, SetStateAction } from "react";

interface SearchProps {
  searchTerm: string,
  setSearchTerm: Dispatch<SetStateAction<string>>
}

function Search({ searchTerm, setSearchTerm }: SearchProps) {

  console.log(searchTerm);
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search icon" />
        <input 
          type="text" 
          placeholder="Search for a movie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search