import React, { useEffect, useState } from 'react'
import heroImg from './assets/hero-img.png'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'
import { useDebounce } from 'use-debounce'
import SkeletonCard from './components/SkeletonCard.jsx'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_OPTIONS = {
  method : "GET",
  headers : {
    accept : 'application/json',
    Authorization : `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm,setSearchTerm] = useState('')
  const [errorMessage,setErrorMessage] = useState('')
  const [movieList,setMovieList]= useState([])
  const [isLoading, setisLoading] = useState(false)
  const [trendingMovies, setTrendingMovies] = useState('')

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  
  const fetchMovies = async(query = '') => {
    setisLoading(true)
    setErrorMessage('')

    try {
      const endpoint = query ? 
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok){
        throw new Error('Failed to fetch movies') 
      }

      const data = await response.json()
      console.log(data)

      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([])
        return
      }
      
      setMovieList(data.results || [])
      
      if(query && data.results.length > 0){
        await updateSearchCount(query,data.results[0])
      }
    } catch (error) {
      console.error("Error fetching")
      setErrorMessage('Error fetching movies.Please try again later.')
    }finally{
      setisLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
      
    } catch (error) {
      console.error(`Error fetching trending movies : ${error}`)  
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      fetchMovies(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchMovies()         // Only once, for popular movies
    loadTrendingMovies()  // Only once, for trending
  }, [])
  
  return (
    <main>
      <div className="pattern" />
     
      <div className="wrapper">

        <header className="flex flex-col items-center text-center mt-[-3rem] sm:mt-[-5rem]">
          <img src={heroImg} alt="hero" className="w-[220px] sm:w-[300px]" />
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white leading-tight">
            Find <span className='text-gradient'>Movies</span> You'll Enjoy <br /> Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map( (movie,idx) => (
                <li key = {movie.$id}>
                  <p>{idx+1}</p>
                  <img src={movie.poster_url} alt={movie.title}></img>
                </li>
              ))}
            </ul>
          </section>
        )}
        
        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={idx} />
            ))}
          </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        </section>
      
      
      </div>
    </main>
  )
}

export default App