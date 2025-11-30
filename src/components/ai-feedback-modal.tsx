'use client';
import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAIFeedback } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { projects } from '@/lib/data';

type Project = (typeof projects)[0];

export function AIFeedbackModal({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetFeedback = async () => {
    setIsLoading(true);
    setFeedback(null);
    const result = await getAIFeedback({
      projectType: project.category as 'code' | 'music',
      projectDescription: project.description,
      projectContent: project.content,
    });
    setIsLoading(false);
    if (result.success) {
      setFeedback(result.suggestions ?? 'No suggestions available.');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Bot className="mr-2 h-4 w-4" /> Get AI Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Feedback for "{project.title}"</DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions to improve your project. Click the button below to start.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Button onClick={handleGetFeedback} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Suggestions'
            )}
          </Button>
        </div>
        {feedback && (
          <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>Suggestions</AlertTitle>
            <AlertDescription>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap dark:prose-invert">
                {feedback}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
