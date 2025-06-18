// components/ProductImagesGallery.tsx
"use client";
import { useState, useEffect } from 'react';
import { ProductImage } from '@/lib/supabaseClient';

interface ProductImagesGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImagesGallery: React.FC<ProductImagesGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images.find(img => img.is_primary)?.image_url || (images.length > 0 ? images[0].image_url : '/placeholder-image.png'));

  useEffect(() => {
    setSelectedImage(images.find(img => img.is_primary)?.image_url || (images.length > 0 ? images[0].image_url : '/placeholder-image.png'));
  }, [images]);

  if (!images || images.length === 0) {
    return <img src="/placeholder-image.png" alt={productName} className="img-fluid rounded product-detail-main-img shadow-lg" />;
  }

  return (
    <div className="product-gallery">
      <div className="text-center mb-3 product-gallery-main-image-wrapper">
        <img
          src={selectedImage}
          alt={productName}
          className="img-fluid rounded product-detail-main-img shadow-lg"
        />
      </div>
      {images.length > 1 && (
        <div className="d-flex flex-wrap justify-content-center product-gallery-thumbnails">
          {images.map((image) => (
            <div
              key={image.id}
              className={`thumbnail-wrapper m-1 p-1 rounded ${selectedImage === image.image_url ? 'active' : ''}`}
              onClick={() => setSelectedImage(image.image_url)}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || `${productName} thumbnail`}
                className="img-fluid rounded product-thumbnail"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImagesGallery;