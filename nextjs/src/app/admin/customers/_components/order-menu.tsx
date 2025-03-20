import React from "react";
import { Ordering } from "../_actions/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp } from "lucide-react";

type OrderMenuProps = {
  ordering: Ordering;
  setOrdering: (ordering: Ordering) => void;
};

export default function OrderMenu({ ordering, setOrdering }: OrderMenuProps) {
  return (
    <Select value={ordering} onValueChange={(e) => setOrdering(e as Ordering)}>
      <SelectTrigger>
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>
          <SelectItem value="createdAsc">
            <ArrowUp />
            <span>Joined Date</span>
          </SelectItem>
          <SelectItem value="createdDesc">
            <ArrowDown />
            <span>Joined Date</span>
          </SelectItem>
          <SelectItem value="purchasesAsc">
            <ArrowUp />
            <span>Total Purchases</span>
          </SelectItem>
          <SelectItem value="purchasesDesc">
            <ArrowDown />
            <span>Total Purchases</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
