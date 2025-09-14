// src/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react"; // Assuming lucide-react is installed for icons

// Reuse the existing buttonVariants from button-variants.ts
import { buttonVariants } from "@/lib/button-variants";

// Define button props with enhanced types
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean; // Add loading state
    icon?: React.ReactNode; // Optional icon
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "cursor-not-allowed opacity-80"
        )}
        ref={ref}
        disabled={loading || props.disabled}
        aria-busy={loading}
        aria-label={loading ? "Loading..." : props["aria-label"]}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : icon ? (
          <>
            {icon}
            <span className="ml-2">{props.children}</span>
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };