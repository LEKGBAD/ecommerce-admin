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
        const {label,imageUrl}=body
        
        if(!label || !imageUrl){
            return new NextResponse("label or imageUrl missing",{status:400})
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

        const billboard=await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboard)

    }catch(err){
        console.log("[BILLBOARD_POST]",err)
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

        const billboards=await prismadb.billboard.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboards)

    }catch(err){
        console.log("[BILLBOARDs_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}