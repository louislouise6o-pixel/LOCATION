export type BoatType = 'no-license' | 'motor' | 'semi-rigid' | 'sail' | 'premium';
export type OwnerType = 'professional' | 'private';
export type Duration = 'few-hours' | 'half-day' | 'full-day';
export type ReservationStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface Boat {
  id: string;
  name: string;
  type: BoatType;
  ownerType: OwnerType;
  ownerName: string;
  location: string;
  departurePort: string;
  description: string;
  capacity: number;
  length: number;
  power: string;
  year: number;
  licenseRequired: boolean;
  pricePerDuration: {
    'few-hours': number;
    'half-day': number;
    'full-day': number;
  };
  deposit: number;
  fuelPolicy: string;
  amenities: string[];
  images: string[];
  rating: number;
  ratingCount: number;
  durations: Duration[];
  published: boolean;
}

export interface Reservation {
  id: string;
  boatId: string;
  boatName: string;
  boatImage: string;
  clientName: string;
  clientFirstName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  duration: Duration;
  guests: number;
  rentalPrice: number;
  serviceFee: number;
  total: number;
  status: ReservationStatus;
  createdAt: string;
  endCode: string;
  reviewSubmitted: boolean;
  problemReported: boolean;
}

export interface RentalEvent {
  id: string;
  status: 'requested' | 'confirmed' | 'in-progress' | 'completed' | 'issue';
  label: string;
  detail: string;
  date: string;
}

export type PageId =
  | 'home'
  | 'catalog'
  | 'boat'
  | 'booking'
  | 'booking-confirm'
  | 'how-it-works'
  | 'renter-onboarding'
  | 'project'
  | 'commission'
  | 'owner-dashboard'
  | 'owner-boats'
  | 'owner-requests'
  | 'rental-flow'
  | 'admin'
  | 'login';
