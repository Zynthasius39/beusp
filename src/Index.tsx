import { BrowserRouter, Route, Routes } from "react-router-dom";
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

export default function Index() {
  return (
    <AuthProvider>
      <ThemeUtilsProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <App />
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="announces" element={<Announces />} />
                <Route path="grades" element={<Grades />} />
                <Route path="*" element={<NoPage />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeUtilsProvider>
    </AuthProvider>
  );
}
