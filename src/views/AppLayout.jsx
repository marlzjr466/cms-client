import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useMeta } from '@opensource-dev/redux-meta'

// components
import Nav from '@components/Nav'
import SideMenu from '@components/SideMenu'

// hooks
import { useAuth } from '@hooks'

function Layout () {
  const { auth } = useAuth()
  const { metaStates, metaActions } = useMeta()

  const theme = {
    ...metaStates('theme', ['mode']),
    ...metaActions('theme', ['fetch'])
  }

  useEffect(() => {
    theme.fetch({
      filters: [
        {
          field: 'admin_id',
          value: auth.id
        }
      ],
      is_first: true
    })
  }, [])

  const getTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light'

  return (
    <>
      <div className={`main-container flex flex-col ${theme.mode === 'system' ? getTheme() : theme.mode}`}>
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