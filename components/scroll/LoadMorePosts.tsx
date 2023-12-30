"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import PostCard from "../cards/PostCard";
import NoResults from "../shared/NoResults";

const LoadMorePosts = () => {
  const { ref, inView } = useInView();

  const posts = [{ title: "1" }, { title: "2" }];

  useEffect(() => {
    alert("Yo!");
  }, [inView]);

  return (
    <section className="mt-10 flex w-full flex-col gap-6">
      <div ref={ref}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              title={post.title}
              tags={post.tags}
              author={post.author}
              upvotes={post.upvotes}
              views={post.views}
              comments={post.comments}
              createdAt={post.createdAt}
              clerkId={post.clerkId}
            />
          ))
        ) : (
          <NoResults
            title="There aren't any posts yet!"
            description="Be the first to create one..."
            link="/create-post"
            buttonText="Create a post"
          />
        )}
      </div>
    </section>
  );
};

export default LoadMorePosts;
