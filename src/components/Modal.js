export default function Modal({ children, onClose }) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(4px)",
};

const modal = {
  background: "white",
  borderRadius: "12px",
  padding: "24px",
  minWidth: "500px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
};
