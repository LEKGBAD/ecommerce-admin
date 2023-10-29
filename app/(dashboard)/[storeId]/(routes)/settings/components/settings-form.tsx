"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
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
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData:Store
}
const forSchema=z.object({
    name:z.string().min(1),
})

type SettingsFormValues=z.infer<typeof forSchema>

const SettingsForm:React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const [open,setOpen]=useState(false);
    const [loading,setLoading]=useState(false);
    const origin=useOrigin()

    const params=useParams()
    const router=useRouter()

    const form=useForm<SettingsFormValues>({
        resolver:zodResolver(forSchema),
        defaultValues:initialData
    })

    const onSubmit=async (data:SettingsFormValues)=>{
        try{
            setLoading(true)
            await axios.patch(`/api/store/${params.storeId}`,data)
            router.refresh()
            toast.success("Store updated")
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
            await axios.delete(`/api/store/${params.storeId}`)
            router.refresh();
            router.push("/")
            toast.success("Store deleted")

        }catch(err){
            toast.error("Make sure you remove all products and categories first")
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
            title="Settings"
            description="Manage store preferences"
            />
            <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={()=>{setOpen(true)}}
            >
                <Trash className="h-4 w-4"/>
            </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control}
                name="name"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Store name" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    
                )}
                />
                </div>
                <Button type="submit" disabled={loading} className="ml-auto">
                    Save changes
                </Button>
            </form>
        </Form>
        <Separator />
        <ApiAlert title="NEXT_PUBLIC_API_URL" 
        description={`${origin}/api/${params.storeId}`} 
        variant="public"/>
        </>
     );
}
 
export default SettingsForm;