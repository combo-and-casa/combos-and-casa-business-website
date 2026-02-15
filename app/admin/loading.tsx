export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-white/60">Loading admin panel...</p>
      </div>
    </div>
  );
}
