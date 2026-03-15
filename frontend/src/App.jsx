import { useState } from "react";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import "./App.css";
import { Route, Routes } from "react-router";
import { MainLayout } from "./MainLayout.jsx";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { SHARED_TEST } from "./shared/example.js";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

function App() {
  const [authToken, setAuthToken] = useState(null);

  const POSSIBLE_PAGES = [
    <AllImages authToken={authToken} />,
    <ImageDetails authToken={authToken} />,
    <UploadPage />,
    <LoginPage
      onSignIn={(authToken) => {
        setAuthToken(authToken);
      }}
      isRegistering={false}
    />,
    <LoginPage isRegistering={true} />,
    <MainLayout />,
  ];

  return (
    <Routes>
      <Route path={VALID_ROUTES.HOME} element={POSSIBLE_PAGES[5]}>
        <Route
          index
          element={
            <ProtectedRoute authToken={authToken}>
              {POSSIBLE_PAGES[0]}
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.IMAGE}
          element={
            <ProtectedRoute authToken={authToken}>
              {POSSIBLE_PAGES[1]}
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.UPLOAD}
          element={
            <ProtectedRoute authToken={authToken}>
              {POSSIBLE_PAGES[2]}
            </ProtectedRoute>
          }
        />
        <Route path={VALID_ROUTES.LOGIN} element={POSSIBLE_PAGES[3]} />
        <Route path={VALID_ROUTES.REGISTER} element={POSSIBLE_PAGES[4]} />
      </Route>
    </Routes>
  );
}

export default App;
