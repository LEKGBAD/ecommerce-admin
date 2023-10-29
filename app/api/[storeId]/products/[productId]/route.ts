import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{productId:string}}
){
    try{
       
        if(!params.productId){
            return new NextResponse("productId is missing",{status:400})
        }  
        
        const product=await prismadb.product.findUnique({
            where:{
                id:params.productId,
                isArchived:false
            },
            include:{
                images:true,
                color:true,
                category:true,
                size:true
            }

        })
        return NextResponse.json(product);

    }catch(err){
        console.log("[PRODUCT_ID_GET]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,productId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }
        const body=await req.json();

        const {name,price,images,categoryId,sizeId,colorId,isFeatured,isArchived}=body
        
        if(!name || !price || !categoryId || !sizeId || !colorId){
            return new NextResponse("necessary data missing",{status:400})
        }

        if(!images || !images.length){
            return new NextResponse("image is missing",{status:400})
        }
        
        
        if(!params.storeId || !params.productId){
            return new NextResponse("storeId or productId is missing",{status:400})
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
        
        await prismadb.product.update({
            where:{
                id:params.productId,
            },
            data:{
                name,
                price,
                images:{
                    deleteMany:{}
                },
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
            }

        })
        const product=await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                },
            }
        })
        return NextResponse.json(product);

    }catch(err){
        console.log("[PRODUCT_PATCH]",err)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string,productId:string}}
){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }
        
        if(!params.storeId || !params.productId){
            return new NextResponse("storeId or productId is missing",{status:400})
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
        
        const product=await prismadb.product.deleteMany({
            where:{
                id:params.productId,
            },
            

        })
        return NextResponse.json(product);

    }catch(err){
        console.log("[PRODUCT_DELETE]",err)
        return new NextResponse("Internal error",{status:500})
    }
}