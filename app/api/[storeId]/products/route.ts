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
        const {name,price,images,categoryId,sizeId,colorId,isFeatured,isArchived}=body
        
        if(!name || !price || !categoryId || !sizeId || !colorId ){
            return new NextResponse("necessary data missing",{status:400})
        }

        if(!images || !images.length){
            return new NextResponse("image is missing",{status:400})
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

        const product=await prismadb.product.create({
            data:{
                name,
                price,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                },
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                storeId:params.storeId
            }
        })
        return NextResponse.json(product)

    }catch(err){
        console.log("[PRODUCT_POST]",err)
        return new NextResponse("Internal error",{status:500})
    }
}


export async function GET (
    req:Request,
    {params}:{params:{storeId:string}}
    ){
    try{
        const {searchParams}=new URL(req.url)
        const categoryId=searchParams.get("categoryId") || undefined
        const sizeId=searchParams.get("sizeId") || undefined
        const colorId=searchParams.get("colorId") || undefined
        const isFeatured=searchParams.get("isFeatured")
       
        if(!params.storeId){
            return new NextResponse("StoreId missing",{status:400})
        }

        const products=await prismadb.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                sizeId,
                colorId,
                isFeatured:isFeatured?true:undefined,
                isArchived:false
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return NextResponse.json(products)

    }catch(err){
        console.log("[PRODUCTS_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}