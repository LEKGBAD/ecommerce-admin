import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{billboardId:string}}
){
    try{
       
        if(!params.billboardId){
            return new NextResponse("billboardId is missing",{status:400})
        }  
        
        const billboard=await prismadb.billboard.findUnique({
            where:{
                id:params.billboardId,
            },
            

        })
        return NextResponse.json(billboard);

    }catch(err){
        console.log("[BILLBOARD_ID_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,billboardId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }
        const body=await req.json();

        const {label,imageUrl}=body

        if(!label || !imageUrl){
            return new NextResponse("storeId or billboardId is missing",{status:400})
        }
        
        
        if(!params.storeId || !params.billboardId){
            return new NextResponse("storeId or billboardId is missing",{status:400})
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
        
        const billboard=await prismadb.billboard.updateMany({
            where:{
                id:params.billboardId,
            },
            data:{
                label,
                imageUrl
            }

        })
        return NextResponse.json(billboard);

    }catch(err){
        console.log("[BILLBOARD_PATCH]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string,billboardId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }
        
        if(!params.storeId || !params.billboardId){
            return new NextResponse("storeId or billboardId is missing",{status:400})
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
        
        const billboard=await prismadb.billboard.deleteMany({
            where:{
                id:params.billboardId,
            },
            

        })
        return NextResponse.json(billboard);

    }catch(err){
        console.log("[BILLBOARD_DELETE]",err)
        return new NextResponse("Internal error",{status:500})
    }
}