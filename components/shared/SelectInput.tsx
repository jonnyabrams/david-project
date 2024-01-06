"use client";

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
  options: { value: string; name: string }[];
  field: any;
  isOnboarding?: boolean;
}

const SelectInput = ({
  name,
  options,
  field,
  isOnboarding = false,
}: SelectInputProps) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger
        className={
          isOnboarding
            ? "no-focus"
            : "no-focus body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5"
        }
      >
        <div className="line-clamp-1 flex-1 text-left">
          <SelectValue placeholder={`Select a ${name}`} />
        </div>
      </SelectTrigger>
      <SelectContent
        className={`text-dark500_light700 small-regular border-none bg-light-900 focus:outline-none active:outline-none ${
          !isOnboarding && `dark:bg-dark-300`
        }`}
      >
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              className={`cursor-pointer focus:bg-light-800 ${
                !isOnboarding && "dark:focus:bg-dark-400"
              }`}
              key={option.value}
              value={option.value}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
