import { ReactElement  } from "react";
import {useOutletContext} from "react-router-dom";

export default function Stocks():ReactElement {
  const {userData,setUserData} = useOutletContext();
  const updateUserData = (newUserName) => {
      setUserData({userName : newUserName,userImage : userData.userImage});
    }
  return (<>
  <h1>Stock Page for {userData.userName} </h1>
  <p>
    to be implemented
  </p>
  </>);
}