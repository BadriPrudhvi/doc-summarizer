'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface DocumentRendererProps {
  file: File | null
  containerWidth: number
  onPageChange: (currentPage: number, totalPages: number) => void
}

export function DocumentRenderer({ file, containerWidth, onPageChange }: DocumentRendererProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pageWidth = containerWidth - 64 // Increased padding for better fit
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (file) {
      try {
        const url = URL.createObjectURL(file)
        setFileUrl(url)
        setError(null)
        return () => {
          URL.revokeObjectURL(url)
          setFileUrl(null)
        }
      } catch (err) {
        setError('Error creating URL for PDF')
        console.error(err)
      }
    }
  }, [file])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container
      const pageElements = container.getElementsByClassName('react-pdf__Page')
      
      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i] as HTMLElement
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top - container.getBoundingClientRect().top
        
        if (elementTop >= 0 && elementTop <= clientHeight / 2) {
          setCurrentPage(i + 1)
          onPageChange(i + 1, numPages)
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [numPages, onPageChange])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
    setCurrentPage(1)
    onPageChange(1, numPages)
    setError(null)
  }

  function onDocumentLoadError(err: Error): void {
    console.error('Error loading document:', err)
    setError('Error loading PDF. Please try again.')
  }

  if (!fileUrl) return null

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-y-auto overflow-x-hidden"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        padding: '1rem'
      }}
    >
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="flex flex-col items-center"
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        }
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="mb-4 shadow-lg"
            width={pageWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
              </div>
            }
          />
        ))}
      </Document>
    </div>
  )
} 