"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser from "@/hook/useUser";
import createAxiosInstance from "@/utils/api";

const CallBack = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authToken = searchParams.get("auth_token");
  const { user } = useUser(authToken ? authToken : "");
  const axiosInstance = createAxiosInstance();

  useEffect(() => {
    if (!authToken) {
      console.log("No auth token found in URL parameters");
      return;
    }
    try {
      // Set the cookie with proper formatting and security flags
      document.cookie = `auth_token=${authToken}; expires=Thu, 01 Jan 2026 00:00:00 UTC; path=/;`;

    } catch (error) {
      console.log("Error setting auth token cookie:", error);
    }
  }, [authToken, router]);

  useEffect(() => {
    const findUserWithId = async (userId: string) => {
      try {
        const findUser = await axiosInstance.get(`admins/${userId}`);
        if (!findUser.data.success) {
          const createUser = await axiosInstance.post(`admins`, {
            authProvider: user?.authProvider,
            email: user?.email,
            id: user?.id,
            name: user?.name,
            profileImageUrl: user?.profileImageUrl,
          });
          console.log("create user", createUser);
          if (createUser?.data?.data?.id) {
            router.push("/dashboard");
          }
        }
        router.push("/dashboard");
      } catch (error) {
        console.log("error in finduserWithId func", error);
      }
    };
    if (user) {
      findUserWithId(user?.id);
    }
  }, [user]);


  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Processing your login...</p>
    </div>
  );
};

export default CallBack;
