import { NextResponse } from "next/server"
import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const prompt = formData.get("prompt") as string
    const search_prompt = formData.get("search_prompt") as string
    const output_format = formData.get("output_format") as string || "webp"
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ success: false, error: "Missing image file." }, { status: 400 })
    }

    const form = new FormData()
    form.append("image", await imageFile.arrayBuffer(), imageFile.name)
    form.append("prompt", prompt)
    form.append("search_prompt", search_prompt)
    form.append("output_format", output_format)

    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/edit/search-and-replace`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
        validateStatus: undefined,
      }
    )

    if (response.status === 200) {
      const filename = `search-replace-${Date.now()}.${output_format}`
      const filePath = path.join(process.cwd(), "public", "images", filename)
      fs.writeFileSync(filePath, Buffer.from(response.data))
      return NextResponse.json({ success: true, file: `/images/${filename}` })
    } else {
      return NextResponse.json({ success: false, error: response.data.toString() }, { status: response.status })
    }
  } catch (error) {
    console.error("Error in search and replace:", error)
    return NextResponse.json({ success: false, error: "An error occurred during search and replace" }, { status: 500 })
  }
}

