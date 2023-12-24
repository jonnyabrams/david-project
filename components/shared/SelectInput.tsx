"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

interface SelectInputProps {
  name: string;
  options: { value: string, name: string}[];
  field: any;
}

const SelectInput = ({ name, options, field }: SelectInputProps) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger
        className="no-focus body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5"
      >
        <div className="line-clamp-1 flex-1 text-left">
          <SelectValue placeholder={`Select a ${name}`} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
