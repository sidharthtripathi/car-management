import { db } from "@/appwrite/appwrite"
import { Query } from "appwrite"
import { useEffect } from "react"

export default function ListCars(){
    useEffect(()=>{
        async function getCars() {
            const res = await db.listDocuments("6737970c00218f6f57e3","67379719001516e08d1f",[Query.select(["title","description","images","tags"])])
            console.log(res)
        }
        getCars()
    },[])
    return (
        <div>
            listings
        </div>
    )
}