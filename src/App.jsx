// import ParentContainer from "./components/ParentContainer"
import CountryQuiz from "./components/CountryQuiz"
import { Toaster } from "react-hot-toast"


function App() {

  return (
   <div className="bg-blue-950 min-h-screen flex items-center justify-center">
    <Toaster position="top-center" reverseOrder={false} />
    <CountryQuiz />
   </div>
  )
}

export default App
