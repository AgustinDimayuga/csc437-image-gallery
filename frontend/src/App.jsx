import { useState } from "react";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import "./App.css";
import { Route, Routes } from "react-router";
import { MainLayout } from "./MainLayout.jsx";

function App() {
  const POSSIBLE_PAGES = [
    <AllImages />,
    <ImageDetails />,
    <UploadPage />,
    <LoginPage />,
    <MainLayout />,
  ];

  return (
    <Routes>
      <Route path="/" element={POSSIBLE_PAGES[4]}>
        <Route index element={POSSIBLE_PAGES[0]} />
        <Route path="/images/:imageId" element={POSSIBLE_PAGES[1]} />
        <Route path="/upload" element={POSSIBLE_PAGES[2]} />
        <Route path="/login" element={POSSIBLE_PAGES[3]} />
      </Route>
    </Routes>
  );
}

export default App;
