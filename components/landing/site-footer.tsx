export function SiteFooter() {
  return (
    <footer className="bg-[#1F6F5C]/30">
      <div className="mx-auto max-w-6xl p-5 text-center">
        <p className="text-sm text-[#1F6F5C]">
          © {new Date().getFullYear()} Porikors™. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
