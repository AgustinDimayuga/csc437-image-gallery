import { useEffect, useState } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages() {
  const [imageData, _setImageData] = useState(fetchAll);
  const [loadingState, setLoadingState] = useState(true);
  const [errorDuringFetch, setErrorDuringFetch] = useState("");

  useEffect(() => {
    fetch("/api/images");
  }, []);

  return (
    <>
      <h2>All Images</h2>
      {loadingState && <span>Loading...</span>}
      {errorDuringFetch.length !== 0 && <span>errorDuringFetch</span>}
      <ImageGrid images={imageData} />
    </>
  );
}
