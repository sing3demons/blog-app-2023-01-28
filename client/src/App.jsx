import './App.css'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Index from './pages/index.jsx'
import { Route, Routes } from 'react-router-dom'
import { UserContextProvider } from './userContext.js'
import { positions, Provider as AlertProvider, transitions } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import CreatePost from './pages/CreatePost.jsx'
import PostItem from './pages/PostItem.jsx'

const options = {
  timeout: 1000,
  position: positions.TOP_RIGHT,
  offset: '30px',
  transition: transitions.SCALE,
}

function App() {
  return (
    <UserContextProvider>
      <AlertProvider template={AlertTemplate} {...options}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" index element={<Index />} />
            <Route path="/create" index element={<CreatePost />} />
            <Route path="/post/:id" index element={<PostItem />} />
          </Route>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/register'} element={<Register />} />
        </Routes>
      </AlertProvider>
    </UserContextProvider>
  )
}

export default App
