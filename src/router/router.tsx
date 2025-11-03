import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import BookDetail from '../pages/BookDetail';
import BookReader from '../pages/BookReader';

// 定义路由规则
const router = createBrowserRouter([
  {
    path: '/', // 根路径
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'book-detail', element: <BookDetail /> },
      { path: 'book-reader', element: <BookReader /> },
    ],
  },
]);

// 导出路由提供者组件
export default function Routes() {
  return <RouterProvider router={router} />;
}
