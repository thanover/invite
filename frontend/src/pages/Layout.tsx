import { Outlet, Link } from "react-router-dom";
import { User } from "../components/User";
import { useUser } from "@clerk/clerk-react";

const Title = () => {
  return (
    <div className="text-4xl">
      <Link className="hover:underline" to="/">
        Invites
      </Link>
    </div>
  );
};

const headerClass = "flex flex-row h-[100px] items-center";

export function Layout() {
  const { user } = useUser();
  return (
    <div className="flex fixed inset-0 bg-[var(--color-night)] martian-mono-normal">
      <div className="mx-auto w-[600px] font-bold">
        {user ? (
          <header className={`${headerClass} justify-between`}>
            <Title />
            <User />
          </header>
        ) : (
          <header className={`${headerClass} justify-center`}>
            <Title />
          </header>
        )}

        {/* Main content area where child routes will render */}
        <main className="w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
