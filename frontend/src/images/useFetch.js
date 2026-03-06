import { useState, useEffect } from "react";

export function useFetch(url) {
  const [imageData, _setImageData] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorDuringFetch, setErrorDuringFetch] = useState("");

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(url);
        // If response is an error (ie., not okay throw error)
        if (!response.ok) {
          throw new Error(
            `Error: HTTP ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();
        _setImageData(result);
      } catch (error) {
        console.error(error.message);
        setErrorDuringFetch(error.message);
      } finally {
        setLoadingState(false);
      }
    }
    fetchImages();
  }, [url]);

  return [imageData, loadingState, errorDuringFetch];
}
