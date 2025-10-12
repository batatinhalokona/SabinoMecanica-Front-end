import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div style={{padding: "1rem"}}>
      <h1>Dashboard da Mecânica</h1>
      <div style={{display:"grid", gap:"1rem", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
        <Link to="/servicos" style={cardStyle}>Serviços</Link>
        <Link to="/clientes" style={cardStyle}>Clientes</Link>
        <Link to="/fotos" style={cardStyle}>Fotos & Anotações</Link>
      </div>
    </div>
  );
}

const cardStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: "2rem",
  textDecoration: "none",
  color: "#222",
  fontWeight: 600
};
