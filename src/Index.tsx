import { BrowserRouter, Route, Routes } from "react-router-dom";
import Announces from "./pages/Announces";
import Error from "./pages/Error";
import App from "./layouts/App";
import Login from "./pages/Login";
import AuthProvider from "./providers/AuthProvider";
import ThemeUtilsProvider from "./providers/ThemeUtilsProvider";
import Dashboard from "./pages/Dashboard";
import Grades from "./pages/Grades";
import Departments from "./pages/Departments";
import Settings from "./pages/Settings";
import Attendance from "./pages/Attendance";
import VersionTag from "./components/VersionTag";
import './style/Index.css'
import './style/gh-fork-ribbon.min.css'
import { RequireAuth } from "./providers/RequireAuth";

export default function Index() {
  return (
    <AuthProvider>
      <ThemeUtilsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Error errorCode={404} errorText="Not Found" />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <App />
                  </RequireAuth>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="/announces" element={<Announces />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/login" element={
                <>
                  <Login />
                  <VersionTag
                    sx={{
                      position: "fixed",
                      p: 4,
                      bottom: 0,
                      left: 0,
                    }} />,
                </>
              } />
            </Routes>
          </BrowserRouter>
      </ThemeUtilsProvider >
    </AuthProvider >
  );
}
