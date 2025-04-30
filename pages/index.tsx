/* eslint-disable @next/next/no-img-element */

import type { NextPage } from "next";
import { BaseLayout, NftList } from "@ui";
import { useNetwork } from "@hooks/web3";
import { ExclamationIcon } from "@heroicons/react/solid";
import { parseCookies } from "nookies"; // Import nookies to parse cookies
import { useRouter } from "next/router"; // Import useRouter

export const getServerSideProps = async (context: any) => {
  // Parse cookies from the request
  const cookies = parseCookies(context);

  // Check if the user is logged in by verifying the presence of a token
  const isLoggedIn = cookies.token ? true : false;

  if (!isLoggedIn) {
    return {
      redirect: {
        destination: "/register",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Pass any props to the page if needed
  };
};

const Home: NextPage = () => {
  const { network } = useNetwork();
  const router = useRouter(); // Initialize the router

  return (
    <BaseLayout>
        <div
          className="relative bg-cover bg-center bg-no-repeat pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8"
          style={{
            backgroundImage: "url('/images/bgw.jpg')", // Replace with the correct path
          }}
        >
          <div className="relative">
            <div className="text-center">
              <h2 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl animate-fade-in">
                Discover Amazing NFTs
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-200 sm:mt-4 animate-fade-in">
                Mint your own NFT and unlock unlimited ownership forever!
              </p>
            </div>
            {network.isConnectedToNetwork ? (
              <div className="mt-10 animate-slide-up">
                <NftList />
              </div>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 mt-10 animate-pulse">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationIcon
                      className="h-5 w-5 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Attention needed
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      Please connect to the correct network to view NFTs.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call-to-Action Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white">
              Ready to mint your first NFT?
            </h3>
            <div className="mt-6">
              <button
                onClick={() => router.push("/nft/create")}
                className="px-6 py-3 bg-indigo-600 text-white font-medium text-lg rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Mint Now
              </button>
            </div>
          </div>
        </div>
    </BaseLayout>
  );
};

export default Home;
