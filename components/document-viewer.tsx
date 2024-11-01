'use client'

import * as React from 'react'
import { CircleX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DocumentRenderer } from '@/components/document-renderer'
import { DocumentUpload } from '@/components/document-upload'
import { SummarySection } from '@/components/summary-section'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DocumentViewer() {
  const [theme, setTheme] = React.useState('light')
  const [isLoading, setIsLoading] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = React.useState<number>(0)
  const [totalPages, setTotalPages] = React.useState<number>(0)
  const [showRemoveDialog, setShowRemoveDialog] = React.useState(false)
  const [summary, setSummary] = React.useState<string>(
    'Your document summary will appear here after generation.'
  )
  const [customInstructions, setCustomInstructions] = React.useState<string>(
    'Summarize the main points and key findings of the document.'
  )

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const selectedFile = files[0]
      const fileType = selectedFile.type
      
      if (fileType === 'application/pdf' || 
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        alert('Please upload a PDF or DOCX file')
      }
    }
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setCurrentPage(0)
    setTotalPages(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setShowRemoveDialog(false)
  }

  const handleGenerateSummary = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  React.useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full w-full max-w-[90rem] mx-auto grid grid-cols-5 gap-4">
          {/* Document Viewer Section */}
          <div className="col-span-3 h-full">
            <div ref={containerRef} className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">
                    {file ? file.name : 'No document selected'}
                  </span>
                  {file && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setShowRemoveDialog(true)}
                    >
                      <CircleX className="h-4 w-4 mr-1" />
                      Close
                    </Button>
                  )}
                </div>
                {file && totalPages > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden relative">
                {file ? (
                  <DocumentRenderer 
                    file={file} 
                    key={file.name}
                    containerWidth={containerWidth}
                    onPageChange={(current, total) => {
                      setCurrentPage(current)
                      setTotalPages(total)
                    }}
                  />
                ) : (
                  <DocumentUpload
                    onFileSelect={handleFileUpload}
                    fileInputRef={fileInputRef}
                    handleChooseFile={handleChooseFile}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="col-span-2 h-full">
            <SummarySection
              file={file}
              isLoading={isLoading}
              summary={summary}
              customInstructions={customInstructions}
              onInstructionsChange={setCustomInstructions}
              onGenerate={handleGenerateSummary}
            />
          </div>

          {/* Remove Document Dialog */}
          <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this document? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleRemoveFile}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>

      <Footer />
    </div>
  )
}