import React from "react"
import { BrowserRouter,Route,Routes } from "react-router"
import Home from "./pages/Home"
import EditorPage from "./pages/EditorPage"
import  { Toaster } from "react-hot-toast"

function App() {
  return (
    <BrowserRouter>
    <div><Toaster/></div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editor/:id" element={<EditorPage/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
