import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import SignUp from "./routes/SignUp/SignUp";
import { Library } from "./routes/Library/Library";
import { Login } from "./routes/Login/Login";
import AuthWrapper from "./app/AuthWrapper";

//TODO add homepage
//TODO add about page

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/secure" element={<AuthWrapper />}>
          <Route path="library" element={<Library />} />
        </Route>
      </Route>
    </Routes>
  )
}
