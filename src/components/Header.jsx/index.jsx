import { NavLink } from "react-router-dom";
import "./index.css";
import logo from '../../../public/logo.png'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-identidade">
          <img
            src="../../../public/logo.png"
            alt="Logo da Escola Estadual Eusébio de Paula Marcondes"
            className="header-logo"
          />

          <div className="header-texto">
            <span>Escola Estadual</span>
            <h1>Eusébio de Paula Marcondes</h1>
          </div>
        </div>

        <nav className="header-nav">
          <NavLink to="/consulta">Consulta</NavLink>
          <NavLink to="/ocorrencias">Ocorrências</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
