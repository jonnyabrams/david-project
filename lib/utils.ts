import {
  specialtiesWithSubspecialties,
  subspecialtyMatcher,
} from "@/constants/specialties";
import { IUser } from "@/models/user.model";
import { SelectOption } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFullName = (user: IUser) => {
  return `${user.salutation} ${user.firstName} ${user.surname}`;
};

export const getUserLabel = (user: IUser) => {
  return `${user.specialty} at ${user.trust}`;
};

export const getTimestamp = (createdAt: Date): string => {
  const now: Date = new Date();
  const timeDifference: number = now.getTime() - createdAt.getTime();

  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);
  const months: number = Math.floor(days / 30); // Assuming 30 days in a month
  const years: number = Math.floor(days / 365); // Assuming 365 days in a year

  if (years > 0) {
    return `${years} year${years === 1 ? "" : "s"} ago`;
  } else if (months > 0) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }
};

export const formatLargeNumber = (inputNumber: number): string => {
  if (inputNumber >= 1000000) {
    return (inputNumber / 1000000).toFixed(1) + "M";
  } else if (inputNumber >= 1000) {
    return (inputNumber / 1000).toFixed(1) + "k";
  } else {
    return inputNumber?.toString();
  }
};

export const getJoinedDate = (date: Date): string => {
  // Extract the month and year from the Date object
  const month = date?.toLocaleString("default", { month: "long" });
  const year = date?.getFullYear();

  // Create the joined date string (e.g., "January 2023")
  const joinedDate = `${month} ${year}`;

  return joinedDate;
};

export const getSubspecialties = (
  specialty: string | undefined,
  setShowSubspecialties: Dispatch<SetStateAction<boolean>>,
  setSubspecialties: Dispatch<SetStateAction<SelectOption[]>>
) => {
  if (specialty && specialtiesWithSubspecialties.includes(specialty)) {
    setShowSubspecialties(true);
    setSubspecialties((subspecialtyMatcher as any)[specialty]);
  } else {
    setShowSubspecialties(false);
    setSubspecialties([]);
  }
};

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export const handleImages = (
  e: ChangeEvent<HTMLInputElement>,
  fieldChange: (value: string) => void, setFiles: Dispatch<SetStateAction<File[]>>
) => {
  e.preventDefault();

  const fileReader = new FileReader();

  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];

    setFiles(Array.from(e.target.files));

    if (!file.type.includes("image")) return;

    fileReader.onload = async (event) => {
      const imageDataUrl = event.target?.result?.toString() || "";

      fieldChange(imageDataUrl);
    };

    fileReader.readAsDataURL(file);
  }
};

export const setImagesInFormValues = async (values: any, startUpload: any, images: File[]) => {
  const blob = values.picture;
    const imageHasChanged = isBase64Image(blob as string);

    if (imageHasChanged) {
      const imgRes = await startUpload(images);

      if (imgRes && imgRes[0].url) {
        values.picture = imgRes[0].url;
      }
    }
}