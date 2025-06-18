"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ProductFormState } from '@/lib/actions/productActions';
import ImageUploader from '@/components/vendor/ImageUploader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/supabaseClient';
import type { ProductImage } from '@/lib/supabaseClient';
import { toast } from 'react-toastify'; // Import react-toastify

interface ProductForEdit extends Omit<Product, 'images'> { 
  category?: { id: string; name: string };
  images_data?: ProductImage[];
}

interface ProductFormProps {
  formAction: (prevState: ProductFormState | undefined, formData: FormData) => Promise<ProductFormState>;
  initialState: ProductFormState;
  categories: { id: string; name: string }[];
  vendorId: string;
  product?: ProductForEdit | null;
  submitButtonText?: string;
}

type UploadedImageInfo = {
  publicUrl: string;
  filePath: string;
  isPrimary: boolean;
  altText?: string;
  localPreview?: string;
  id?: string;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      className="btn btn-primary w-100 w-md-auto" 
      disabled={pending}
    >
      {pending ? (text === 'Add Product' ? 'Adding...' : 'Updating...') : text}
    </button>
  );
}

export default function ProductForm({
  formAction,
  initialState,
  categories,
  vendorId,
  product,
  submitButtonText = product ? "Update Product" : "Add Product"
}: ProductFormProps) {
  const [state, dispatch] = useActionState(formAction, initialState);
  const router = useRouter();
  const [imageUploads, setImageUploads] = useState<UploadedImageInfo[]>(
    product?.images_data?.map(img => ({
      id: img.id,
      publicUrl: img.image_url,
      filePath: img.image_url.substring(img.image_url.indexOf(vendorId)),
      isPrimary: img.is_primary || false,
      altText: img.alt_text,
      localPreview: img.image_url,
    })) || []
  );

  useEffect(() => {
    if (state?.type === 'success' && state.productId) {
      toast.success(state.message); // Use toast instead of alert
      router.push('/vendor/products');
    } else if (state?.type === 'error') {
      toast.error(`Error: ${state.message}`); // Use toast instead of alert
    }
  }, [state, router]);

  const handleImageUploadSuccess = (uploads: { publicUrl: string; filePath: string }[]) => {
    const newImageInfos = uploads.map(upload => ({
      ...upload,
      isPrimary: imageUploads.length === 0 && uploads.length === 1,
      altText: '',
      localPreview: upload.publicUrl,
    }));
    setImageUploads(prev => [...prev, ...newImageInfos]);
  };

  const removeImage = (index: number) => {
    setImageUploads(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    setImageUploads(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  return (
    <form action={dispatch} className="container-fluid">
      <input type="hidden" name="image_uploads" value={JSON.stringify(imageUploads)} />

      <div className="mb-4">
        <label htmlFor="name" className="form-label fw-medium">
          Product Name <span className="text-danger">*</span>
        </label>
        <input 
          type="text" 
          name="name" 
          id="name" 
          className="form-control form-control-lg" 
          defaultValue={product?.name} 
          required 
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="form-label fw-medium">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className="form-control form-control-lg"
          rows={4}
          defaultValue={product?.description}
        />
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6 mb-4">
          <label htmlFor="base_price" className="form-label fw-medium">
            Base Price (PKR) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            name="base_price"
            id="base_price"
            className="form-control form-control-lg"
            step="0.01"
            min="0.01"
            defaultValue={product?.base_price}
            required
          />
        </div>

        <div className="col-12 col-md-6 mb-4">
          <label htmlFor="quantity" className="form-label fw-medium">
            Quantity in Stock <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            className="form-control form-control-lg"
            min="0"
            defaultValue={product?.quantity}
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="category_id" className="form-label fw-medium">
          Category <span className="text-danger">*</span>
        </label>
        <select
          name="category_id"
          id="category_id"
          className="form-select form-select-lg"
          defaultValue={product?.category_id || product?.category?.id}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label fw-medium">Product Images</label>
        <ImageUploader
          bucketName="product-images"
          filePathPrefix={`vendors/${vendorId}/products/`}
          onUploadSuccess={() => {}}
          onMultipleUploadSuccess={handleImageUploadSuccess}
          label="Upload New Images (Select multiple)"
          allowMultiple={true}
        />
        {imageUploads.length > 0 && (
          <div className="mt-3 p-3 border rounded bg-light">
            <p className="fw-medium"><strong>Uploaded Images:</strong> (Click to set primary, Red X to remove)</p>
            <div className="d-flex flex-wrap gap-3">
              {imageUploads.map((img, index) => (
                <div
                  key={index}
                  className={`p-2 border rounded text-center ${img.isPrimary ? 'border-primary border-2' : ''}`}
                  style={{ cursor: 'pointer', width: '120px' }}
                >
                  <img
                    src={img.localPreview || img.publicUrl}
                    alt={img.altText || `Product Image ${index + 1}`}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                    onClick={() => setPrimaryImage(index)}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-2 w-100"
                    onClick={() => removeImage(index)}
                  >
                    X
                  </button>
                  {img.isPrimary && <span className="badge bg-primary d-block mt-2">Primary</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-check mb-4">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          className="form-check-input"
          defaultChecked={product ? product.is_active : true}
        />
        <label htmlFor="is_active" className="form-check-label">
          Product is Active (visible to customers)
        </label>
      </div>

      {state?.message && (
        <div className={`alert ${state.type === 'error' ? 'alert-danger' : 'alert-success'} mt-4`}>
          {state.message}
        </div>
      )}

      <div className="d-flex flex-column flex-md-row gap-2">
        <SubmitButton text={submitButtonText} />
        <button 
          type="button" 
          className="btn btn-secondary w-100 w-md-auto" 
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}