"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { ProfileFormState, updateVendorProfile } from "@/lib/actions/profileActions";
import ImageUploader from "@/components/vendor/ImageUploader";
import { VendorProfile } from "@/lib/authUtils";
import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import react-toastify

interface ProfileUpdateFormProps {
  vendor: VendorProfile;
}

const initialState: ProfileFormState = { message: "", type: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-gradient-green btn-lg w-100" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Updating...
        </>
      ) : (
        <>
          <i className="bi bi-check-circle-fill me-2"></i>Update Profile
        </>
      )}
    </button>
  );
}

export default function ProfileUpdateForm({ vendor }: ProfileUpdateFormProps) {
  const [state, formAction] = useActionState(updateVendorProfile, initialState);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(vendor.profile_picture_url || null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  useEffect(() => {
    if (state?.type === "success") {
      toast.success(state.message); // Use toast instead of alert
      setHasImageChanged(false); // Reset the change flag after successful update
    } else if (state?.type === "error") {
      toast.error(`Error: ${state.message}`); // Use toast instead of alert
    }
  }, [state]);

  // Called by ImageUploader when a new profile pic is successfully uploaded
  const handleProfilePicUpload = (publicUrl: string, filePath: string) => {
    console.log("Profile pic uploaded:", { publicUrl, filePath });
    setProfilePicUrl(publicUrl);
    setHasImageChanged(true);
  };

  const handleImageUploadError = (error: string) => {
    console.error("Image upload error:", error);
    toast.error(`Image upload failed: ${error}`); // Use toast instead of alert
  };

  return (
    <form action={formAction} className="needs-validation" noValidate>
      {/* Hidden input to submit the uploaded photo URL */}
      <input type="hidden" name="profile_picture_url" value={profilePicUrl || ""} />
      
      {/* Hidden input to track if image has changed */}
      <input type="hidden" name="image_changed" value={hasImageChanged.toString()} />

      <div className="row g-3">
        <div className="col-md-4 text-center">
          <ImageUploader
            bucketName="profile-pics"
            filePathPrefix={`vendors/${vendor.id}/profile/`}
            onUploadSuccess={handleProfilePicUpload}
            onUploadError={handleImageUploadError}
            currentImageUrl={profilePicUrl}
            label="Profile Picture"
            aspectRatio="1/1" // square aspect ratio for profile pics
            maxFileSizeMB={5}
          />
        </div>

        <div className="col-md-8">
          <div className="mb-3">
            <label htmlFor="vendorName" className="form-label fw-medium">
              Business/Vendor Name
            </label>
            <input
              type="text"
              name="name"
              id="vendorName"
              className="form-control form-control-lg"
              defaultValue={vendor.name}
              required
            />
            <div className="invalid-feedback">Vendor name is required.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="vendorEmail" className="form-label fw-medium">
              Email Address
            </label>
            <input
              type="email"
              id="vendorEmail"
              className="form-control form-control-lg"
              defaultValue={vendor.email}
              readOnly
              disabled
              title="Email cannot be changed."
            />
            <small className="form-text text-muted">
              Email address cannot be changed here. Contact support if needed.
            </small>
          </div>
        </div>
      </div>

      <hr className="my-4" />
      <h5 className="mb-3 fw-medium">Additional Details</h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="vendorPhoneNumber" className="form-label fw-medium">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            id="vendorPhoneNumber"
            className="form-control form-control-lg"
            defaultValue={vendor.phone_number || ""}
            placeholder="e.g., +1234567890"
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="vendorAge" className="form-label fw-medium">
            Age
          </label>
          <input
            type="number"
            name="age"
            id="vendorAge"
            className="form-control form-control-lg"
            min="18"
            max="120"
            defaultValue={vendor.age || ""}
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="vendorGender" className="form-label fw-medium">
            Gender
          </label>
          <select
            name="gender"
            id="vendorGender"
            className="form-select form-select-lg"
            defaultValue={vendor.gender || ""}
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
      </div>

      {state?.message && (
        <div
          className={`alert ${
            state.type === "error" ? "alert-danger" : "alert-success"
          } d-flex align-items-center mt-4`}
        >
          <i
            className={`bi ${
              state.type === "error"
                ? "bi-exclamation-triangle-fill"
                : "bi-check-circle-fill"
            } me-2`}
          ></i>
          {state.message}
        </div>
      )}

      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}