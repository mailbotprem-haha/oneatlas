import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-[15px] font-semibold transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF6600] text-white hover:bg-[#E65C00]",

        secondary:
          "bg-white border border-[#E5E7EB] text-[#111111] hover:bg-[#FAFAFA]",

        outline:
          "border border-[#E5E7EB] bg-transparent text-[#111111] hover:bg-[#FAFAFA]",

        ghost:
          "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111111]",

        destructive:
          "bg-red-500 text-white hover:bg-red-600",

        link:
          "text-[#FF6600] underline-offset-4 hover:underline",
      },

      size: {
        default: "h-12 px-5",

        sm: "h-10 px-4 text-[14px]",

        lg: "h-14 px-6 text-[16px]",

        icon: "size-12 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
