import { NextResponse } from "next/server"
import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const prompt = formData.get("prompt") as string
    const control_strength = parseFloat(formData.get("control_strength") as string) || 0.6
    const output_format = formData.get("output_format") as string || "webp"
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ success: false, error: "Missing image file." }, { status: 400 })
    }

    const form = new FormData()
    form.append("image", await imageFile.arrayBuffer(), imageFile.name)
    form.append("prompt", prompt)
    form.append("control_strength", control_strength.toString())
    form.append("output_format", output_format)

    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/control/sketch`,
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
      const filename = `sketch-${Date.now()}.${output_format}`
      const filePath = path.join(process.cwd(), "public", "images", filename)
      fs.writeFileSync(filePath, Buffer.from(response.data))
      return NextResponse.json({ success: true, file: `/images/${filename}` })
    } else {
      return NextResponse.json({ success: false, error: response.data.toString() }, { status: response.status })
    }
  } catch (error) {
    console.error("Error in sketch processing:", error)
    return NextResponse.json({ success: false, error: "An error occurred during sketch processing" }, { status: 500 })
  }
}

