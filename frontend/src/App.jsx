import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import DashboardPage from "./pages/DashboardPage";
import SessionPage from "./pages/SessionPage";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;  // To get rid of the flickering effect

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage />: <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage/>: <Navigate to="/" />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />}/>
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to="/" />}/>
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>

      {/* Toast container */}


      <Toaster position="top-right" />
    </>
  );
};

export default App;
