import { jwtDecode } from "jwt-decode";

export function getToken(){
  return localStorage.getItem("token");
}
export function setToken(t){
  localStorage.setItem("token", t);
}
export function clearToken(){
  localStorage.removeItem("token");
}
export function getUserFromToken(){
  const token = getToken();
  if(!token) return null;
  try{
    const decoded = jwtDecode(token);
    return decoded;
  }catch{
    return null;
  }
}
