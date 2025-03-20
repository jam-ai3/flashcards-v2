import { ReactNode } from "react";
import { Label } from "./ui/label";

type InfoLineProps = {
  label: string;
  value: ReactNode;
};

export default function InfoLine({ label, value }: InfoLineProps) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold">{label}</Label>
      <p className="rounded-md border-2 p-2">{value}</p>
    </div>
  );
}
