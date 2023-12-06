import { BADGE_CRITERIA } from "@/constants";

export interface SidebarLink {
  imgUrl: string;
  route: string;
  label: string;
}
export interface Tag {
  _id: string;
  name: string;
  totalPosts: number;
}

export interface User {
  _id: string;
  email?: string;
  salutation: string;
  firstName: string;
  surname: string;
  picture: string;
  trust?: string;
  specialty?: string;
  subspecialty?: string;
  bio?: string;
}

export interface Comment {
  _id: string;
  user: User;
  content: string;
  postId: number;
}

export interface Post {
  _id: string;
  title: string;
  tags: string[];
  user: User;
  upvotes: number;
  views: number;
  comments: Comment[];
  createdAt: Date;
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

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
