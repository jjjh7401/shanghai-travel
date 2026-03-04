import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueById, venues } from "@/data/venues";
import { VenueDetail } from "@/components/venue/VenueDetail";

interface VenuePageProps {
  params: Promise<{ venueId: string }>;
}

export function generateStaticParams() {
  return venues.map((venue) => ({ venueId: venue.id }));
}

/**
 * 장소 상세 페이지
 */
export default async function VenuePage({ params }: VenuePageProps) {
  const { venueId } = await params;
  const venue = getVenueById(venueId);

  if (!venue) {
    notFound();
  }

  return (
    <div>
      {/* 뒤로가기 헤더 */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/day/${venue.dayNumber}`}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="뒤로 가기"
          >
            ←
          </Link>
          <h1 className="font-semibold text-gray-900 truncate">
            {venue.name.ko}
          </h1>
        </div>
      </header>

      <div className="px-4 py-4">
        <VenueDetail venue={venue} />
      </div>
    </div>
  );
}
