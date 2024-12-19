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
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required.",
  }),
  control_strength: z.number().min(0).max(1),
  output_format: z.string().default("webp"),
  image: z.instanceof(File).refine((file) => file.size <= 5000000, {
    message: "Image must be less than 5MB.",
  }),
})

export function SketchForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      control_strength: 0.6,
      output_format: "webp",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("prompt", values.prompt)
      formData.append("control_strength", values.control_strength.toString())
      formData.append("output_format", values.output_format)
      formData.append("image", values.image)

      const response = await fetch("/api/sketch", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.success) {
        setResultImage(data.file)
        // toast({
        //   title: "Sketch processing completed",
        //   description: "Your image has been processed and saved.",
        // })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      // toast({
      //   title: "Error processing sketch",
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
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the image you want to generate from the sketch" {...field} />
              </FormControl>
              <FormDescription>
                Describe the image you want to generate based on the uploaded sketch.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="control_strength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Control Strength</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Adjust the control strength of the sketch (0 to 1).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="output_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Output Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the output format for your processed image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sketch Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormDescription>
                Upload your sketch image (max 5MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Process Sketch"}
        </Button>
      </form>
      {resultImage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Processed Image</h2>
          <img src={resultImage} alt="Processed" className="max-w-full h-auto rounded-lg shadow-lg" />
        </div>
      )}
    </Form>
  )
}

