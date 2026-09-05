export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload an image file (JPG, PNG, or WebP).",
    };
  }

  const maxBytes = 10 * 1024 * 1024; // 10MB limit
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: "File size exceeds the 10MB limit. Please choose a smaller image.",
    };
  }

  return { valid: true };
}

export function validateComplaintSubmission(data: {
  description: string;
  address: string;
  imagePresent: boolean;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.description || data.description.trim().length < 10) {
    errors.description = "Please provide a descriptive complaint text (minimum 10 characters).";
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.address = "Please provide a valid street or landmark location.";
  }

  if (!data.imagePresent) {
    errors.image = "Photographic evidence is required for municipal verification.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateResolutionSubmission(data: {
  notes: string;
  evidencePresent: boolean;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.notes || data.notes.trim().length < 10) {
    errors.notes = "Please provide completion details explaining the cleaning action taken (minimum 10 characters).";
  }

  if (!data.evidencePresent) {
    errors.evidence = "After-cleaning photographic proof is required before resolution sign-off.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
