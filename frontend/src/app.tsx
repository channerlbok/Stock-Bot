import { ReactElement, useState, useContext  } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useLocation,
  Outlet,
  useOutletContext 
} from "react-router-dom";
import { UserState,UserContext } from './UserContext';
import styles from './main.module.css';
import Home from "./home";
import Login from "./login";
import Stocks from "./stocks";
import emptyUserImage from './media/no-profile-picture-15257_128.png';
import Account from "./account";


// 1. Shared Layout Component with a Navigation Bar
function Layout() {
  const [userData, setUserData] = useState<UserState>({
      userName: '',
      userImage: emptyUserImage
    });

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <nav
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <Link to='/'>
          <h1>StockPile</h1>
        </Link>
        <UserContext value={userData}>
          <StockLink />
          <LoginLInk />
        </UserContext>
      </nav>
      <main className={styles.container}>
        {/* The Outlet component dynamically renders the active child route */}
        <Outlet context={{ userData, setUserData }}/>
      </main>
    </div>
  );
}

// 2. Individual Page Components
function StockLink(): ReactElement {
  const userData = useContext(UserContext);
  if (userData.userName==='') {
    return (<h3>Stocks</h3>);
  } else {
    return (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to='/stocks'>
            <h3>Stocks</h3>
          </Link>
        </div>);
  }
}

function LoginLInk(): ReactElement {
  const userData = useContext(UserContext);
  if (userData.userName==='') {
    console.log('userName was empty');
    return (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to='/login' state={ userData }>
            <img src={userData.userImage}></img>Login
          </Link>
        </div>);
  } else {
    console.log('userName was ' + userData.userName);
    return (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to='/account'>
            <img src={userData.userImage}></img>{userData.userName}
          </Link>
        </div>);
  }
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚫 404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to='/'>Return to Home</Link>
    </div>
  );
}

// 3. Define the Router and its 4 Main Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Wraps children with navigation UI
    children: [
      {
        index: true, // Acts as the default view for the "/" path
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "stocks",
        element: <Stocks />,
      }
    ],
  },
  {
    path: "*", // Catch-all route for any undefined paths
    element: <NotFound />,
  },
]);

// 4. Main App Entry Point
export default function App() {
  return <RouterProvider router={router} />;
}
