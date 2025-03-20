"use client";

import { Button } from "@/components/ui/button";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

type CopyButtonProps = {
  text: string;
  className?: string;
};

const ICON_SIZE = 16;

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
  }

  return (
    <Button variant="outline" onClick={handleCopy} className={className}>
      {hasCopied ? <CopyCheck size={ICON_SIZE} /> : <Copy size={ICON_SIZE} />}
    </Button>
  );
}
