import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Status, PaymentType, InputFormat, InputType } from "@/lib/types";

type TableFiltersProps = {
  status: Status | "";
  paymentType: PaymentType | "";
  inputFormat: InputFormat | "";
  inputType: InputType | "";
  setStatus: (status: Status | "") => void;
  setPaymentType: (paymentType: PaymentType | "") => void;
  setInputFormat: (inputFormat: InputFormat | "") => void;
  setInputType: (inputType: InputType | "") => void;
};

export default function TableFilters({
  status,
  paymentType,
  inputFormat,
  inputType,
  setStatus,
  setPaymentType,
  setInputFormat,
  setInputType,
}: TableFiltersProps) {
  function handleClearAll() {
    setStatus("");
    setPaymentType("");
    setInputFormat("");
    setInputType("");
  }

  return (
    <div className="flex gap-2">
      <FilterSelect
        value={paymentType}
        onValueChange={(e) => setPaymentType(e as any)}
        placeholder="Payment Type"
        label="Status"
        items={[
          { value: "free", label: "Free" },
          { value: "single", label: "Single" },
          { value: "subscription", label: "Subscription" },
        ]}
        clear={() => setPaymentType("")}
      />
      <FilterSelect
        value={inputFormat}
        onValueChange={(e) => setInputFormat(e as any)}
        placeholder="Input Format"
        label="Input Format"
        items={[
          { value: "text", label: "Text" },
          { value: "pdf", label: "PDF" },
          { value: "pptx", label: "PPTX" },
        ]}
        clear={() => setInputFormat("")}
      />
      <FilterSelect
        value={inputType}
        onValueChange={(e) => setInputType(e as any)}
        placeholder="Input Type"
        label="Input Type"
        items={[
          { value: "notes", label: "Notes" },
          { value: "syllabus", label: "Syllabus" },
          { value: "courseInfo", label: "Course Info" },
        ]}
        clear={() => setInputType("")}
      />
      <FilterSelect
        value={status}
        onValueChange={(e) => setStatus(e as any)}
        placeholder="Status"
        label="Status"
        items={[
          { value: "success", label: "Success" },
          { value: "error", label: "Error" },
        ]}
        clear={() => setStatus("")}
      />
      <Button onClick={handleClearAll}>Reset</Button>
    </div>
  );
}

type FilterSelectProps = {
  value: string | undefined;
  onValueChange: (e: string) => void;
  placeholder: string;
  label: React.ReactNode;
  items: { value: string; label: string }[];
  clear: () => void;
};

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  label,
  items,
  clear,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={(e) => onValueChange(e)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
          <SelectSeparator />
          <Button className="w-full" onClick={clear}>
            Reset
          </Button>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
