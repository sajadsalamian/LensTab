import { useSIWE, useModal, SIWESession } from "connectkit";
import { useAccount } from "wagmi";

const MyConnectButton = () => {
  const { setOpen } = useModal();
  const { isConnected } = useAccount();

  const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn } =
    useSIWE({
      onSignIn: (session?: SIWESession) => {
        // Do something with the data
      },
      onSignOut: () => {
        // Do something when signed out
      },
    });

  const handleSignIn = async () => {
    await signIn()?.then((session?: SIWESession) => {
      // Do something when signed in
    });
  };

  const handleSignOut = async () => {
    await signOut()?.then(() => {
      // Do something when signed out
    });
  };


  /** Wallet is connected and signed in */
  if (isSignedIn) {
    return (
      <div className="text-white">
        <div>Address: {data?.address}</div>
        <div>ChainId: {data?.chainId}</div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  /** Wallet is connected, but not signed in */
  if (isConnected) {
    return (
      <>
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="bg-blue-500 text-white px-2 py-5 text-2xl"
        >
          {isRejected // User Rejected
            ? "Try Again"
            : isLoading // Waiting for signing request
            ? "Awaiting request..."
            : // Waiting for interaction
              "Sign In"}
        </button>
      </>
    );
  }

  /** A wallet needs to be connected first */
  return (
    <>
      <button className="text-white" onClick={() => setOpen(true)}>Connect Wallet</button>
    </>
  );
};

export default MyConnectButton;
