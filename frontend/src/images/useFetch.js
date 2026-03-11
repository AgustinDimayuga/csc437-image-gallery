import { useState, useEffect } from "react";

export function useFetch(url, authToken) {
  const [imageData, _setImageData] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorDuringFetch, setErrorDuringFetch] = useState("");

  useEffect(() => {
    async function fetchImages() {
      try {
        console.log(authToken);
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
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
  }, [url, authToken]);

  return [imageData, loadingState, errorDuringFetch, _setImageData];
}
