export default function Modal({ children, onClose }) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={contentWrapper}>{children}</div>
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
  overflowY: "auto",
};

const modal = {
  background: "white",
  borderRadius: "12px",
  padding: "24px",
  minWidth: "500px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
};

const contentWrapper = {
  width: "100%",
  height: "100%",
};