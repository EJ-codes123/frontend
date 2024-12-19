import { NextResponse } from "next/server"
import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt, negative_prompt, aspect_ratio = "1:1", seed = 0, style_preset, output_format = "png" } = body

    const payload = { prompt, negative_prompt, aspect_ratio, seed, style_preset, output_format }

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    )

    if (response.status === 200) {
      const filename = `generated-${Date.now()}.${output_format}`
      const filePath = path.join(process.cwd(), "public", "images", filename)
      fs.writeFileSync(filePath, Buffer.from(response.data))
      return NextResponse.json({ success: true, file: `/images/${filename}` })
    } else {
      return NextResponse.json({ success: false, error: response.data.toString() }, { status: response.status })
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ success: false, error: "An error occurred while generating the image" }, { status: 500 })
  }
}

