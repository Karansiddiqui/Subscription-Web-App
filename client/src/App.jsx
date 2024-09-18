import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/Nav/NavBar.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Article from "./pages/Article.jsx";
import PrivateRoute from "./routes/privateRoute.jsx";
import { ArticlesPlan } from "./components/ArticlesPlan/ArticlesPlan.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/articles-plans" element={<ArticlesPlan />} />
          <Route path="/articles" element={<Article />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
