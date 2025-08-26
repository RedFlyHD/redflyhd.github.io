import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Work from './pages/Work'
import Renew from './pages/Renew'
import NotFound from './pages/NotFound'

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
