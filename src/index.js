import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import StarRating from "./StarRating";

function Test(){

  const[movieRating,setMovieRating]=useState(0);
 return( <div>
   <StarRating color="Blue" onSetRating={setMovieRating}/>
   <p>This Movie was rated {movieRating}</p>
 </div>)
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} messages={["Terrbile","Bad","Okay","Good","Awesome"]} />
    <StarRating maxRating={5} color="orange"  className="test" defaultRating={3} />
    <Test/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
