import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST (
    req:Request,
    {params}:{params:{storeId:string}}
    ){
    try{
        const {userId}=auth()
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }
        const body=await req.json();
        const {name,value}=body
        
        if(!name || !value){
            return new NextResponse("name or value missing",{status:400})
        }

        if(!params.storeId){
            return new NextResponse("StoreId missing",{status:400})
        }

        const storeByUser=await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUser){
            return new NextResponse("Unauthorized",{status:403})
        }

        const size=await prismadb.size.create({
            data:{
                name,
                value,
                storeId:params.storeId
            }
        })
        return NextResponse.json(size)

    }catch(err){
        console.log("[SIZE_POST]",err)
        return new NextResponse("Internal error",{status:500})
    }
}


export async function GET (
    req:Request,
    {params}:{params:{storeId:string}}
    ){
    try{
       
        if(!params.storeId){
            return new NextResponse("StoreId missing",{status:400})
        }

        const sizes=await prismadb.size.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(sizes)

    }catch(err){
        console.log("[SIZES_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}