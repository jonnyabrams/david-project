import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return <UserButton afterSignOutUrl="/" />;
};

export default Home;
