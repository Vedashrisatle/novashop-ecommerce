import {createContext,useContext,useEffect,useState} from "react";import{endpoints}from"../services/api";
const C=createContext();
export function AuthProvider({children}){const[user,setUser]=useState(()=>JSON.parse(localStorage.getItem("user")||"null"));const[token,setToken]=useState(()=>localStorage.getItem("token"));const[loading,setLoading]=useState(!!token);
useEffect(()=>{if(token)endpoints.me().then(r=>{setUser(r.data.user);localStorage.setItem("user",JSON.stringify(r.data.user))}).catch(logout).finally(()=>setLoading(false))},[]);
function save(d){localStorage.setItem("token",d.token);localStorage.setItem("user",JSON.stringify(d.user));setToken(d.token);setUser(d.user)}
async function login(d){const r=await endpoints.login(d);save(r.data);return r.data} async function signup(d){const r=await endpoints.register(d);save(r.data);return r.data}
function logout(){localStorage.removeItem("token");localStorage.removeItem("user");setToken(null);setUser(null)}
return <C.Provider value={{user,token,loading,login,signup,logout,isAuthenticated:!!token&&!!user,isAdmin:user?.role==="admin"}}>{children}</C.Provider>}
export const useAuth=()=>useContext(C);
