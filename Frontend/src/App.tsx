
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/dashboard/LandingPage'
import ChessBoard from './components/dashboard/ChessBoard'
import { LoginPage } from './components/dashboard/LoginPage'
import { SignupPage } from './components/dashboard/SignupPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
         <Route path='/' element={<LandingPage />}></Route>
         <Route path='/login' element={<LoginPage />}></Route>
         <Route path='/signup' element={<SignupPage />}></Route>
         <Route path='/chess-board' element={<ChessBoard />} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
