import { LandingPage } from "@/components/landing";
import { loginMessage } from "@/lib/hooks/auth/login-message";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ login?: string }>;
}) {
  const { login } = await searchParams;
  return <LandingPage loginMessage={loginMessage(login)} />;
}
