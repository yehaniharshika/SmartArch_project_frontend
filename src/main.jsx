import { StrictMode } from "react";
import { createRoot }  from "react-dom/client";
import { Provider }    from "react-redux";
import { Toaster }     from "react-hot-toast";
import { store }       from "./store/store";
import App             from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "DM Sans, system-ui, sans-serif",
            fontSize:   "0.875rem",
            background: "#2C2416",
            color:      "#FAF8F4",
            border:     "1px solid #4A3B2A",
            borderRadius: "4px",
            padding:    "12px 16px",
          },
          success: { iconTheme: { primary: "#C8A96E", secondary: "#2C2416" } },
          error:   { iconTheme: { primary: "#A0412A", secondary: "#FAF8F4" } },
        }}
      />
    </Provider>
  </StrictMode>
);