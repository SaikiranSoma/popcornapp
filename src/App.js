import { useEffect, useRef, useState } from "react";
import "./App.css";
import StarRating from "./StarRating";
import { useLocalStorageHook } from "./useLocalStorageHook";
import { useMovieState } from "./useMovieState";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "ac84841c";
export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovieState(query, handleCloseMovie);
  const [selectId, setSelectId] = useState(null);

const[watched,setWatched]=useLocalStorageHook([],"watched");
  /*
  useEffect(function(){
    console.log("After intital render")
  },[])


  useEffect(function(){
    console.log("after every render")
  })

  useEffect(function(){
    console.log("D")
  },[query]);


    console.log("during render")
 
*/

  function handleSelectMovie(id) {
    setSelectId((selectId) => (id === selectId ? null : id));
  }

  function handleCloseMovie() {
    setSelectId(null);
  }

  function handleWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("Watched",JSON.stringify([...watched, movie]));  adding to localstorage using event handler
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

 

  return (
    //here we used component composition instead of passing as props to children components use component inside the component
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loading /> : <MovieList movies={movies} />}  */}
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectId ? (
            <MovieDetails
              selectId={selectId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteMovie={handleDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚫</span>
      {message}
    </p>
  );
}

function Loading() {
  return (
    <div>
      <p className="loader">Loading the movies</p>
    </div>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEle = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEle) return;

        if (e.code === "Enter") {
          inputEle.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [setQuery]
  );

  // useEffect(function(){
  //       const el=document.querySelector(".search");
  //       console.log(el +" has clicked ");
  //       el.focus();
  // },[])

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEle}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
/*
function WatchedBox() {
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </>
      )}
    </div>
  );
}

*/

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setmovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: realeased,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  /*eslint-disable*/
  // const isTop=imdbRating>1;
  // console.log(isTop)

  // const [avgRating,setAvgRating]=useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecission: countRef.current,
    };
    onAddWatched(newWatchedMovie);

    // setAvgRating(()=>Number(imdbRating))
    onCloseMovie();
  }

  console.log(title, year);
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`
        );
        const data = await res.json();
        setmovie(data);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "ShowTime🎬";
        // console.log(`Clean up for the movie ${title}`);
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
          // console.log("Movie is closing!");
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {realeased} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>

          <section>
            {!isWatched ? (
              <>
                <StarRating
                  maxRating={10}
                  size={24}
                  color={"orange"}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button onClick={handleAdd} className="btn-add">
                    Add to the watch list
                  </button>
                )}
              </>
            ) : (
              <p>You already rated this movie {watchedUserRating} </p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchMovie
          movie={movie}
          key={movie.Title}
          onDeleteMovie={onDeleteMovie}
        />
      ))}
    </ul>
  );
}

function WatchMovie({ movie, onDeleteMovie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteMovie(movie.imdbID)}
        >
          ❌
        </button>
      </div>
    </li>
  );
}
