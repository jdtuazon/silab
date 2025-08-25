"use client";

import { useState, useRef } from "react";
import { X, Plus, Upload, File } from "lucide-react";
import { ProductStatus } from "@/types/product";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: CreateProductData) => void;
}

interface CreateProductData {
  name: string;
  category: string;
  status: ProductStatus;
  tags: string[];
  documentBrief?: File; // Made optional with ?
}

const statusOptions: { value: ProductStatus; label: string }[] = [
  { value: "in-dev", label: "In Development" },
  { value: "qa", label: "Quality Assurance" },
  { value: "prod", label: "Production" },
  { value: "archived", label: "Archived" },
];

export function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProductModalProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    category: "",
    status: "in-dev",
    tags: [],
    documentBrief: undefined,
  });

  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name.trim() &&
      formData.category.trim() &&
      formData.documentBrief
    ) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: "",
        category: "",
        status: "in-dev",
        tags: [],
        documentBrief: undefined,
      });
      setTagInput("");
      onClose();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        documentBrief: file,
      }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      documentBrief: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-primary-text">
            Create New Product
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-secondary-text" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-secondary-text mb-2"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-neutral-400"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-secondary-text mb-2"
            >
              Category *
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-neutral-400"
              placeholder="e.g., Web Application, Mobile App, API"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-secondary-text mb-2"
            >
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as ProductStatus,
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-neutral-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-secondary-text mb-2"
            >
              Tags
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tag display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-primary-light text-primary rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-primary-hover transition-colors duration-150"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Document Brief Upload */}
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">
              Product Brief Document *
              <span className="text-xs text-muted-text ml-1">
                (Features, specifications, compliance requirements)
              </span>
            </label>
            <div className="space-y-2">
              {!formData.documentBrief ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-6 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary hover:bg-primary-light/10 transition-all duration-200 cursor-pointer text-center"
                >
                  <Upload className="w-6 h-6 text-muted-text mx-auto mb-2" />
                  <p className="text-sm text-secondary-text">
                    Click to upload document
                  </p>
                  <p className="text-xs text-muted-text mt-1">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-primary-light/20 border border-primary-light rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-primary-text">
                        {formData.documentBrief.name}
                      </p>
                      <p className="text-xs text-muted-text">
                        {(formData.documentBrief.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 text-muted-text hover:text-red-500 transition-colors duration-150"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 text-secondary-text rounded-lg hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-inverse rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
