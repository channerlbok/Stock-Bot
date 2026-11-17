import { Dispatch, SetStateAction,useState  } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  Path,
} from "react-router-dom";
import styles from './main.module.css';
import Home from "./home";
import User from "./user";
import emptyUserImage from './media/no-profile-picture-15257_128.png';

interface UserData {
  userName: string;
  userImage: string;
  // Option A: Standard React state setter type (allows functional updates like prev => ...)
  updateUserData: Dispatch<SetStateAction<{ userName: string; userImage: string; }>>;
  // Option B: Custom callback signature (cleaner if the child just sends a raw value)
  // onUpdateMessage: (newText: string) => void;
}

// 1. Shared Layout Component with a Navigation Bar
function Layout() {
  const [UserData, updateUserData] = useState({
      userName:'',
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
        <LoginPage userName={UserData.userName} userImage={UserData.userImage} updateUserData={updateUserData}/>
      </nav>
      <main className={styles.container}>
        {/* The Outlet component dynamically renders the active child route */}
        <Outlet />
      </main>
    </div>
  );
}

// 2. Individual Page Components

const LoginPage: React.FC<UserData> = ({ userName, userImage, updateUserData }) =>  {

  if (userName==='') {
    console.log('userName was empty');
    return (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to='/login'>
            <img src={userImage}></img>Login
          </Link>
        </div>);
  } else {
    console.log('userName was ' + userName);
    //todo: update this to replace the userImage; otherwise the same right now
    return (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to='/login'>
            <img src={userImage}></img>{userName}
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
        element: <User />,
      },
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
