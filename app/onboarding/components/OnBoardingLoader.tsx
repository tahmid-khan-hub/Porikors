"use client";
import dynamic from "next/dynamic";

const OnBoardingClientSide = dynamic(
  () => import("./OnBoardingClientSide"),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-[#F6F5F1]" />,
  }
);

export default function OnBoardingLoader() {
  return <OnBoardingClientSide />;
}
