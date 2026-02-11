import { SignedOut, SignedIn, SignInButton, SignOutButton } from "@clerk/clerk-react";
import React from "react";

const App = () => {
  return (
    <>
      <h1>Welcome to the App</h1>

      {/* Show when user is NOT signed in */}
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In Please</button>
        </SignInButton>
      </SignedOut>

      {/* Show when user IS signed in */}
      <SignedIn>
        <SignOutButton>
          <button>Sign Out</button>
        </SignOutButton>
      </SignedIn>
    </>
  );
};

export default App;
