"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  authProvider?: string;
  profileImageUrl?: string;
}

const useUser = (auth_token?: string) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get token from cookies
        const cookies = document.cookie.split(";");
        const token = cookies
          .find((cookie) => cookie.trim().startsWith(`auth_token=`))
          ?.split("=")[1];
        // console.log("token from cookie", token);
        // console.log(`Bearer ${token ? token : auth_token}`);

        if (!token && !auth_token) {
          throw new Error("No authentication token found");
        }
        // console.log(`token: ${token} authToken: ${auth_token}`);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_SSO_SERVER_URL}api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token ? token : auth_token}`,
            },
          }
        );
        // console.log('response', response.data)
        setUser(response.data);
      } catch (err: any) {
        console.log("use user error", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { user, loading, error };
};

export default useUser;
