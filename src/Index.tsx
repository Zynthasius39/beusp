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
import './style/Index.css'
import { RequireAuth } from "./providers/RequireAuth";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";

export default function Index() {
  return (
    <AuthProvider>
      <ThemeUtilsProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <CssBaseline />
            <GlobalStyles
              styles={(theme) => ({
                html: {
                  fontSize: '12px', // xs
                  [theme.breakpoints.up('sm')]: {
                    fontSize: '14px',
                  },
                  [theme.breakpoints.up('md')]: {
                    fontSize: '16px',
                  },
                },
              })}
            />
            <Routes>
              <Route path="*" element={<Error errorCode={404} />} />
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
                  <Login />
              } />
            </Routes>
          </BrowserRouter>
        </I18nextProvider>
      </ThemeUtilsProvider >
    </AuthProvider >
  );
}
