"use client";
import Link from "next/link";
import { Product } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface ProductListClientProps {
  products: Product[];
  deleteProductAction: (
    productId: string
  ) => Promise<{ success: boolean; message: string }>;
}

export default function ProductListClient({
  products,
  deleteProductAction,
}: ProductListClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        const result = await deleteProductAction(productToDelete.id);
        if (result.success) {
          toast.success(result.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          router.refresh();
        } else {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        toast.error("An error occurred while deleting the product.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
    setShowModal(false);
    setProductToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="table-responsive vendor-product-list">
      <ToastContainer />
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{productToDelete?.name}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col" className="text-end">
              Base Price
            </th>
            <th scope="col" className="text-end">
              Sell Price
            </th>
            <th scope="col" className="text-center">
              Quantity
            </th>
            <th scope="col" className="text-center">
              Status
            </th>
            <th scope="col" className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={
                    product.images?.find((img) => img.is_primary)?.image_url ||
                    product.images?.[0]?.image_url ||
                    "/placeholder-image.png"
                  }
                  alt={product.name}
                  className="product-list-thumbnail"
                />
              </td>
              <td className="fw-medium product-name-link">{product.name}</td>
              <td className="text-muted small">{product.category_name}</td>
              <td className="text-end">PKR {product.base_price.toFixed(2)}</td>
              <td className="text-end fw-bold">
                PKR {product.frontend_price.toFixed(2)}
              </td>
              <td className="text-center">{product.quantity}</td>
              <td className="text-center">
                <span
                  className={`badge rounded-pill ${
                    product.is_active
                      ? "bg-success-soft text-success"
                      : "bg-secondary-soft text-secondary"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="text-center action-buttons">
                <Link
                  href={`/vendor/products/edit/${product.id}`}
                  className="btn btn-sm btn-outline-green me-2"
                  title="Edit"
                >
                  <i className="bi bi-pencil-square"></i>
                </Link>
                <button
                  onClick={() => handleDeleteClick(product.id, product.name)}
                  className="btn btn-sm btn-outline-danger"
                  title="Delete"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}