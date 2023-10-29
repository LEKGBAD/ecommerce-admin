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
        const {name,billboardId}=body
        
        if(!name || !billboardId){
            return new NextResponse("name or billboardId missing",{status:400})
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

        const category=await prismadb.category.create({
            data:{
                name,
                billboardId,
                storeId:params.storeId
            }
        })
        return NextResponse.json(category)

    }catch(err){
        console.log("[CATEGORY_POST]",err)
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

        const categories=await prismadb.category.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(categories)

    }catch(err){
        console.log("[CATEGORIES_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}