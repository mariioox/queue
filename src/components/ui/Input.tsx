import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export const inputClasses =
  "w-full bg-card border border-line rounded-lg px-4 py-3 text-ink placeholder:text-ink-muted/70 font-medium outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => (
  <input className={cn(inputClasses, className)} {...props} />
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea className={cn(inputClasses, "resize-none", className)} {...props} />
);

export { Textarea };
export default Input;
