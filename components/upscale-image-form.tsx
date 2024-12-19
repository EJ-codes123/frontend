"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  generation_id: z.string().min(1, {
    message: "Generation ID is required.",
  }),
})

export function UpscaleImageForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      generation_id: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/upscale-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (data.success) {
        setUpscaledImage(data.file)
        // toast({
        //   title: "Image upscaled successfully",
        //   description: "Your image has been upscaled and saved.",
        // })
      } else if (response.status === 202) {
        // toast({
        //   title: "Upscaling in progress",
        //   description: "Please try again in a few moments.",
        // })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      // toast({
      //   title: "Error upscaling image",
      //   description: error instanceof Error ? error.message : "An unknown error occurred",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="generation_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Generation ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter the generation ID" />
              </FormControl>
              <FormDescription>
                Enter the ID of the image generation you want to upscale.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Upscaling..." : "Upscale Image"}
        </Button>
      </form>
      {upscaledImage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Upscaled Image</h2>
          <img src={upscaledImage} alt="Upscaled" className="max-w-full h-auto rounded-lg shadow-lg" />
        </div>
      )}
    </Form>
  )
}

