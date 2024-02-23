import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: '404: Not Found',
  description: 'The page you are looking for does not exist.',
}
 

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-[120px] font-extrabold text-gray-700">404</h1>
        <p className="text-2xl font-medium text-gray-600 mb-2">
          Page Not Found
        </p>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
