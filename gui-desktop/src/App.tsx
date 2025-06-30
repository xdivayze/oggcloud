import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import SignUp from "./routes/SignUp/SignUp";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route path="/sign-up" element={<SignUp />} />
      </Route>
    </Routes>
  )
}
