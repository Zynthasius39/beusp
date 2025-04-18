import { HashRouter, Route, Routes } from "react-router-dom";
import Announces from "./components/Announces";
import NoPage from "./components/NoPage";
import App from "./components/App";
import Login from "./components/Login";
import AuthProvider from "./components/AuthProvider";
import ThemeUtilsProvider from "./components/ThemeUtilsProvider";
import Dashboard from "./components/Dashboard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Grades from "./components/Grades";
import Departments from "./components/Departments";
import Settings from "./components/Settings";

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
                <Route path="departments" element={<Departments />} />
                <Route path="grades" element={<Grades />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NoPage />} />
              </Route>
              <Route path="/login" element={
                <Login />
              } />
            </Routes>
          </HashRouter>
        </LocalizationProvider>
      </ThemeUtilsProvider>
    </AuthProvider>
  );
}
