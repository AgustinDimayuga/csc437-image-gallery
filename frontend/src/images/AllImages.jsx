import { useEffect, useState } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";
import { useFetch } from "./useFetch.js";

export function AllImages({ authToken }) {
  const [imageData, loadingState, errorDuringFetch] = useFetch(
    "/api/images",
    authToken,
  );
  return (
    <>
      <h2>All Images</h2>
      {loadingState && <span>Loading...</span>}
      {errorDuringFetch.length !== 0 && <span>{errorDuringFetch}</span>}
      <ImageGrid images={imageData} />
    </>
  );
}
