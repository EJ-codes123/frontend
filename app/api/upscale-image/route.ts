import { NextResponse } from "next/server"
import axios from "axios"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { generation_id } = body

    if (!generation_id) {
      return NextResponse.json({ success: false, error: "Missing generation_id." }, { status: 400 })
    }

    const response = await axios.get(
      `https://api.stability.ai/v2beta/results/${generation_id}`,
      {
        headers: {
          Accept: "image/*",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        responseType: "arraybuffer",
        validateStatus: undefined,
      }
    )

    if (response.status === 202) {
      return NextResponse.json({ success: false, message: "Generation in progress. Please try again later." }, { status: 202 })
    } else if (response.status === 200) {
      const filename = `upscaled-${generation_id}.webp`
      const filePath = path.join(process.cwd(), "public", "images", filename)
      fs.writeFileSync(filePath, Buffer.from(response.data))
      return NextResponse.json({ success: true, file: `/images/${filename}` })
    } else {
      return NextResponse.json({ success: false, error: response.data.toString() }, { status: response.status })
    }
  } catch (error) {
    console.error("Error upscaling image:", error)
    return NextResponse.json({ success: false, error: "An error occurred while upscaling the image" }, { status: 500 })
  }
}

