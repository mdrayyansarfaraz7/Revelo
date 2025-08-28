import Image from "next/image";

interface BannerProps {
  imageUrl: string;
}

export default function Banner({ imageUrl }: BannerProps) {
  return (
    <div className="w-full flex justify-center py-6">
      <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-lg">
        <div className="relative aspect-[12/6] w-full">
          <Image
            src={imageUrl}
            alt="Banner"
            fill
            className="object-cover rounded-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
