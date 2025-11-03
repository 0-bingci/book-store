import "./App.css";
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Provider } from 'react-redux'; // 导入 Provider
import { store } from './store/store'; // 导入创建好的 store

function App() {
  return (
    <>
      <Navbar />
      <Provider store={store}> {/* 包裹应用，提供 Redux store */}
        <div className="w-full px-4 py-6 h-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </Provider>
      <Footer />
    </>
  );
}

export default App;
