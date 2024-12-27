import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import { Home } from "./pages/Home";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { Indicadores } from "./pages/Indicadores";

export function AppRoutes() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/indicadores" element={<Indicadores />} />
          </Routes>
        </Router>
    )
}