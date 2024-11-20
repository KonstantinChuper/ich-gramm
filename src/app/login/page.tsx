import HaveJobBanner from "@/components/HaveJobBanner";
import HeroImage from "@/components/HeroImage";
import LoginForm from "@/components/LoginForm";

export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex gap-[32px] justify-center w-full my-auto">
        <HeroImage />
        <div className="h-full">
          <LoginForm />
          <HaveJobBanner to="/register" linkText="Sign Up">
            Don't have an account?
          </HaveJobBanner>
        </div>
      </div>
    </div>
  );
}
