import "./App.css";
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <div className="w-full px-4 py-6 h-full flex flex-col items-center justify-center">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
