import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { 
  ContainerRegistrationKeys, 
  Modules 
} from "@medusajs/framework/utils"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const fileService = req.scope.resolve(ContainerRegistrationKeys.FILE)
    
    // Check if file service is available
    if (!fileService) {
      res.status(500).json({ 
        error: "File service not configured. Please configure a file service module." 
      })
      return
    }

    // Get the file from the request
    const file = req.file
    
    if (!file) {
      res.status(400).json({ error: "No file provided" })
      return
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      res.status(400).json({ 
        error: "Invalid file type. Only JPG, PNG, and WebP images are allowed." 
      })
      return
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      res.status(400).json({ 
        error: "File too large. Maximum size is 5MB." 
      })
      return
    }

    // Upload the file using Medusa's file service
    const uploadedFile = await fileService.upload({
      filename: file.originalname,
      body: file.buffer,
      mimeType: file.mimetype,
    })

    res.status(200).json({
      url: uploadedFile.url,
      filename: uploadedFile.filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "Failed to upload file" })
  }
}
