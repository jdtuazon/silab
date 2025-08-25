"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { UploadModal } from "@/components/ui/upload-modal";
import {
  Upload,
  FileText,
  Shield,
  TrendingUp,
  BarChart3,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  File,
  Grid,
  List,
  Settings,
  RefreshCw,
  Search,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "regulatory" | "case-study" | "market-context";
  category: string;
  size: string;
  uploadedAt: string;
  status: "processing" | "completed" | "error";
  description?: string;
  tags: string[];
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "pending" | "processing" | "ready"
  >("pending");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock initial documents
  const mockDocuments: Document[] = [
    {
      id: "1",
      name: "BSP Circular 1088 - Digital Banking Guidelines",
      type: "regulatory",
      category: "Digital Banking",
      size: "2.4 MB",
      uploadedAt: "2024-01-15",
      status: "completed",
      description:
        "Latest guidelines for digital banking operations and compliance requirements.",
      tags: ["BSP", "Digital Banking", "Compliance", "Guidelines"],
    },
    {
      id: "2",
      name: "Credit Card Product Case Study - 2024",
      type: "case-study",
      category: "Credit Cards",
      size: "1.8 MB",
      uploadedAt: "2024-01-10",
      status: "completed",
      description:
        "Comprehensive analysis of successful credit card product launch and market performance.",
      tags: ["Case Study", "Credit Cards", "Product Launch", "Success"],
    },
    {
      id: "3",
      name: "PSA Consumer Confidence Survey Q4 2023",
      type: "market-context",
      category: "Market Research",
      size: "3.2 MB",
      uploadedAt: "2024-01-05",
      status: "completed",
      description:
        "Quarterly consumer confidence index and economic sentiment analysis.",
      tags: ["PSA", "Consumer Confidence", "Market Research", "Q4 2023"],
    },
    {
      id: "4",
      name: "BSP Financial Inclusion Report 2023",
      type: "regulatory",
      category: "Financial Inclusion",
      size: "4.1 MB",
      uploadedAt: "2023-12-20",
      status: "completed",
      description:
        "Annual report on financial inclusion initiatives and regulatory framework.",
      tags: ["BSP", "Financial Inclusion", "Annual Report", "2023"],
    },
    {
      id: "5",
      name: "Microfinance Loan Success Story - Rural Areas",
      type: "case-study",
      category: "Microfinance",
      size: "1.5 MB",
      uploadedAt: "2023-12-15",
      status: "completed",
      description:
        "Case study on successful microfinance implementation in rural communities.",
      tags: ["Case Study", "Microfinance", "Rural", "Success"],
    },
  ];

  // Initialize with mock data
  useState(() => {
    setDocuments(mockDocuments);
  });

  useCallback((acceptedFiles: File[]) => {
    setPendingFiles(acceptedFiles);
    setUploadStatus("processing");
    setIsModalOpen(true);

    // Simulate file processing (e.g., virus scan, format check)
    setTimeout(() => {
      setUploadStatus("ready");
    }, 1500);
  }, []);

  useCallback(() => {
    const newDocuments: Document[] = pendingFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: "regulatory" as const,
      category: getCategoryFromType("regulatory"),
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "processing",
      tags: [],
    }));

    setDocuments((prev) => [...prev, ...newDocuments]);
    setUploadStatus("pending");
    setIsModalOpen(false);
    setPendingFiles([]);

    // Simulate upload completion
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          newDocuments.some((nd) => nd.name === doc.name)
            ? { ...doc, status: "completed" as const }
            : doc
        )
      );
    }, 2000);
  }, [pendingFiles]);

  useCallback(() => {
    setUploadStatus("pending");
    setIsModalOpen(false);
    setPendingFiles([]);
  }, []);

  const getCategoryFromType = (type: string): string => {
    switch (type) {
      case "regulatory":
        return "Regulatory";
      case "case-study":
        return "Case Study";
      case "market-context":
        return "Market Research";
      default:
        return "Other";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "processing":
        return <Clock className="w-4 h-4 text-warning animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-error" />;
      default:
        return <File className="w-4 h-4 text-muted-text" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "regulatory":
        return <Shield className="w-5 h-5 text-blue-500" />;
      case "case-study":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "market-context":
        return <BarChart3 className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const DocumentDropzone = ({
    title,
    description,
    icon: Icon,
  }: {
    type: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        setPendingFiles(acceptedFiles);
        setUploadStatus("pending");
        setIsModalOpen(true);
      },
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "text/plain": [".txt"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      multiple: true,
    });

    return (
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-primary bg-primary-light/10"
            : "border-neutral-300 hover:border-primary hover:bg-neutral-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-light/20 rounded-full">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-primary-text mb-2">
            {title}
          </h3>
          <p className="text-secondary-text mb-4">{description}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-text">
            <Upload className="w-4 h-4" />
            <span>Drag & drop files here or click to browse</span>
          </div>
          <div className="mt-3 text-xs text-muted-text">
            Supports: PDF, DOC, DOCX, TXT, XLS, XLSX
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        files={pendingFiles}
        uploadStatus={uploadStatus}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          setUploadStatus("processing");
          try {
            // TODO: Implement actual file upload logic here
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated upload
            setUploadStatus("ready");
            setPendingFiles([]);
            setIsModalOpen(false);
            // TODO: Refresh documents list after successful upload
          } catch (error) {
            console.error("Upload failed:", error);
            setUploadStatus("pending");
          }
        }}
      />

      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Page Header */}
      <div className="bg-bg-primary border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-text">Documents</h1>
            <p className="text-secondary-text">
              Manage your knowledge graph documents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-text hover:text-primary hover:bg-neutral-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-text hover:text-primary hover:bg-neutral-100 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Upload Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DocumentDropzone
            type="regulatory"
            title="Regulatory Documents"
            description="BSP circulars, guidelines, and compliance documents"
            icon={Shield}
          />
          <DocumentDropzone
            type="case-study"
            title="Product Case Studies"
            description="Success stories, product launches, and performance analysis"
            icon={TrendingUp}
          />
          <DocumentDropzone
            type="market-context"
            title="Market Context Documents"
            description="PSA surveys, BSP reports, and market research"
            icon={BarChart3}
          />
        </div>

        {/* Controls */}
        <div className="bg-bg-primary rounded-xl border border-neutral-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-text" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="all">All Types</option>
                <option value="regulatory">Regulatory</option>
                <option value="case-study">Case Studies</option>
                <option value="market-context">Market Context</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-muted-text hover:text-primary hover:bg-neutral-100"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-muted-text hover:text-primary hover:bg-neutral-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Documents Archive - Containerized by Type */}
        <div className="space-y-8">
          {/* Regulatory Documents */}
          <div className="bg-bg-primary rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-500" />
                <h2 className="text-lg font-semibold text-primary-text">
                  Regulatory Documents
                </h2>
                <span className="text-sm text-muted-text">
                  (
                  {
                    filteredDocuments.filter((d) => d.type === "regulatory")
                      .length
                  }
                  )
                </span>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments
                  .filter((doc) => doc.type === "regulatory")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-primary-text truncate">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-muted-text">
                              {doc.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(doc.status)}
                        </div>
                      </div>

                      {doc.description && (
                        <p className="text-sm text-secondary-text mb-4 line-clamp-2">
                          {doc.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-text">
                          <span>{doc.size}</span>
                          <span>{doc.uploadedAt}</span>
                        </div>

                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {doc.tags.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                +{doc.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                          <button className="p-1 text-muted-text hover:text-primary transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-text hover:text-primary transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-text hover:text-error transition-colors ml-auto">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments
                  .filter((doc) => doc.type === "regulatory")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getTypeIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary-text truncate">
                            {doc.name}
                          </h3>
                          <p className="text-sm text-secondary-text">
                            {doc.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-text">
                        <span>{doc.size}</span>
                        <span>{doc.uploadedAt}</span>
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-muted-text hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-muted-text hover:text-primary transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-muted-text hover:text-error transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {filteredDocuments.filter((d) => d.type === "regulatory").length ===
              0 && (
              <div className="text-center py-8">
                <Shield className="w-8 h-8 text-muted-text mx-auto mb-2" />
                <p className="text-sm text-muted-text">
                  No regulatory documents found
                </p>
              </div>
            )}
          </div>

          {/* Product Case Studies */}
          <div className="bg-bg-primary rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h2 className="text-lg font-semibold text-primary-text">
                  Product Case Studies
                </h2>
                <span className="text-sm text-muted-text">
                  (
                  {
                    filteredDocuments.filter((d) => d.type === "case-study")
                      .length
                  }
                  )
                </span>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments
                  .filter((doc) => doc.type === "case-study")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-primary-text truncate">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-muted-text">
                              {doc.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(doc.status)}
                        </div>
                      </div>

                      {doc.description && (
                        <p className="text-sm text-secondary-text mb-4 line-clamp-2">
                          {doc.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-text">
                          <span>{doc.size}</span>
                          <span>{doc.uploadedAt}</span>
                        </div>

                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {doc.tags.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                +{doc.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                          <button className="p-1 text-muted-text hover:text-primary transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-text hover:text-primary transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-text hover:text-error transition-colors ml-auto">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments
                  .filter((doc) => doc.type === "case-study")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getTypeIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary-text truncate">
                            {doc.name}
                          </h3>
                          <p className="text-sm text-secondary-text">
                            {doc.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-text">
                        <span>{doc.size}</span>
                        <span>{doc.uploadedAt}</span>
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-muted-text hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-muted-text hover:text-primary transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-muted-text hover:text-error transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {filteredDocuments.filter((d) => d.type === "case-study").length ===
              0 && (
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 text-muted-text mx-auto mb-2" />
                <p className="text-sm text-muted-text">No case studies found</p>
              </div>
            )}
          </div>

          {/* Market Context Documents */}
          <div className="bg-bg-primary rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                <h2 className="text-lg font-semibold text-primary-text">
                  Market Context Documents
                </h2>
                <span className="text-sm text-muted-text">
                  (
                  {
                    filteredDocuments.filter((d) => d.type === "market-context")
                      .length
                  }
                  )
                </span>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments
                  .filter((doc) => doc.type === "market-context")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-primary-text truncate">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-muted-text">
                              {doc.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(doc.status)}
                        </div>
                      </div>

                      {doc.description && (
                        <p className="text-sm text-secondary-text mb-4 line-clamp-2">
                          {doc.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-text">
                          <span>{doc.size}</span>
                          <span>{doc.uploadedAt}</span>
                        </div>

                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {doc.tags.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                                +{doc.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                          <button className="p-1 text-muted-text hover:text-primary transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-text hover:text-primary transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-muted-text hover:text-error transition-colors ml-auto">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments
                  .filter((doc) => doc.type === "market-context")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getTypeIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary-text truncate">
                            {doc.name}
                          </h3>
                          <p className="text-sm text-secondary-text">
                            {doc.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-text">
                        <span>{doc.size}</span>
                        <span>{doc.uploadedAt}</span>
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-muted-text hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-muted-text hover:text-primary transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-muted-text hover:text-error transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {filteredDocuments.filter((d) => d.type === "market-context")
              .length === 0 && (
              <div className="text-center py-8">
                <BarChart3 className="w-8 h-8 text-muted-text mx-auto mb-2" />
                <p className="text-sm text-muted-text">
                  No market context documents found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
