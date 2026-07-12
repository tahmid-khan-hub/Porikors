const RegisterPageSkeleton = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-2 bg-[#F6F5F1]">
      <div className="bg-white w-full max-w-xl p-8 space-y-6 rounded-md mt-16 border border-[#DAD7CE] animate-pulse">
        {/* Title */}
        <div className="h-8 bg-[#DAD7CE]/60 rounded-md w-2/3 mx-auto" />
        <div className="h-4 bg-[#DAD7CE]/60 rounded-md w-1/2 mx-auto" />

        {/* Google button */}
        <div className="h-12 bg-[#DAD7CE]/40 rounded-lg w-full" />

        {/* Divider */}
        <div className="h-px bg-[#DAD7CE] w-full" />

        {/* Inputs */}
        <div className="h-12 bg-[#DAD7CE]/40 rounded-md w-full" />
        <div className="h-12 bg-[#DAD7CE]/40 rounded-md w-full" />
        <div className="h-12 bg-[#DAD7CE]/40 rounded-md w-full" />
        <div className="h-12 bg-[#DAD7CE]/40 rounded-md w-full" />

        {/* Button */}
        <div className="h-12 bg-[#1F6F5C]/20 rounded-lg w-full" />

        {/* Link */}
        <div className="h-4 bg-[#DAD7CE]/60 rounded-md w-1/3 mx-auto" />
      </div>
    </div>
  );
};

export default RegisterPageSkeleton;
