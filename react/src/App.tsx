import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { lazy } from 'react'

// Code-split pages for route-level loading fallbacks
const Home = lazy(() => import('./pages/Home'))
const Work = lazy(() => import('./pages/Work'))
const Renew = lazy(() => import('./pages/Renew'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/renew" element={<Renew />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
