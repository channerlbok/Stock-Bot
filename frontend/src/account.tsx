import { ReactElement  } from "react";
import {useOutletContext} from "react-router-dom";

export default function Account():ReactElement {
  const {userData,setUserData} = useOutletContext();
  const updateUserData = (newUserName) => {
      setUserData({userName : newUserName,userImage : userData.userImage});
    }
  return (<>
  <h1>Account Details</h1>
  <p>
    username: {userData.userName}
    <br />
    Profile Picture:<img src={userData.userImage} alt="User profile picture" />
  </p>
  log out button to be implemented
  </>);
}