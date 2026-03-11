import { useParams } from "react-router";
import { useFetch } from "./useFetch.js";
import { ImageNameEditor } from "./ImageNameEditor.jsx";

export function ImageDetails({ authToken }) {
  const { imageId } = useParams();
  const [image, loadingState, errorDuringFetch, setImageData] = useFetch(
    `/api/images/${imageId}`,
    authToken,
  );
  if (loadingState) return <span>Loading...</span>;
  if (errorDuringFetch.length !== 0) return <span>{errorDuringFetch}</span>;
  if (!image) return <span>Image not found</span>;
  return (
    <>
      {loadingState && <span>Loading...</span>}
      {errorDuringFetch.length !== 0 && <span>{errorDuringFetch}</span>}
      <h2>{image.name}</h2>
      <ImageNameEditor
        imageId={imageId}
        initialValue={image.name}
        onRename={(newName) => {
          setImageData((prev) => ({
            ...prev,
            name: newName,
          }));
        }}
        authToken={authToken}
      />
      <p>By {image.author.username}</p>
      <img className="ImageDetails-img" src={image.src} alt={image.name} />
    </>
  );
}
