"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard, Store } from "@prisma/client";
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

interface BillboardFormProps {
    initialData:Billboard | null
}
const forSchema=z.object({
    label:z.string().min(1),
    imageUrl:z.string().min(1),
})

type BillboardFormValues=z.infer<typeof forSchema>

const BillboardForm:React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const [open,setOpen]=useState(false);
    const [loading,setLoading]=useState(false);

    const params=useParams()
    const router=useRouter()

    const title=initialData ? "Edit billboard" : "Create billboard"
    const description=initialData ? "Edit a billboard" : "Create a new billboard"
    const toastMessage=initialData ? "Billboard updated" : "Billboard created"
    const action=initialData ? "Save changes" : "Create"

    const form=useForm<BillboardFormValues>({
        resolver:zodResolver(forSchema),
        defaultValues:initialData || {label:"",imageUrl:""}
    })

    const onSubmit=async (data:BillboardFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
            await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data)   
            }
            else{
            await axios.post(`/api/${params.storeId}/billboards `,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard deleted")

        }catch(err){
            toast.error("Make sure you remove all categories using this billboard first")
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
            <FormField 
                control={form.control}
                name="imageUrl"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Background image</FormLabel>
                        <FormControl>
                            <ImageUpload 
                            values={field.value?[field.value]:[]}
                            onChange={(url)=>field.onChange(url)}
                            disabled={loading}
                            onRemove={()=>field.onChange("")}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    
                )}
                />
                <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control}
                name="label"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input placeholder="Billboard label" {...field}/>
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
 
export default BillboardForm;