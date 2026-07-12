const LoginPageSkeleton = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-2 bg-[#0c121f]">
      <div className="bg-gray-900 w-full max-w-xl p-8 space-y-6 rounded-md mt-16 animate-pulse">
        {/* Title */}
        <div className="h-8 bg-gray-700 rounded-md w-2/3 mx-auto" />
        <div className="h-4 bg-gray-700 rounded-md w-1/2 mx-auto" />

        {/* Google button */}
        <div className="h-12 bg-gray-700 rounded-lg w-full" />

        {/* Divider */}
        <div className="h-px bg-gray-700 w-full" />

        {/* Inputs */}
        <div className="h-12 bg-gray-700 rounded-md w-full" />
        <div className="h-12 bg-gray-700 rounded-md w-full" />

        {/* Button */}
        <div className="h-12 bg-gray-700 rounded-lg w-full" />

        {/* Link */}
        <div className="h-4 bg-gray-700 rounded-md w-1/3 mx-auto" />
      </div>
    </div>
  );
};

export default LoginPageSkeleton;
