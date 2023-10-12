import { type ReactNode } from "react";

export default function LoadingSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full animate-pulse flex-col items-start justify-center gap-2 pt-12">
      {children || "loading..."}
    </div>
  );
}

export const SkeletonItem = ({ className }: { className: string }) => {
  return (
    <div
      className={`${className} mb-4 rounded-lg bg-gray-50 dark:bg-gray-200`}
    ></div>
  );
};
