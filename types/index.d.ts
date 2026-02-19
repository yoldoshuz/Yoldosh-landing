export enum CarStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum TripStatus {
  Created = "CREATED",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
  Canceled = "CANCELED",
}

export interface Trip {
  id: string;
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    rating: number;
    preferences: {
      smoking_allowed?: boolean;
      pets_allowed?: boolean;
      music_allowed?: boolean;
      talkative?: boolean;
      conditioner?: boolean;
    };
  };
  car: {
    id: string;
    driver_id: string;
    status: CarStatus;
    rejectionReason: string;
    licenseFrontPath: string;
    techPassportFrontPath: string;
    techPassportBackPath: string;
    licenseOwnerName: string;
    licenseDob: Date;
    licensePinfl: string;
    licenseSeriya: string;
    licenseAddress: string;
    govNumber: string;
    make: string;
    model: string;
    color: string;
    ownerName: string;
    ownerAddress: string;
    yearOfManufacture: number;
    issueDate: Date;
    techPassportSerial: string;
    seats: number;
    createdAt?: Date;
    updatedAt?: Date;
  };
  driver_id: string;
  car_id: string;
  from_region_id: number;
  to_region_id: number;
  distance?: number;
  duration?: number;
  max_two_back: boolean;
  comment?: string;
  status: TripStatus;
  trip_start_ts?: Date;
  trip_end_ts?: Date;
  created_at?: Date;
  updated_at?: Date;
  from_location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    region: {
      id: number;
      nameRu: string;
      nameUz: string;
      nameOz: string;
    };
  };

  to_location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    region: {
      id: number;
      nameRu: string;
      nameUz: string;
      nameOz: string;
    };
  };
  price: {
    amount: number;
    currency: string;
  };
  departure_ts: Date;
  seats_available: number;
}

export interface SearchParams {
  from?: string;
  to?: string;

  from_latitude?: number;
  from_longitude?: number;
  to_latitude?: number;
  to_longitude?: number;

  departure_date?: string;
  seats?: number;
  page?: number;
  limit?: number;

  sort_by?: string;
  sort_order?: string;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  music_allowed?: boolean;
  talkative?: boolean;
  conditioner?: boolean;
}

export interface SearchResponse {
  success: boolean;
  data: {
    trips: Trip[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface TripDetailsResponse {
  success: boolean;
  data: {
    trip: Trip;
  };
}

export interface PopularTripsResponse {
  success: boolean;
  data: {
    trips: Trip[];
  };
}

export type PageProps = {
  params: Promise<{ locale: string }>;
};

export type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
