import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import RedirectComponent from './components/RedirectComponent';
import Dashboard from './components/Dashboard/Dashboard';
import {AuthProvider } from './contexts/AuthContext';
import Login from './components/Login/Login';
import DashboardContent from './components/DashboardContent';
import Quiz from './components/Quiz/Quiz';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectComponent/>,
    children:[
      
    ]
  },
  {
    path: "/dashboard",
    element:<Dashboard/>,
    children:[
      {
        path: "",
        element:<DashboardContent/>,
      }
    ]
  },
  {
    path:"/quiz",
    element:<Quiz/>
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
