import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{categoryId:string}}
){
    try{
        if(!params.categoryId){
            return new NextResponse("categoryId is missing",{status:400})
        }  
        
        const category=await prismadb.category.findUnique({
            where:{
                id:params.categoryId,
            },
            include:{
                billboard:true
            }
            

        })
        return NextResponse.json(category);

    }catch(err){
        console.log("[CATEGORY_ID_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,categoryId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }
        const body=await req.json();

        const {name,billboardId}=body

        if(!name || !billboardId){
            return new NextResponse("name or billboardId is missing",{status:400})
        }
        
        
        if(!params.storeId || !params.categoryId){
            return new NextResponse("storeId or categoryId is missing",{status:400})
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
        
        const category=await prismadb.category.updateMany({
            where:{
                id:params.categoryId,
            },
            data:{
                name,
                billboardId
            }

        })
        return NextResponse.json(category);

    }catch(err){
        console.log("[CATEGORY_PATCH]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string,categoryId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }
        
        if(!params.storeId || !params.categoryId){
            return new NextResponse("storeId or categoryId is missing",{status:400})
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
        
        const category=await prismadb.category.deleteMany({
            where:{
                id:params.categoryId,
            },
            

        })
        return NextResponse.json(category);

    }catch(err){
        console.log("[CATEGORY_DELETE]",err)
        return new NextResponse("Internal error",{status:500})
    }
}