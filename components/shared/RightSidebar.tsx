import Image from "next/image";
import Link from "next/link";

import RenderTag from "./RenderTag";
import { getTopPosts } from "@/lib/actions/post.action";

// const topPosts = [
//   { _id: 1, title: "What is a lung, seriously what is it?" },
//   { _id: 2, title: "What is a throat, seriously what is it??" },
//   { _id: 3, title: "What is a heart, seriously what is it??" },
//   { _id: 4, title: "What is a mind, seriously what is it??" },
//   { _id: 5, title: "What is a tongue, seriously what is it??" },
// ];

const popularTags = [
  { _id: 1, name: "heart_surgery", totalPosts: 5 },
  { _id: 2, name: "lung_disease", totalPosts: 3 },
  { _id: 3, name: "covid", totalPosts: 7 },
  { _id: 4, name: "dental_surgery", totalPosts: 2 },
  { _id: 5, name: "broken_bones", totalPosts: 5 },
];

const RightSidebar = async () => {
  const topPosts = await getTopPosts();

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Posts</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {topPosts.map((post) => (
            <Link
              href={`/post/${post._id}`}
              key={post._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{post.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              name={tag.name}
              totalPosts={tag.totalPosts}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
