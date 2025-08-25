"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, Loader2, CheckCircle, AlertCircle, FileJson } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadPanelProps {
  onFileUpload: (file: File) => void
  onTextInput: (text: string) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  analysisProgress: number
  documentContent: string
  onJsonUpload?: (jsonData: Record<string, unknown>) => void
  compact?: boolean
}

export function UploadPanel({
  onFileUpload,
  onTextInput,
  onAnalyze,
  isAnalyzing,
  analysisProgress,
  documentContent,
  onJsonUpload,
  compact = false,
}: UploadPanelProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [textInput, setTextInput] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // JSON upload states
  const [jsonFile, setJsonFile] = useState<File | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [jsonDragOver, setJsonDragOver] = useState(false)
  const jsonInputRef = useRef<HTMLInputElement>(null)

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

  // JSON upload handlers
  const handleJsonDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setJsonDragOver(true)
  }

  const handleJsonDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setJsonDragOver(false)
  }

  const handleJsonDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setJsonDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file) {
      validateAndUploadJson(file)
    }
  }

  const handleJsonSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndUploadJson(file)
    }
  }

  const validateAndUploadJson = async (file: File) => {
    setJsonError(null)
    
    // Check if it's a JSON file
    if (!file.name.toLowerCase().endsWith('.json')) {
      setJsonError("Please select a JSON file")
      return
    }
    
    // Check file size (5MB limit for JSON)
    if (file.size > 5 * 1024 * 1024) {
      setJsonError("JSON file too large (max 5MB)")
      return
    }
    
    try {
      const text = await file.text()
      const jsonData = JSON.parse(text)
      
      // Basic validation - check if it looks like our analysis format
      if (!jsonData.section_analyses && !jsonData.analysis_results) {
        setJsonError("Invalid analysis JSON format")
        return
      }
      
      setJsonFile(file)
      if (onJsonUpload) {
        onJsonUpload(jsonData)
      }
    } catch (error) {
      setJsonError("Invalid JSON file")
    }
  }

  const canAnalyze = documentContent.trim().length > 0 && !isAnalyzing

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Compact File Upload */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 border border-dashed rounded-md text-sm cursor-pointer transition-all",
            isDragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
            uploadedFile && !uploadError && "border-green-400 bg-green-50",
            uploadError && "border-red-400 bg-red-50"
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
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : uploadedFile ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Upload className="h-4 w-4 text-muted-foreground" />
          )}
          
          <span className="text-foreground">
            {uploadError ? "Upload Error" 
             : uploadedFile ? uploadedFile.name
             : "Upload Document"}
          </span>
        </div>

        {/* Compact JSON Upload */}
        {onJsonUpload && (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 border border-dashed rounded-md text-sm cursor-pointer transition-all",
              jsonDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300",
              jsonFile && !jsonError && "border-blue-400 bg-blue-50",
              jsonError && "border-red-300 bg-red-50"
            )}
            onDragOver={handleJsonDragOver}
            onDragLeave={handleJsonDragLeave}
            onDrop={handleJsonDrop}
            onClick={() => jsonInputRef.current?.click()}
          >
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonSelect}
              className="hidden"
            />
            
            {jsonError ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : jsonFile ? (
              <CheckCircle className="h-4 w-4 text-blue-600" />
            ) : (
              <FileJson className="h-4 w-4 text-blue-600" />
            )}
            
            <span className="text-foreground">
              {jsonError ? "JSON Error"
               : jsonFile ? jsonFile.name
               : "Load JSON"}
            </span>
          </div>
        )}

        {/* Compact Analyze Button */}
        <Button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          size="sm"
          className="whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </Button>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="flex items-center gap-2 min-w-0">
            <Progress value={analysisProgress} className="h-2 w-20" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {Math.round(analysisProgress)}%
            </span>
          </div>
        )}
      </div>
    )
  }

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
        </CardContent>
      </Card>

      {/* JSON Upload Section */}
      {onJsonUpload && (
        <Card className="border-dashed border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <FileJson className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">Load Analysis Results</h4>
                <p className="text-xs text-muted-foreground">Upload a previously saved JSON analysis file</p>
              </div>
            </div>
            
            <div
              className={cn(
                "border border-dashed rounded-md p-3 text-center transition-all duration-200 cursor-pointer",
                jsonDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300",
                jsonFile && !jsonError && "border-blue-400 bg-blue-50",
                jsonError && "border-red-300 bg-red-50"
              )}
              onDragOver={handleJsonDragOver}
              onDragLeave={handleJsonDragLeave}
              onDrop={handleJsonDrop}
              onClick={() => jsonInputRef.current?.click()}
            >
              <input
                ref={jsonInputRef}
                type="file"
                accept=".json"
                onChange={handleJsonSelect}
                className="hidden"
              />
              
              {jsonError ? (
                <div className="space-y-1">
                  <AlertCircle className="h-5 w-5 mx-auto text-red-500" />
                  <p className="text-xs text-red-600">{jsonError}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={(e) => { e.stopPropagation(); setJsonError(null); setJsonFile(null); }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : jsonFile ? (
                <div className="space-y-1">
                  <CheckCircle className="h-5 w-5 mx-auto text-blue-600" />
                  <p className="text-xs font-medium text-blue-700">{jsonFile.name}</p>
                  <p className="text-xs text-blue-600">Analysis loaded</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <FileJson className="h-5 w-5 mx-auto text-gray-400" />
                  <p className="text-xs text-gray-600">Drop JSON or click to browse</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
      {(uploadedFile) && !uploadError && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Document Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
