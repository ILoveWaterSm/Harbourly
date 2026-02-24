import { ShieldCheckIcon } from "@heroicons/react/24/solid";

interface Props {
  lastVerifiedAt?: Date | string | null;
  size?: "sm" | "md" | "lg";
}

export default function VerifiedBadge({ lastVerifiedAt, size = "md" }: Props) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-0.5",
    md: "text-xs px-2 py-1 gap-1",
    lg: "text-sm px-3 py-1.5 gap-1.5",
  };
  const iconSize = { sm: "h-3 w-3", md: "h-3.5 w-3.5", lg: "h-4 w-4" };

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} bg-green-50 text-green-800 font-semibold rounded-full border border-green-200 hover:shadow-[0_0_0_4px_rgba(34,197,94,0.2)] transition-shadow duration-300 cursor-default`}
      title={lastVerifiedAt ? `Verified on ${new Date(lastVerifiedAt).toLocaleDateString()}` : "Verified"}
    >
      <ShieldCheckIcon className={`${iconSize[size]} text-green-600`} />
      Verified
      {lastVerifiedAt && (
        <span className="font-normal text-green-700 hidden sm:inline">
          · {new Date(lastVerifiedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      )}
    </span>
  );
}
