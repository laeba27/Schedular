/**
 * Cloudinary Upload Utility - API Route Based
 * Uploads files through Next.js API route for secure server-side handling
 * Free tier: 25 GB storage, 25 GB bandwidth per month
 * Sign up at: https://cloudinary.com/users/register/free
 */

/**
 * Upload file to Cloudinary via API route
 * @param {File} file - File to upload
 * @param {string} resourceType - 'image', 'auto', 'video', etc.
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = async (file, resourceType = "auto") => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceType", resourceType);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const data = await response.json();
    return {
      url: data.url,
      publicId: data.publicId,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error instanceof Error ? error : new Error("Upload failed");
  }
};

/**
 * Batch upload multiple files
 * @param {File[]} files - Files to upload
 * @param {string} resourceType - 'image', 'auto', 'video', etc.
 * @returns {Promise<{urls: string[]}>}
 */
export const uploadMultipleToCloudinary = async (files, resourceType = "auto") => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, resourceType)
    );

    const results = await Promise.all(uploadPromises);
    return {
      urls: results.map((r) => r.url),
    };
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw error;
  }
};

/**
 * Upload image to Cloudinary with validation
 */
export const uploadImage = async (file) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image (JPG, PNG, GIF, etc)");
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(
      `Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max 5MB.`
    );
  }

  return uploadToCloudinary(file, "image");
};

/**
 * Upload document to Cloudinary with validation
 */
export const uploadDocument = async (file) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("File type not supported. Use PDF, DOC, XLS, or PPT");
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new Error(
      `Document is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max 50MB.`
    );
  }

  return uploadToCloudinary(file, "auto");
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    // Note: Deletion requires server-side API key for security
    // Implement this in your backend when needed
    console.log("Deletion requires server-side implementation with API key");
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
