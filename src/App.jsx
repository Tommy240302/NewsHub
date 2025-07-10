import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./features/home/HomePage";
import AboutPage from "./features/about/AboutPage";
import ContactPage from "./features/contact/ContactPage";

import "./App.css";
import Login from "./features/auth/login";
import SignUp from "./features/auth/SignUp";
import HotNews from "./features/pages/HotNews";
import TrendNews from "./features/pages/TrendNews";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/hotnews" element={<HotNews />} />
          <Route path="/trendnews" element={<TrendNews />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
