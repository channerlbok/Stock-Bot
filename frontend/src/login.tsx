import { ReactElement,useState,ChangeEvent  } from "react";
import { useLocation,useNavigate  } from "react-router-dom";
import { UserState } from './globals.d';
import emptyUserImage from './media/no-profile-picture-15257_128.png';



export default function Login(): ReactElement  {
  const location = useLocation();
  const incomingState = location.state as UserState | null;
  const [userData, setUserData] = useState<UserState>({
        userName: incomingState?.userName ?? '',
        userImage: incomingState?.userImage ?? emptyUserImage
      });

  return (<>
  <h1>User Log In</h1>
  <LogInForm userName={userData.userName} userImage={userData.userImage} />
  </>);
}

function LogInForm({userName,userImage} :UserState):ReactElement {
  const navigate = useNavigate();
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
    userName=formData.username;
    navigate('/',{state:{ userName,userImage }});
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