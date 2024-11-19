import { useEffect, useState } from "react"
import { account } from "./appwrite/appwrite"
import { useNavigate } from "react-router-dom"
function App() {
  const [user,setUser] = useState<undefined | string>()
  const navigate = useNavigate()
  useEffect(()=>{
   async function getSession(){
    try {
      const acc = await account.get()
      setUser(acc.$id)
    } catch (error) {
      // no session
      navigate('/join')
    }
   }
   getSession()
  },[])
  return (
    <div>
      <p>Hello {user}</p>
      <div>
        Home page
      </div>
    </div>
  )
}

export default App
