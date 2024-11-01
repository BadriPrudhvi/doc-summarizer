import { DocumentViewer } from "@/components/document-viewer";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function Home() {
  return (
    <TooltipProvider>
      <DocumentViewer />
    </TooltipProvider>
  );
}
