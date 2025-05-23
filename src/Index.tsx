import { HashRouter, Route, Routes } from "react-router-dom";
import Announces from "./pages/Announces";
import NoPage from "./components/NoPage";
import App from "./layouts/App";
import Login from "./pages/Login";
import AuthProvider from "./providers/AuthProvider";
import ThemeUtilsProvider from "./providers/ThemeUtilsProvider";
import Dashboard from "./pages/Dashboard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Grades from "./pages/Grades";
import Departments from "./pages/Departments";
import Settings from "./pages/Settings";
import Attendance from "./pages/Attendance";
import VersionTag from "./components/VersionTag";
import './style/Index.css'
import './style/gh-fork-ribbon.min.css'

export default function Index() {
  return (
    <AuthProvider>
      <ThemeUtilsProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <App />
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="announces" element={<Announces />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="departments" element={<Departments />} />
                <Route path="grades" element={<Grades />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NoPage />} />
              </Route>
              <Route path="/login" element={
                <>
                  <Login />
                  <VersionTag
                    sx={{
                      position: "fixed",
                      bottom: 0,
                      left: 0,
                    }} />,
                </>
              } />
            </Routes>
          </HashRouter>
        </LocalizationProvider>
      </ThemeUtilsProvider>
    </AuthProvider>
  );
}
