import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const HomePage = () => {
  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => toast.success("Success Toast")}
      >
        Click It
      </button>

      {/* Show when user is NOT signed in */}
      <SignedOut>
        <SignInButton mode="modal">
          <button>Log In</button>
        </SignInButton>
      </SignedOut>

      {/* Show when user IS signed in */}
      <SignedIn>
        <SignOutButton />
        <UserButton />
      </SignedIn>
    </>
  );
};

export default HomePage;
