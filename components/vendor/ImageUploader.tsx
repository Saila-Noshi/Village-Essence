"use client";
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify'; // Import react-toastify

interface ImageUploaderProps {
  bucketName: string;
  filePathPrefix?: string;
  onUploadSuccess: (publicUrl: string, filePath: string) => void;
  onUploadError?: (error: string) => void;
  currentImageUrl?: string | null;
  label?: string;
  allowMultiple?: boolean;
  onMultipleUploadSuccess?: (uploads: { publicUrl: string, filePath: string }[]) => void;
  aspectRatio?: string; // e.g., '1/1' for square, '16/9' for landscape
  maxFileSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucketName,
  filePathPrefix = '',
  onUploadSuccess,
  onUploadError,
  currentImageUrl,
  label = "Upload Image",
  allowMultiple = false,
  onMultipleUploadSuccess,
  aspectRatio = '1/1',
  maxFileSizeMB = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentImageUrl && !allowMultiple ? [currentImageUrl] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImageUrl prop changes
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
      if (!allowMultiple) {
        setPreviewUrls([currentImageUrl]);
      }
    }
  }, [currentImageUrl, allowMultiple]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log("Files selected:", files.length);
    setUploading(true);
    setError(null);

    const validFiles = Array.from(files).filter(file => {
      console.log(`Checking file: ${file.name}, size: ${file.size} bytes`);
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        const errMsg = `File ${file.name} exceeds ${maxFileSizeMB}MB limit.`;
        console.error(errMsg);
        setError(errMsg);
        if (onUploadError) onUploadError(errMsg);
        toast.error(errMsg); // Use toast instead of alert
        return false;
      }
      if (!file.type.startsWith('image/')) {
        const errMsg = `File ${file.name} is not an image.`;
        console.error(errMsg);
        setError(errMsg);
        if (onUploadError) onUploadError(errMsg);
        toast.error(errMsg); // Use toast instead of alert
        return false;
      }
      return true;
    });

    if (validFiles.length === 0 && files.length > 0) {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    console.log("Valid files:", validFiles.length);

    if (allowMultiple && onMultipleUploadSuccess) {
      const uploadPromises = validFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${filePathPrefix}${fileName}`;

        console.log(`Uploading to: ${filePath}`);

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        console.log("Public URL generated:", publicUrl);

        return { publicUrl, filePath, localPreview: URL.createObjectURL(file) };
      });

      try {
        const results = await Promise.all(uploadPromises);
        const newLocalPreviews = results.map(r => r.localPreview);
        setPreviewUrls(prev => [...prev, ...newLocalPreviews].slice(-10));
        onMultipleUploadSuccess(results.map(r => ({ publicUrl: r.publicUrl, filePath: r.filePath })));
        console.log("Multiple upload success:", results);
        toast.success("Images uploaded successfully!"); // Use toast for success
      } catch (err: any) {
        console.error("Multiple upload error:", err);
        setError(err.message);
        if (onUploadError) onUploadError(err.message);
        toast.error(err.message); // Use toast instead of alert
      }

    } else if (validFiles.length > 0) {
      const file = validFiles[0];
      console.log("Processing single file:", file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${filePathPrefix}${fileName}`;

      console.log(`Uploading single file to: ${filePath}`);

      // Create preview immediately
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("Single upload error:", uploadError);
        setError(uploadError.message);
        if (onUploadError) onUploadError(uploadError.message);
        toast.error(uploadError.message); // Use toast instead of alert
        // Revert preview on error
        setPreviewUrl(currentImageUrl || null);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      if (data.publicUrl) {
        console.log("Single upload success:", data.publicUrl);
        setPreviewUrl(data.publicUrl);
        setPreviewUrls([data.publicUrl]);
        onUploadSuccess(data.publicUrl, filePath);
        toast.success("Image uploaded successfully!"); // Use toast for success
        
        // Clean up the local preview URL
        URL.revokeObjectURL(localPreviewUrl);
      } else {
        const genericError = "Failed to get public URL after upload.";
        console.error(genericError);
        setError(genericError);
        if (onUploadError) onUploadError(genericError);
        toast.error(genericError); // Use toast instead of alert
        // Revert preview on error
        setPreviewUrl(currentImageUrl || null);
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const currentDisplayUrl = allowMultiple ? null : previewUrl;

  return (
    <div className="image-uploader-container mb-3 text-center">
      <label className="form-label fw-medium d-block">{label}</label>

      {!allowMultiple && (
        <div
          className={`image-preview-box single-preview mb-2 ${uploading ? 'uploading' : ''}`}
          style={{ 
            aspectRatio,
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.7 : 1,
            position: 'relative',
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa'
          }}
          onClick={triggerFileInput}
          title={uploading ? "Uploading..." : "Click to change image"}
        >
          {uploading ? (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                padding: '10px'
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
            </div>
          ) : currentDisplayUrl ? (
            <img 
              src={currentDisplayUrl} 
              alt="Preview" 
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          ) : (
            <div className="placeholder-text">
              <i className="bi bi-image fs-1 text-muted"></i>
              <p className="small text-muted mt-1">Click to upload</p>
            </div>
          )}
        </div>
      )}

      {allowMultiple && (
        <div className="multiple-previews-grid mb-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
          {previewUrls.map((url, index) => (
            <div key={index} className="image-preview-box multiple-item" style={{ aspectRatio, position: 'relative' }}>
              <img 
                src={url} 
                alt={`Preview ${index + 1}`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}
              />
            </div>
          ))}
          {(previewUrls.length < 10 || !previewUrls.length) && (
            <div
              className="image-preview-box multiple-item add-more-placeholder"
              style={{ 
                aspectRatio,
                cursor: uploading ? 'not-allowed' : 'pointer',
                border: '2px dashed #dee2e6',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa'
              }}
              onClick={triggerFileInput}
              title={uploading ? "Uploading..." : "Click to add images"}
            >
              <div className="placeholder-text">
                <i className="bi bi-plus-circle-dotted fs-1 text-muted"></i>
                <p className="small text-muted mt-1">Add Images</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        className="d-none"
        onChange={handleFileChange}
        disabled={uploading}
        accept="image/png, image/jpeg, image/webp, image/gif"
        multiple={allowMultiple}
        ref={fileInputRef}
      />

      {!currentDisplayUrl && !allowMultiple && (
        <button 
          type="button" 
          className="btn btn-sm btn-outline-secondary" 
          onClick={triggerFileInput} 
          disabled={uploading}
        >
          <i className="bi bi-upload me-2"></i>
          {uploading ? 'Uploading...' : 'Choose File'}
        </button>
      )}
      
      {allowMultiple && (
        <button 
          type="button" 
          className="btn btn-sm btn-outline-secondary mt-2" 
          onClick={triggerFileInput} 
          disabled={uploading}
        >
          <i className="bi bi-upload me-2"></i>
          {uploading ? 'Uploading...' : 'Choose Files'}
        </button>
      )}

      {uploading && (
        <div className="text-muted small mt-1">
          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          Uploading...
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center mt-2 p-2 small">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;