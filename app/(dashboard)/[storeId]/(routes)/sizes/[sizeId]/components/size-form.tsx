"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard, Size, Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {toast} from "react-hot-toast"
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

interface SizeFormProps {
    initialData:Size | null
}
const forSchema=z.object({
    name:z.string().min(1),
    value:z.string().min(1),
})

type SizeFormValues=z.infer<typeof forSchema>

const SizeForm:React.FC<SizeFormProps> = ({
    initialData
}) => {
    const [open,setOpen]=useState(false);
    const [loading,setLoading]=useState(false);

    const params=useParams()
    const router=useRouter()

    const title=initialData ? "Edit size" : "Create size"
    const description=initialData ? "Edit a size" : "Create a new size"
    const toastMessage=initialData ? "Size updated" : "Size created"
    const action=initialData ? "Save changes" : "Create"

    const form=useForm<SizeFormValues>({
        resolver:zodResolver(forSchema),
        defaultValues:initialData || {name:"",value:""}
    })

    const onSubmit=async (data:SizeFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
            await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`,data)   
            }
            else{
            await axios.post(`/api/${params.storeId}/sizes `,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMessage)
        }catch(err){
            toast.error("Something went wrong")
        }
        finally{
            setLoading(false)
        }
    }

    const onDelete=async()=>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh();
            router.push(`/${params.storeId}/sizes`)
            toast.success("Size deleted")

        }catch(err){
            toast.error("Make sure you remove all products using this size first")
        }
        finally{
            setLoading(false)
        }
    }
    return ( 
        <>
        <AlertModal 
        isOpen={open}
        onClose={()=>setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
        />
        <div className="flex items-center justify-between">
            <Heading 
            title={title}
            description={description}
            />
            {initialData && (
            <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={()=>{setOpen(true)}}
            >
                <Trash className="h-4 w-4"/>
            </Button>
            )}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full pb-4">
            
                <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control}
                name="name"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Size name" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    
                )}
                />
                <FormField 
                control={form.control}
                name="value"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                            <Input placeholder="Size Value" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    
                )}
                />
                </div>
                <Button type="submit" disabled={loading} className="ml-auto">
                    {action}
                </Button>
            </form>
        </Form>
        
        </>
     );
}
 
export default SizeForm;