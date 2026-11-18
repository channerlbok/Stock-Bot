import { ReactElement, useState  } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useLocation,
  Outlet,
} from "react-router-dom";
import { UserState } from './globals.d';
import styles from './main.module.css';
import Home from "./home";
import Login from "./login";
import emptyUserImage from './media/no-profile-picture-15257_128.png';

// 1. Shared Layout Component with a Navigation Bar
function Layout() {
  const location = useLocation();
  const incomingState = location.state as UserState | null;
  const [userData, setUserData] = useState<UserState>({
      userName: incomingState?.userName ?? '',
      userImage: incomingState?.userImage ?? emptyUserImage
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
        <LoginPage userName={userData.userName} userImage={userData.userImage}/>
      </nav>
      <main className={styles.container}>
        {/* The Outlet component dynamically renders the active child route */}
        <Outlet />
      </main>
    </div>
  );
}

// 2. Individual Page Components

function LoginPage({userName,userImage} :UserState ): ReactElement {
  const location = useLocation();
  const incomingState = location.state as UserState | null;
  const [userData, setUserData] = useState<UserState>({
      userName: incomingState?.userName ?? '',
      userImage: incomingState?.userImage ?? emptyUserImage
    });

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
