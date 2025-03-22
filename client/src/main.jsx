import { Outlet, Link } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'vite/modulepreload-polyfill';
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from './pages/home/_Home.jsx';
import { NewSession } from './pages/new_list/_NewList.jsx';
import { SessionLists } from './pages/new_list/_SessionLists.jsx';
import { MeditationPage } from './pages/meditation/meditationPage.jsx';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/session_list/new", element: <NewSession /> },
      { path: "/view_session_lists", element: <SessionLists /> },
      { path: "/session_list/:id", element: <h1>I am on the session list page</h1> },
      { path: "/meditation", element: <MeditationPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
