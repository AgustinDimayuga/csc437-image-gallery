import { useState } from "react";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import "./App.css";
import { Route, Routes } from "react-router";
import { MainLayout } from "./MainLayout.jsx";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

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
      <Route path={VALID_ROUTES.HOME} element={POSSIBLE_PAGES[4]}>
        <Route index element={POSSIBLE_PAGES[0]} />
        <Route path={VALID_ROUTES.IMAGE} element={POSSIBLE_PAGES[1]} />
        <Route path={VALID_ROUTES.UPLOAD} element={POSSIBLE_PAGES[2]} />
        <Route path={VALID_ROUTES.LOGIN} element={POSSIBLE_PAGES[3]} />
      </Route>
    </Routes>
  );
}

export default App;
