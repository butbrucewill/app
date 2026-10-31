import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage";
import AdminPage from "@/pages/AdminPage";
import LegalPage from "@/pages/LegalPage";
import GamingZone from "@/pages/GamingZone";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import PublicSiteLayout from "@/components/PublicSiteLayout";

function App() {
  return (
    <div className="App bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          <Route element={<PublicSiteLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/gamingzone" element={<GamingZone />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}

export default App;