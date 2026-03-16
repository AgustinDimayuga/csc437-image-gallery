import { useActionState, useId, useState } from "react";
import { MainLayout } from "./MainLayout.jsx";
import { useNavigate } from "react-router";

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}
export function UploadPage({ authToken }) {
  const [file, setFile] = useState(null);
  const fileId = useId();
  const navigate = useNavigate();

  const [result, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      try {
        const response = await fetch("/api/images", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Error uploading image, please tryin again");
        }
        const responseData = await response.json();
        navigate(`/images/${responseData.imageId}`);
        return { success: true, message: "Imaged Uploaded Succesfully" };
      } catch (e) {
        return { success: false, message: e.message };
      } finally {
        setFile(null);
      }
    },
    null,
  );
  return (
    <>
      <h2>Upload</h2>
      <form action={submitAction}>
        <div>
          <label htmlFor={fileId}>Choose image to upload: </label>
          <input
            id={fileId}
            name="image"
            disabled={isPending}
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
            <input name="name" disabled={isPending} required />
          </label>
        </div>

        <div>
          {" "}
          {/* Preview img element */}
          <img style={{ width: "20em", maxWidth: "100%" }} src={file} alt="" />
        </div>

        <input type="submit" disabled={isPending} value="Confirm upload" />

        <div aria-live="polite">
          {result && (
            <p style={{ color: result.success ? "green" : "red" }}>
              {result.message}
            </p>
          )}
        </div>
      </form>
    </>
  );
}
