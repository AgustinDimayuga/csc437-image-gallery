import { useState } from "react";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import "./App.css";

function App() {
  const POSSIBLE_PAGES = [
    <AllImages />,
    <ImageDetails imageId={"0"} />,
    <UploadPage />,
    <LoginPage />,
  ];

  return POSSIBLE_PAGES[0];
}

export default App;
