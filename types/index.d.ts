import { BADGE_CRITERIA } from "@/constants";
import { IUser } from "@/models/user.model";

export interface SidebarLink {
  imgUrl: string;
  route: string;
  label: string;
}

export interface Comment {
  _id: string;
  user: IUser;
  content: string;
  postId: number;
}

export interface UserCardType {
  _id: string;
  clerkId: string;
  picture: string;
  fullName: string;
  specialty: string;
  trust: string;
  followers: string[];
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Author {
  _id: string;
  clerkId: string;
  salutation: string;
  firstName: string;
  surname: string;
  picture: string;
};

export interface SelectOption {
  value: string;
  name: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
