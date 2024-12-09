import { Link, Outlet } from "react-router-dom";
import { useMeta } from '@opensource-dev/redux-meta';

// components
import Nav from "@components/Nav";
import SideMenu from "@components/SideMenu";

function Layout () {
  const { metaStates } = useMeta()

  const theme = {
    ...metaStates('theme', ['mode'])
  }

  return (
    <>
      <div className={`main-container flex flex-col ${theme.mode}`}>
        <Nav />

        <div className="main-body">
          <SideMenu />

          <div className="content-body">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout