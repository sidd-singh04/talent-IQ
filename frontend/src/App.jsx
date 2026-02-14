import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProblemsPage from "./pages/ProblemsPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;  // To get rid of the flickering effect

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage />: <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage/>: <Navigate to="/" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />}
        />
      </Routes>

      {/* Toast container */}


      <Toaster position="top-right" />
    </>
  );
};

export default App;
