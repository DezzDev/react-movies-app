import { useEffect, useState } from "react"
import { useDebounce } from "react-use";
import Search from "./components/Search"
import { Movie } from "./types/movie";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "get",
  headers: {
    "accept": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debounceSearchTerm , setDebounceSearchTerm ] = useState("")
  
  // Debounce the search term to prevent making too many requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => {
    setDebounceSearchTerm(searchTerm)
  }, 500, [searchTerm])

  const fetchMovies = async (query="") => {
    setIsLoading(true)
    setErrorMessage("")
    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error("Failed to fetch movies")
      }
      const data = await response.json()

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Error fetching movies.")
        setMovieList([])
        return;
      }

      setMovieList(data.results || [])

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.")

    }finally{
      setTimeout(() => {
        setIsLoading(false)
        
      }, 2000);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm)


  }, [debounceSearchTerm])
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">Popular</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie:Movie) =>(
                <MovieCard
                  key={movie.id}
                  movie={{
                    title: movie.title,
                    vote_average: movie.vote_average,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    original_language: movie.original_language}}
                />
              ))}
            </ul>
          )
          }
        </section>
      </div>

    </main>
  )
}

export default App
