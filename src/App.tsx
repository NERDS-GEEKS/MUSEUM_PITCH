import { BLOG_PATH } from "@/constants/blog/types";
import { PRIVACY_POLICY } from "@/constants/legal/privacy";
import { TERMS_AND_CONDITIONS } from "@/constants/legal/terms";
import { PRIVACY_PATH, TERMS_PATH } from "@/constants/legal/types";
import { JourneyApp } from "@/journey/JourneyApp";
import { RootLayout } from "@/layouts/RootLayout";
import { BlogIndexPage } from "@/pages/BlogIndexPage";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { LegalDocumentPage } from "@/pages/LegalDocumentPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function HomePage() {
  return (
    <RootLayout>
      <JourneyApp />
    </RootLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path={PRIVACY_PATH}
          element={
            <LegalDocumentPage
              document={PRIVACY_POLICY}
              otherLabel="Terms & Conditions"
              otherPath={TERMS_PATH}
            />
          }
        />
        <Route
          path={TERMS_PATH}
          element={
            <LegalDocumentPage
              document={TERMS_AND_CONDITIONS}
              otherLabel="Privacy Policy"
              otherPath={PRIVACY_PATH}
            />
          }
        />
        <Route path={BLOG_PATH} element={<BlogIndexPage />} />
        <Route path={`${BLOG_PATH}/:slug`} element={<BlogPostPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
