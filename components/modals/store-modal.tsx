"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import * as z from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema=z.object({
    name:z.string().min(1,{message:"Required"})
})

const StoreModal = () => {
    const {isOpen,onClose}=useStoreModal();
    const [loading,setLoading]=useState(false)
    const router=useRouter();
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:""
        }
    })

    const onSubmit =async (values:z.infer<typeof formSchema>)=>{
        try{
            setLoading(true)
            const res=await axios.post(`/api/store`,values)
            toast.success("Store created")
            form.reset()
            window.location.assign(`/${res.data.id}`)
        }catch(err){
            toast.error("Something went wrong")
        }
        finally{
            setLoading(false)
        }
    }
    return ( 
        <Modal
        title="Creare store"
        description="Add a new store to manage products and categories"
        isOpen={isOpen}
        onClose={onClose}
        >
         <div>
           <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                    control={form.control}
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="E-cmmerce" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <div className="p-6 space-x-2 flex items-center justify-end w-full">
                        <Button disabled={loading} type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button disabled={loading} type="submit">Continue</Button>
                    </div>

                </form>
            </Form>
           </div>
         </div>
        </Modal>
     );
}
 
export default StoreModal;