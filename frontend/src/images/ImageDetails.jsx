import { useParams } from "react-router";
import { useFetch } from "./useFetch.js";

export function ImageDetails() {
  const { imageId } = useParams();
  const [imageData, loadingState, errorDuringFetch] = useFetch("/api/images");
  const image = imageData.find((img) => img._id === imageId);
  if (loadingState) return <span>Loading...</span>;
  if (errorDuringFetch.length !== 0) return <span>{errorDuringFetch}</span>;
  if (!image) return <span>Image not found</span>;
  return (
    <>
      {loadingState && <span>Loading...</span>}
      {errorDuringFetch.length !== 0 && <span>{errorDuringFetch}</span>}
      <h2>{image.name}</h2>
      <img className="ImageDetails-img" src={image.src} alt={image.name} />
    </>
  );
}
