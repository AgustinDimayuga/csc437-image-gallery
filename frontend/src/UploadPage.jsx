import { useId, useState } from "react";
import { MainLayout } from "./MainLayout.jsx";

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}
export function UploadPage() {
  const [file, setFile] = useState(null);
  const fileId = useId();
  return (
    <>
      <h2>Upload</h2>
      <form>
        <div>
          <label htmlFor={fileId}>Choose image to upload: </label>
          <input
            id={fileId}
            name="image"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={async (e) => {
              const inputElement = e.target;
              setFile(await readAsDataURL(inputElement.files[0]));
            }}
            required
          />
        </div>
        <div>
          <label>
            <span>Image title: </span>
            <input name="name" required />
          </label>
        </div>

        <div>
          {" "}
          {/* Preview img element */}
          <img style={{ width: "20em", maxWidth: "100%" }} src={file} alt="" />
        </div>

        <input type="submit" value="Confirm upload" />
      </form>
    </>
  );
}
