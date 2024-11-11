// 没有token的话跳转的主页

import { getToken } from "./setToken";
import { Navigate } from "react-router-dom";
import { baseurl } from "../api";

export default function AuthRoute({children}) {
  const token = getToken()
  if (token) {
    return <>{children}</>
  } else {
    return <Navigate to={baseurl + "/"} replace/>
  }
}