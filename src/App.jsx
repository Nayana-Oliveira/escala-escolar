import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Consulta from "./pages/Consulta";
import Ocorrencias from "./pages/Ocorrencias";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/consulta" replace />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/ocorrencias" element={<Ocorrencias />} />
        <Route path="*" element={<Navigate to="/consulta" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
