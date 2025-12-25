import { Outlet, } from "react-router-dom";
import { Navbar } from "./components";

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default App;