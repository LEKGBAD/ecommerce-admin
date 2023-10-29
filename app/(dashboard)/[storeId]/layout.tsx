import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const StoreLayout =async ({children,params}:{children:React.ReactNode,params:{storeId:string}}) => {
    const {userId}=auth()

    if(!userId)
        return redirect("/sign-in")
     const store=await prismadb.store.findFirst({
        where:{
            id:params.storeId,
            userId
        }
     })
     if(!store){
       return redirect("/")
       
     }
    
    return ( 
        <div className="h-full">
            <Navbar />
            {children}
        </div>
     );
}
 
export default StoreLayout;