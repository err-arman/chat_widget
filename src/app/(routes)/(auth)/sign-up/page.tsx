import { redirect } from "next/navigation";

export default function SignUp() {

  redirect(
    `${process.env.NEXT_PUBLIC_API_SSO_SERVER_URL}/login?token=${process.env.NEXT_PUBLIC_API_CLIENT_ID}&redirect_url=${process.env.NEXT_PUBLIC_API_REDIRECT_URL}`
  ); // Redirects to "/dashboard" or any other page
  return null; // This prevents rendering anything on this page
}
