import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ArrowUp, FolderCode, Globe, Mic, Paperclip, Settings, Square, StopCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none",
      className,
    )}
    ref={ref}
    rows={1}
    {...props}
  />
));
Textarea.displayName = "Textarea";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm", className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-[90vw] md:max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#333333] bg-[#1F2023] shadow-xl",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[#2E3033]/80 p-2 hover:bg-[#2E3033] transition-colors">
        <X className="h-5 w-5 text-gray-200" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight text-gray-100", className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      variant === "default" ? "bg-white text-black hover:bg-white/80" : "bg-transparent text-[#9CA3AF] hover:bg-gray-600/30 hover:text-[#D1D5DB]",
      className,
    )}
    {...props}
  />
));
Button.displayName = "Button";

interface ImageViewDialogProps {
  imageUrl: string | null;
  onClose: () => void;
}

function ImageViewDialog({ imageUrl, onClose }: ImageViewDialogProps) {
  if (!imageUrl) return null;
  return (
    <Dialog open={Boolean(imageUrl)} onOpenChange={onClose}>
      <DialogContent className="border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden rounded-2xl bg-[#1F2023]"
        >
          <img src={imageUrl} alt="Full preview" className="max-h-[80vh] w-full object-contain" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(
  ({ onSend = () => {}, isLoading = false, placeholder = "I want to...", className }, ref) => {
    const [input, setInput] = React.useState("");
    const [files, setFiles] = React.useState<File[]>([]);
    const [filePreview, setFilePreview] = React.useState<string | null>(null);
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [showThink, setShowThink] = React.useState(false);
    const [showCanvas, setShowCanvas] = React.useState(false);
    const [recordTime, setRecordTime] = React.useState(0);
    const uploadInputRef = React.useRef<HTMLInputElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      const styleId = "atla-ai-prompt-box-style";
      if (document.getElementById(styleId)) return;
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = `
        .atla-ai-prompt-box textarea::-webkit-scrollbar { width: 6px; }
        .atla-ai-prompt-box textarea::-webkit-scrollbar-track { background: transparent; }
        .atla-ai-prompt-box textarea::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 3px; }
      `;
      document.head.appendChild(styleEl);
    }, []);

    React.useEffect(() => {
      if (!textareaRef.current) return;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }, [input]);

    React.useEffect(() => {
      if (!isRecording) return;
      const interval = window.setInterval(() => setRecordTime((current) => current + 1), 1000);
      return () => window.clearInterval(interval);
    }, [isRecording]);

    const processFile = (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 10 * 1024 * 1024) return;
      setFiles([file]);
      const reader = new FileReader();
      reader.onload = () => setFilePreview(typeof reader.result === "string" ? reader.result : null);
      reader.readAsDataURL(file);
    };

    const submit = () => {
      const value = input.trim();
      if (!value && files.length === 0) return;

      const prefix = showSearch ? "[Search] " : showThink ? "[Think] " : showCanvas ? "[Canvas] " : "";
      onSend(`${prefix}${value}`, files);
      setInput("");
      setFiles([]);
      setFilePreview(null);
      setIsRecording(false);
      setRecordTime(0);
    };

    const hasContent = input.trim().length > 0 || files.length > 0;
    const formatTime = `${String(Math.floor(recordTime / 60)).padStart(2, "0")}:${String(recordTime % 60).padStart(2, "0")}`;

    return (
      <>
        <TooltipProvider>
          <div
            ref={ref}
            className={cn(
              "atla-ai-prompt-box rounded-[38px] border border-[#575c69] bg-[#1C1F27] px-5 pt-5 pb-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
              isRecording && "border-red-500/70",
              className,
            )}
          >
            {filePreview ? (
              <div className="pb-2">
                <button
                  type="button"
                  className="group relative h-16 w-16 overflow-hidden rounded-xl"
                  onClick={() => setSelectedImage(filePreview)}
                >
                  <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />
                  <span className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 opacity-100">
                    <X className="h-3 w-3 text-white" />
                  </span>
                </button>
              </div>
            ) : null}

            {!isRecording ? (
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submit();
                  }
                }}
                placeholder={
                  showSearch
                    ? "Search the archive..."
                    : showThink
                      ? "Think deeply..."
                      : showCanvas
                        ? "Create on canvas..."
                        : placeholder
                }
                className="max-h-[220px] min-h-[64px] px-1 py-0 text-[32px] leading-[1.2] text-[#c7ccd7] placeholder:text-[#8f97a8] md:text-[42px]"
                disabled={isLoading}
              />
            ) : (
              <div className="flex items-center justify-between py-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-sm text-white/80">{formatTime}</span>
                </div>
                <span className="text-xs text-white/50">Recording...</span>
              </div>
            )}

            <div className="flex items-end justify-between gap-3 pt-3">
              <div className="flex items-center gap-2.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#A6ADBC] hover:bg-white/5 hover:text-[#E3E8F2]"
                    >
                      <Paperclip className="h-6 w-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Upload image</TooltipContent>
                </Tooltip>
                <input
                  ref={uploadInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) processFile(file);
                    event.target.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowSearch((current) => !current);
                    setShowThink(false);
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    showSearch ? "bg-[#1EAEDB]/15 text-[#8fd9ef]" : "text-[#A6ADBC] hover:bg-white/5 hover:text-[#E3E8F2]",
                  )}
                >
                  <Globe className="h-6 w-6" />
                </button>

                <span aria-hidden="true" className="h-9 w-px bg-gradient-to-b from-transparent via-[#7b6dff] to-transparent opacity-75" />

                <button
                  type="button"
                  onClick={() => {
                    setShowThink((current) => !current);
                    setShowSearch(false);
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    showThink ? "bg-[#8B5CF6]/15 text-[#c7abff]" : "text-[#A6ADBC] hover:bg-white/5 hover:text-[#E3E8F2]",
                  )}
                >
                  <Settings className="h-6 w-6" />
                </button>

                <span aria-hidden="true" className="h-9 w-px bg-gradient-to-b from-transparent via-[#7b6dff] to-transparent opacity-75" />

                <button
                  type="button"
                  onClick={() => setShowCanvas((current) => !current)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    showCanvas ? "bg-[#F97316]/15 text-[#ffba86]" : "text-[#A6ADBC] hover:bg-white/5 hover:text-[#E3E8F2]",
                  )}
                >
                  <FolderCode className="h-6 w-6" />
                </button>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={hasContent || isRecording ? "default" : "ghost"}
                    onClick={() => {
                      if (isLoading) return;
                      if (isRecording) {
                        onSend(`[Voice] ${formatTime}`, []);
                        setIsRecording(false);
                        setRecordTime(0);
                        return;
                      }
                      if (hasContent) {
                        submit();
                        return;
                      }
                      setIsRecording(true);
                    }}
                    className={cn(
                      "h-16 w-16 shrink-0 rounded-full border border-white/20",
                      isRecording ? "bg-transparent text-red-500 hover:bg-gray-600/30 hover:text-red-400" : "",
                      hasContent ? "bg-white text-[#1F2023]" : "bg-white text-[#1F2023] hover:bg-white",
                    )}
                  >
                    {isLoading ? (
                      <Square className="h-4 w-4 animate-pulse" />
                    ) : isRecording ? (
                      <StopCircle className="h-5 w-5" />
                    ) : hasContent ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRecording ? "Stop recording" : hasContent ? "Send" : "Voice message"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>

        <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      </>
    );
  },
);
PromptInputBox.displayName = "PromptInputBox";
