import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PageWrapper({
  children,
  showFooter = true,
  navTransparent = false,
  className = "",
}) {
  return (
    <div className="min-h-screen flex flex-col bg-arch-cream">
      <Navbar transparent={navTransparent} />
      <main className={`flex-1 pt-16 ${className}`}>
        <div className="page-enter">{children}</div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
