import { ReactElement,useState,ChangeEvent,useContext  } from "react";
import { useLocation,useNavigate,useOutletContext  } from "react-router-dom";
import { UserState,UserContext } from './UserContext';

export default function Login(): ReactElement  {

  return (<>
  <h1>User Log In</h1>
  <LogInForm />
  </>);
}

function LogInForm():ReactElement {
  const navigate = useNavigate();
  const {userData,setUserData} = useOutletContext();
  const updateUserData = (newUserName) => {
      setUserData({userName : newUserName,userImage : userData.userImage});
    }
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from refreshing
    console.log('Submitted Data:', formData);
    //TODO: This is a stub for an actual API call to be implemented later
    updateUserData(formData.username);
    navigate('/',{});
    //end stub
  };

  return (
  <>
        <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Send</button>
    </form>
  </>);
}