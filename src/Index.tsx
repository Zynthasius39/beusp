import { BrowserRouter, Route, Routes } from "react-router-dom";
import Announces from "./components/Announces";
import NoPage from "./components/NoPage";
import App from "./components/App";
import Login from "./components/Login";
import { RequireAuth } from "./components/RequireAuth";
import AuthProvider from "./components/AuthProvider";
import ThemeUtilsProvider from "./components/ThemeUtilsProvider";
import Dashboard from "./components/Dashboard";

export default function Index() {
  return (
    <AuthProvider>
      <ThemeUtilsProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <App />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="announces" element={<Announces />} />
              <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ThemeUtilsProvider>
    </AuthProvider>
  );
}
