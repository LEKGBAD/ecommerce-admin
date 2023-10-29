import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{colorId:string}}
){
    try{
       
        if(!params.colorId){
            return new NextResponse("colorId is missing",{status:400})
        }  
        
        const color=await prismadb.color.findUnique({
            where:{
                id:params.colorId,
            },
            

        })
        return NextResponse.json(color);

    }catch(err){
        console.log("[COLOR_ID_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,colorId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }
        const body=await req.json();

        const {name,value}=body

        if(!name || !value){
            return new NextResponse("name or value is missing",{status:400})
        }
        
        
        if(!params.storeId || !params.colorId){
            return new NextResponse("storeId or colorId is missing",{status:400})
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
        
        const color=await prismadb.color.updateMany({
            where:{
                id:params.colorId,
            },
            data:{
                name,
                value
            }

        })
        return NextResponse.json(color);

    }catch(err){
        console.log("[COLOR_PATCH]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string,colorId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }
        
        if(!params.storeId || !params.colorId){
            return new NextResponse("storeId or colorId is missing",{status:400})
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
        
        const color=await prismadb.color.deleteMany({
            where:{
                id:params.colorId,
            },
            

        })
        return NextResponse.json(color);

    }catch(err){
        console.log("[COLOR_DELETE]",err)
        return new NextResponse("Internal error",{status:500})
    }
}