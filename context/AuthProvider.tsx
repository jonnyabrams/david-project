// "use client";

// import { useUser } from "@clerk/nextjs";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   SetStateAction,
// } from "react";

// import { IUser } from "@/models/user.model";

// interface AuthContextType {
//   currentUser: any;
//   // setCurrentUser: React.Dispatch<SetStateAction<IUser>>;
// }

// export const AuthContext = createContext({} as AuthContextType);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const { user: currentUser } = useUser();

//   // const [currentUser, setCurrentUser] = useState(
//   //   JSON.parse(localStorage.getItem("user") as string) || null
//   // );

//   // useEffect(() => {
//   //   const fetchUserData = async () => {
//   //     try {
//   //       const result = await getUserById({ userId });
//   //       setCurrentUser(result);
//   //       // stringify because you can't store object in localStorage
//   //       localStorage.setItem("user", JSON.stringify(currentUser));
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     }
//   //   };

//   //   fetchUserData();
//   // }, [currentUser]);

//   return (
//     <AuthContext.Provider value={{ currentUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuthContext = () => {
//   const context = useContext(AuthContext);

//   if (context === undefined) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }

//   return context;
// };
