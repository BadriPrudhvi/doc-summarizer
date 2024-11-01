import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

interface SummarySectionProps {
  file: File | null
  isLoading: boolean
  summary: string
  customInstructions: string
  onInstructionsChange: (value: string) => void
  onGenerate: () => void
}

export function SummarySection({
  file,
  isLoading,
  summary,
  customInstructions,
  onInstructionsChange,
  onGenerate
}: SummarySectionProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Document Summary</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Custom Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Customize how you want the document to be summarized.
                </p>
                <Textarea
                  placeholder="Enter your instructions here..."
                  value={customInstructions}
                  onChange={(e) => onInstructionsChange(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white w-24"
          onClick={onGenerate}
          disabled={isLoading || !file}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            'Generate'
          )}
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col p-4">
        <ScrollArea className="flex-1 rounded-md">
          {file ? (
            <div className="text-sm text-muted-foreground">
              {summary}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-4">
              <p className="text-sm text-muted-foreground">
                Upload a document to generate its summary
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
} 