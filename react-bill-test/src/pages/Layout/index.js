import { Outlet } from "react-router-dom";

const Layout = () =>{
  return (
  <div>
  我是Layout
  <Outlet/>
  </div>
  
  )
}

export default Layout;