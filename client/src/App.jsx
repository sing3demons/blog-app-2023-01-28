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
import EditPost from './pages/EditPost.jsx'

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
            <Route path="/edit/:id" index element={<EditPost />} />
          </Route>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/register'} element={<Register />} />
        </Routes>
      </AlertProvider>
    </UserContextProvider>
  )
}

export default App
