import { useEffect,useState } from "react";



const KEY = "ac84841c";
export function useMovieState(query){


    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {

        
          const controller = new AbortController();
          async function fetchMovies() {
            try {
              setIsLoading(true);
              setError("");
              const res = await fetch(
                `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                { signal: controller.signal }
              );
              if (!res.ok)
                throw new Error("Something went wrong while fetching data");
              const data = await res.json();
              if (data.Response === "False") throw new Error("Movie not found");
              setMovies(data.Search);
              setError("");
              setIsLoading(false);
            } catch (err) {
              console.log(err.message);
              if (err.name !== "AbortError") setError(err.message);
            }
          }
    
          if (!query.length) {
            setMovies([]);
            setError("");
            return;
          }
        //   handleCloseMovie();
          fetchMovies();
    
          return function () {
            controller.abort();
          };
        },
        [query]
      );


      return {movies,isLoading,error}
}