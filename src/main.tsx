import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { routeTree } from '@/routeTree.gen'
import { persistor, store } from '@/store'

import './styles.css'
import { setAuthToken } from '@/api/common'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          const state = store.getState()
          const accessToken = state.auth.accessToken
          if (accessToken) {
            setAuthToken(accessToken)
          }
        }}
      >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>,
  )
}
