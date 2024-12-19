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
  negative_prompt: z.string().optional(),
  aspect_ratio: z.string().default("1:1"),
  seed: z.number().int().nonnegative().default(0),
  style_preset: z.string().optional(),
  output_format: z.string().default("png"),
})

export function GenerateImageForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      negative_prompt: "",
      aspect_ratio: "1:1",
      seed: 0,
      style_preset: "",
      output_format: "png",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (data.success) {
        const URLImg = `http://localhost:3000${data.file}`
        // setGeneratedImage(data.file)
        console.log(URLImg)
        setGeneratedImage(URLImg)
        // toast({
        //   title: "Image generated successfully",
        //   description: "Your image has been generated and saved.",
        // })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      // toast({
      //   title: "Error generating image",
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
                <Textarea placeholder="Describe the image you want to generate" {...field} />
              </FormControl>
              <FormDescription>
                Describe the image you want to generate in detail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="negative_prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Negative Prompt</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe what you don't want in the image" {...field} />
              </FormControl>
              <FormDescription>
                Describe elements you want to exclude from the generated image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aspect_ratio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aspect Ratio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the aspect ratio for your generated image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seed</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormDescription>
                Set a seed for reproducible results (0 for random).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style_preset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style Preset</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter a style preset (optional)" />
              </FormControl>
              <FormDescription>
                Optionally specify a style preset for the generated image.
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
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the output format for your generated image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Image"}
        </Button>
      </form>
      {generatedImage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Image</h2>
          <img src={generatedImage} alt="Generated" className="max-w-full h-auto rounded-lg shadow-lg" />
        </div>
      )}
    </Form>
  )
}

