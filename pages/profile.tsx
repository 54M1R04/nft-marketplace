/* eslint-disable @next/next/no-img-element */

import type { NextPage } from "next";
import { BaseLayout } from "@ui";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { Nft } from "@_types/nft";
import { useOwnedNfts } from "@hooks/web3";

const tabs = [{ name: "Your Collection", href: "#", current: true }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Profile: NextPage<{ userEmail: string }> = ({ userEmail }) => {
  const { nfts } = useOwnedNfts();
  const [activeNft, setActiveNft] = useState<Nft>();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch the user's avatar URL from the backend
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`/api/get-user?email=${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setAvatarUrl(data.avatarUrl); // Set the avatar URL in the state
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchAvatar();
  }, [userEmail]);

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatar) {
      alert("Please select an avatar to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("email", userEmail);

    const response = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setAvatarUrl(data.avatarUrl); // Update the avatar URL after upload
      alert("Avatar uploaded successfully!");
    } else {
      alert("Failed to upload avatar.");
    }
  };

  // Handle NFT selection
  useEffect(() => {
    if (nfts.data && nfts.data.length > 0) {
      setActiveNft(nfts.data[0]);
    }

    return () => setActiveNft(undefined);
  }, [nfts.data]);

  return (
    <BaseLayout>
      <div className="h-full flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Avatar Upload Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Upload Your Avatar</h2>
                  <div className="mb-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200" />
                    )}
                  </div>
                  <form onSubmit={handleAvatarUpload}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      Upload Avatar
                    </button>
                  </form>
                </div>

                {/* NFT Collection Section */}
                <div className="flex">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900">Your NFTs</h1>
                </div>
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center border-b border-gray-200">
                      <nav
                        className="flex-1 -mb-px flex space-x-6 xl:space-x-8"
                        aria-label="Tabs"
                      >
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={tab.current ? "page" : undefined}
                            className={classNames(
                              tab.current
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                  <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                  >
                    {(nfts.data as Nft[]).map((nft) => (
                      <li
                        key={nft.tokenId}
                        onClick={() => setActiveNft(nft)}
                        className="relative"
                      >
                        <div
                          className={classNames(
                            nft.tokenId === activeNft?.tokenId
                              ? "ring-2 ring-offset-2 ring-indigo-500"
                              : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500",
                            "group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden"
                          )}
                        >
                          <img
                            src={nft.meta.image}
                            alt=""
                            className={classNames(
                              nft.tokenId === activeNft?.tokenId ? "" : "group-hover:opacity-75",
                              "object-cover pointer-events-none"
                            )}
                          />
                          <button type="button" className="absolute inset-0 focus:outline-none">
                            <span className="sr-only">View details for {nft.meta.name}</span>
                          </button>
                        </div>
                        <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                          {nft.meta.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </main>

            {/* Details sidebar */}
            <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
              {activeNft && (
                <div className="pb-16 space-y-6">
                  <div>
                    <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                      <img src={activeNft.meta.image} alt="" className="object-cover" />
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          <span className="sr-only">Details for </span>
                          {activeNft.meta.name}
                        </h2>
                        <p className="text-sm font-medium text-gray-500">
                          {activeNft.meta.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Information</h3>
                    <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                      {activeNft.meta.attributes.map((attr) => (
                        <div
                          key={attr.trait_type}
                          className="py-3 flex justify-between text-sm font-medium"
                        >
                          <dt className="text-gray-500">{attr.trait_type}: </dt>
                          <dd className="text-gray-900 text-right">{attr.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Download Image
                    </button>
                    <button
                      disabled={activeNft.isListed}
                      onClick={() => {
                        nfts.listNft(activeNft.tokenId, activeNft.price);
                      }}
                      type="button"
                      className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {activeNft.isListed ? "Nft is listed" : "List Nft"}
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  try {
    // Parse cookies to retrieve the user's email
    const cookies = parseCookies(context);
    const userEmail = cookies.userEmail;

    if (!userEmail) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { userEmail }, // Pass the email as a prop to the component
    };
  } catch (error) {
    console.error("Error retrieving user email from cookies:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default Profile;