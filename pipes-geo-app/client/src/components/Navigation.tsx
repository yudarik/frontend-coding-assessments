import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const linkStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    textDecoration: "none",
    color: active ? "#1565C0" : "#666",
    backgroundColor: active ? "#E3F2FD" : "transparent",
    borderRadius: "4px",
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s ease",
  });

  return (
    <nav
      style={{
        display: "flex",
        gap: "8px",
        padding: "12px 16px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: 600, marginRight: "16px", color: "#333" }}>
        View:
      </span>
      <Link to="/pipes/100" style={linkStyle(isActive("/pipes/100"))}>
        100 Pipes
      </Link>
      <Link to="/pipes/10000" style={linkStyle(isActive("/pipes/10000"))}>
        10k Pipes
      </Link>
      <Link to="/pipes/100000" style={linkStyle(isActive("/pipes/100000"))}>
        100K Pipes
      </Link>
    </nav>
  );
};

export default Navigation;
