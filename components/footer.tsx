export function Footer() {
  return (
    <footer className="border-t py-4">
      <div className="container max-w-[90rem] mx-auto px-4">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          Powered by{' '}
          <a 
            href="https://developers.cloudflare.com/workers-ai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Cloudflare Workers AI
          </a>
          {' '}using{' '}
          <a 
            href="https://developers.cloudflare.com/workers-ai/models/llama-3.1-70b-instruct/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Meta Llama 3.1
          </a>
        </p>
      </div>
    </footer>
  )
} 