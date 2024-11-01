import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DocumentUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleChooseFile: () => void
}

export function DocumentUpload({ onFileSelect, fileInputRef, handleChooseFile }: DocumentUploadProps) {
  return (
    <div className="h-full bg-muted rounded-lg m-4 flex items-center justify-center">
      <div className="text-center p-8">
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your document here or click to browse
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx"
          onChange={onFileSelect}
        />
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleChooseFile}
        >
          Choose File
        </Button>
      </div>
    </div>
  )
} 