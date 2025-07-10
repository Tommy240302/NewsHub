import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./features/home/HomePage";
import AboutPage from "./features/about/AboutPage";
import ContactPage from "./features/contact/ContactPage";

import "./App.css";
import Login from "./features/auth/login";
import SignUp from "./features/auth/SignUp";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
