import { useState,useEffect } from "react";

export function useLocalStorageHook(intialState,key) {
  const [value, setValue] = useState(function () {
    const storedvalue = localStorage.getItem(key);
    console.log(storedvalue)
    return storedvalue?JSON.parse(storedvalue):intialState;
  });

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value));
    },
    [value,key]
  );
  return [value,setValue]
}
