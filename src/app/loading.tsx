'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="grid items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <Image src="/loading.svg" alt="Loading" width={100} height={100} />
    </div>
  );
}
