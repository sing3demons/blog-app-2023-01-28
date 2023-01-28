import React from 'react'
import Header from './Header.jsx'
import { Outlet } from 'react-router-dom'
import { positions, Provider as AlertProvider, transitions } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  timeout: 1000,
  position: positions.TOP_RIGHT,
  offset: '30px',
  transition: transitions.SCALE,
}

export default function Layout() {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <main>
        <Header />
        <Outlet />
      </main>
    </AlertProvider>
  )
}
