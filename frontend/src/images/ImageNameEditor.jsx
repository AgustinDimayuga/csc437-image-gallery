import { useState } from "react";

export function ImageNameEditor({
  imageId,
  initialValue,
  onRename,
  authToken,
}) {
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
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameInput }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          `Error: ${errorMessage.error}, ${errorMessage.message}`,
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
            disabled={reqInProgess}
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
