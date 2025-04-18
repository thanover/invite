import { useClerk } from "@clerk/clerk-react";
import { Button } from "../components/Button";

export function LoginPage() {
  const clerk = useClerk();

  return (
    <div className="h-1/3 flex justify-center items-center">
      Log In
      <Button type="Primary">
        <button
          className="text-xs text-[var(--color-night)]"
          onClick={() => clerk.openSignIn({})}
        >
          Log in with Google
        </button>
      </Button>
    </div>
  );
}
