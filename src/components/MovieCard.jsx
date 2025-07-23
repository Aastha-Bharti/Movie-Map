import React from 'react'
import Star from '../assets/star.svg'
import noPoster from '../assets/No-Poster.png'

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <div className="bg-[#121212] p-4 rounded-2xl shadow-lg transition-transform hover:scale-105">
      <img
        className="w-full h-80 object-cover rounded-xl"
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : noPoster}
        alt={title}
      />

      <div className="mt-4 text-white">
        <h3 className="text-lg font-semibold truncate">{title}</h3>

        <div className="flex items-center gap-2 mt-1 text-sm opacity-80">
          <div className="flex items-center gap-1">
            <img src={Star} className="w-4 h-4" alt="star icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p>{original_language?.toUpperCase()}</p>
          <span>•</span>
          <p>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
