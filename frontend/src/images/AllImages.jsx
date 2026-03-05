import { useEffect, useState } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages() {
  const [imageData, _setImageData] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorDuringFetch, setErrorDuringFetch] = useState("");

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch("/api/images");
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
  }, []);

  return (
    <>
      <h2>All Images</h2>
      {loadingState && <span>Loading...</span>}
      {errorDuringFetch.length !== 0 && <span>{errorDuringFetch}</span>}
      <ImageGrid images={imageData} />
    </>
  );
}
