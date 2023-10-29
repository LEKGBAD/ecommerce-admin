"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard, Category, Store } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFormProps {
    initialData:Category | null
    billboards:Billboard[]
}
const forSchema=z.object({
    name:z.string().min(1),
    billboardId:z.string().min(1),
})

type CategoryFormValues=z.infer<typeof forSchema>

const CategoryForm:React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const [open,setOpen]=useState(false);
    const [loading,setLoading]=useState(false);

    const params=useParams()
    const router=useRouter()

    const title=initialData ? "Edit category" : "Create category"
    const description=initialData ? "Edit a category" : "Create a new category"
    const toastMessage=initialData ? "Category updated" : "Category created"
    const action=initialData ? "Save changes" : "Create"

    const form=useForm<CategoryFormValues>({
        resolver:zodResolver(forSchema),
        defaultValues:initialData || {name:"",billboardId:""}
    })

    const onSubmit=async (data:CategoryFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
            await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data)   
            }
            else{
            await axios.post(`/api/${params.storeId}/categories `,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success("Catgory deleted")

        }catch(err){
            toast.error("Make sure you remove all products using this category first")
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
                            <Input placeholder="Category name" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    
                )}
                />

                <FormField 
                control={form.control}
                name="billboardId"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Billboard</FormLabel>
                            <Select 
                            disabled={loading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a billboatd"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {billboards.map((billboard)=>(
                                        <SelectItem key={billboard.id} value={billboard.id}>
                                            {billboard.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
 
export default CategoryForm;