"use client";
import React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Removed Direction type as it's no longer needed

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
  } & React.HTMLAttributes<HTMLElement>
>) {
  // Simplified component - using red glow as permanent state

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #EF4444 0%, rgba(255, 255, 255, 0) 100%)";

  // Removed the moving gradient animation - using red glow as default state
  return (
    <Tag
      className={cn(
        "relative flex rounded-full border  content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: highlight }}
        animate={{
          background: highlight,
        }}
        transition={{ ease: "linear", duration: 1 }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
} 