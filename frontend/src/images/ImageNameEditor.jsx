import { useState } from "react";

export function ImageNameEditor({ imageId, initialValue, onRename }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialValue || "");
  function handleEditPressed() {
    setIsEditingName(true);
    setNameInput(initialValue || "");
  }
  const [reqInProgess, setReqInProgess] = useState(false);
  const [errorDuringFetch, setErrorDuringFetch] = useState("");
  async function handleSubmitPressed() {
    // TODO
    try {
      setErrorDuringFetch("");
      setReqInProgess(true);
      console.log("Hi");
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameInput }),
      });

      if (!response.ok) {
        throw new Error(
          `Error: HTTP ${response.status} ${response.statusText}`,
        );
      }
      onRename(nameInput);
    } catch (e) {
      console.error(e.message);
      setErrorDuringFetch(e.message);
    } finally {
      setReqInProgess(false);
    }
  }

  if (isEditingName) {
    return (
      <>
        <div style={{ margin: "1em 0" }}>
          <label>
            New Name
            <input
              required
              style={{ marginLeft: "0.5em" }}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </label>
          <button
            disabled={nameInput.length === 0 || reqInProgess}
            onClick={handleSubmitPressed}
          >
            Submit
          </button>
          <button
            disabled={isEditingName}
            onClick={() => setIsEditingName(false)}
          >
            Cancel
          </button>
        </div>
        <div aria-live="polite">
          {errorDuringFetch && <span>{errorDuringFetch}</span>}
          {reqInProgess && <span>Renaming image...</span>}
        </div>
      </>
    );
  } else {
    return (
      <div style={{ margin: "1em 0" }}>
        <button onClick={handleEditPressed}>Edit name</button>
      </div>
    );
  }
}
