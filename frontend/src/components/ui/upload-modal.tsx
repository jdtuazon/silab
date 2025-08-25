"use client";

import { useState } from "react";
import { LoaderCircle, X, CheckCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  files: File[];
  uploadStatus: "pending" | "processing" | "ready";
}

export function UploadModal({
  isOpen,
  onClose,
  onConfirm,
  files,
  uploadStatus,
}: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upload Documents</h3>

          {/* File List */}
          <div className="max-h-60 space-y-2 overflow-auto">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <span className="truncate text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2 py-4">
            {uploadStatus === "processing" && (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">
                  Uploading files...
                </span>
              </>
            )}
            {uploadStatus === "ready" && (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Files validated</span>
              </>
            )}
            {uploadStatus === "pending" && (
              <span className="text-sm text-gray-600">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={uploadStatus === "processing"}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={uploadStatus === "processing"}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadStatus === "processing" ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
