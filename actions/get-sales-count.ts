import prismadb from "@/lib/prismadb"


 const getSalesCount=async (storeId:string)=>{
    const salesCount=await prismadb.order.count({
        where:{
            isPaid:true,
            storeId
        },
        
    })


    // const totalRevenue=paidOrders.reduce((total,order)=>total+(order.orderItems.reduce((acc,item)=>acc+Number(item.product.price),0)),0)
    
   
    return salesCount
    
 }

 export default getSalesCount