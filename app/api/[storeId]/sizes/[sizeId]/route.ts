import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{sizeId:string}}
){
    try{
       
        if(!params.sizeId){
            return new NextResponse("sizeId is missing",{status:400})
        }  
        
        const size=await prismadb.size.findUnique({
            where:{
                id:params.sizeId,
            },
            

        })
        return NextResponse.json(size);

    }catch(err){
        console.log("[SIZE_ID_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,sizeId:string}}
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
        
        
        if(!params.storeId || !params.sizeId){
            return new NextResponse("storeId or sizeId is missing",{status:400})
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
        
        const size=await prismadb.size.updateMany({
            where:{
                id:params.sizeId,
            },
            data:{
                name,
                value
            }

        })
        return NextResponse.json(size);

    }catch(err){
        console.log("[SIZE_PATCH]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string,sizeId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }
        
        if(!params.storeId || !params.sizeId){
            return new NextResponse("storeId or sizeId is missing",{status:400})
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
        
        const size=await prismadb.size.deleteMany({
            where:{
                id:params.sizeId,
            },
            

        })
        return NextResponse.json(size);

    }catch(err){
        console.log("[SIZE_DELETE]",err)
        return new NextResponse("Internal error",{status:500})
    }
}