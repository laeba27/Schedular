import { v2 as cloudinary } from "cloudinary";

// Parse CLOUDINARY_URL from environment variable
const parseCloudinaryUrl = () => {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL environment variable is not set");
  }

  try {
    // Remove 'cloudinary://' prefix
    const withoutProtocol = cloudinaryUrl.replace("cloudinary://", "");

    // Split by @ to separate credentials from cloud_name
    const [credentials, cloudName] = withoutProtocol.split("@");

    if (!cloudName) {
      throw new Error(
        "Invalid CLOUDINARY_URL format. Expected: cloudinary://api_key:api_secret@cloud_name"
      );
    }

    const [api_key, api_secret] = credentials.split(":");

    return {
      cloud_name: cloudName,
      api_key,
      api_secret,
    };
  } catch (error) {
    console.error("Error parsing CLOUDINARY_URL:", error);
    throw error;
  }
};

// Configure cloudinary
const config = parseCloudinaryUrl();
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const resourceType = formData.get("resourceType") || "auto";

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: "calendly",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve(
              Response.json(
                { error: error.message || "Upload failed" },
                { status: 500 }
              )
            );
          } else {
            resolve(
              Response.json({
                url: result.secure_url,
                publicId: result.public_id,
              })
            );
          }
        }
      );

      stream.end(buffer);
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
