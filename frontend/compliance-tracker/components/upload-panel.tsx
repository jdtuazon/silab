"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadPanelProps {
  onFileUpload: (file: File) => void
  onTextInput: (text: string) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  analysisProgress: number
  documentContent: string
}

export function UploadPanel({
  onFileUpload,
  onTextInput,
  onAnalyze,
  isAnalyzing,
  analysisProgress,
  documentContent,
}: UploadPanelProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [textInput, setTextInput] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      validateAndUploadFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndUploadFile(file)
    }
  }

  const validateAndUploadFile = (file: File) => {
    setUploadError(null)

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit")
      return
    }

    // Check file type
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    const allowedExtensions = [".txt", ".pdf", ".docx"]

    if (!allowedTypes.includes(file.type) && !allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setUploadError("Unsupported file type. Please use PDF, TXT, or DOCX files.")
      return
    }

    setUploadedFile(file)
    onFileUpload(file)
    setTextInput("")
  }

  const handleTextChange = (value: string) => {
    setTextInput(value)
    onTextInput(value)
    setUploadedFile(null)
    setUploadError(null)
  }

  const canAnalyze = documentContent.trim().length > 0 && !isAnalyzing

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Document Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer",
              isDragOver ? "border-accent bg-accent/5 scale-[1.02]" : "border-border hover:border-accent/50",
              uploadedFile && !uploadError && "border-compliant bg-compliant/5",
              uploadError && "border-destructive bg-destructive/5",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploadError ? (
              <div className="space-y-2">
                <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
                <p className="text-sm font-medium text-destructive">Upload Error</p>
                <p className="text-xs text-destructive">{uploadError}</p>
                <Button variant="outline" size="sm" onClick={() => setUploadError(null)}>
                  Try Again
                </Button>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 mx-auto text-compliant" />
                <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                <p className="text-xs text-compliant">Ready for analysis</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-foreground">Drag files here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF, TXT, DOCX (max 10MB)</p>
              </div>
            )}
          </div>

          {/* Text Input Alternative */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Or paste your document text:</label>
            <Textarea
              placeholder="Paste your document content here for analysis..."
              value={textInput}
              onChange={(e) => handleTextChange(e.target.value)}
              className="min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-accent/20"
            />
            {textInput && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{textInput.length} characters</span>
                <span
                  className={cn("font-medium", textInput.length > 100 ? "text-compliant" : "text-muted-foreground")}
                >
                  {textInput.length > 100 ? "Ready for analysis" : "Need more content"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Analysis Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="w-full transition-all duration-200 hover:scale-[1.02]"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Document"
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Analyzing document for compliance violations...</p>
                <p className="text-accent">
                  {analysisProgress < 30 && "Parsing document structure..."}
                  {analysisProgress >= 30 && analysisProgress < 60 && "Checking regulatory compliance..."}
                  {analysisProgress >= 60 && analysisProgress < 90 && "Identifying violations..."}
                  {analysisProgress >= 90 && "Finalizing analysis..."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Info */}
      {(uploadedFile || textInput) && !uploadError && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Document Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {uploadedFile ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Filename:</span>
                  <span className="text-foreground font-medium">{uploadedFile.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="text-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground">{uploadedFile.type || "Document"}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Text Length:</span>
                <span className="text-foreground">{textInput.length} characters</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Upload Time:</span>
              <span className="text-foreground">{new Date().toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
