"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TableFiltersProps = {
  productId: string;
  setProductId: (productId: string) => void;
  options: string[];
  clear: () => void;
};

export default function TableFilters({
  productId,
  setProductId,
  options,
}: TableFiltersProps) {
  return (
    <Select value={productId} onValueChange={(e) => setProductId(e)}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by Product" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter by Product</SelectLabel>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              onClick={() => setProductId(option)}
            >
              {option}
            </SelectItem>
          ))}
          <SelectSeparator />
          <Button className="w-full" onClick={() => setProductId("")}>
            Reset
          </Button>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
