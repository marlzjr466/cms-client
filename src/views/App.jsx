import { Suspense } from 'react'
import { Routes, Route } from "react-router-dom";

// components
import ProtectedRoute from '@components/ProtectedRoute';
import Loading from '@components/base/Loading';

// routes
import routes from '@routes'

function App () {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map(route => (
            <Route
              key={route.name}
              path={route.path}
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute
                    element={<route.component />}
                    authRequired={route.authRequired}
                  />
                </Suspense>
              }
            >
              {route.children &&
                route.children.map(childRoute => (
                  <Route
                    key={childRoute.name}
                    path={childRoute.path}
                    element={
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          element={<childRoute.component />}
                          authRequired={childRoute.authRequired}
                        />
                      </Suspense>
                    }
                  />
                ))}
            </Route>
        ))}
      </Routes>
    </Suspense>
  )
}

export default App