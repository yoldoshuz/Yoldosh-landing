/**
 * Types for the authenticated app surface, mirroring Yoldosh API v2.0-Geo.
 * The public landing keeps using the looser `@/types` shapes.
 */

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type UserRole = "Passenger" | "Driver";
export type TripStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";
export type CarStatus = "WAITING_MYID" | "PENDING" | "VERIFIED" | "REJECTED";
export type BookingType = "INSTANT" | "REQUEST";
export type GarageStatus = "FULL" | "EMPTY" | "HALF_EMPTY";
export type NavigatorPreference = "YANDEX_NAVI" | "GOOGLE_MAPS" | "NONE";
export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "PAYMENT" | "REFUND" | "COMMISSION" | "TRANSFER";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type ParcelStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "PICKED_UP" | "DELIVERED";
export type NotificationType = "trips" | "newsAndAgreement" | "promotionAndDiscounts" | "messages" | "general";

export interface NotificationPreferences {
  trips: boolean;
  newsAndAgreement: boolean;
  promotionAndDiscounts: boolean;
  messages: boolean;
  general: boolean;
}

export interface AppUser {
  id: string;
  firstName: string;
  lastName?: string | null;
  phoneNumber: string;
  avatar?: string | null;
  bio?: string | null;
  gender?: Gender;
  date_of__birthday?: string | null;
  rating: number;
  role: UserRole;
  verified: boolean;
  passport_verified?: boolean | null;
  isBanned?: boolean;
  banExpiresAt?: string | null;
  banReason?: string | null;
  talkative?: boolean | null;
  music_allowed?: boolean | null;
  pets_allowed?: boolean | null;
  preferred_navigator?: NavigatorPreference;
  isHavePromocode?: boolean;
  /** Telegram id arrives as a string — it is a bigint server-side. */
  telegramId?: string | null;
  telegramUsername?: string | null;
  telegramPhotoUrl?: string | null;
  telegramLinkedAt?: string | null;
  phoneVerifiedVia?: "otp" | "telegram" | "bot" | null;
  cars?: AppCar[];
  notificationPreferences?: NotificationPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppCar {
  id: string;
  driver_id: string;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  seats_standard: number;
  color: string;
  status: CarStatus;
  passport_number?: string | null;
  carPassportLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeoPoint {
  city?: string;
  address?: string;
  coordinates?: { latitude: number; longitude: number };
}

export interface TripPrice {
  final_price?: number;
  driver_base_price?: number;
  price_per_person?: number;
  service_fee?: number;
  currency?: string;
  promocode?: {
    discounted?: number | null;
    discount_percentage?: number;
    has_active_promocode?: boolean;
  };
}

export interface AppTrip {
  id: string;
  driver_id?: string;
  car_id?: string;
  from_location?: GeoPoint;
  to_location?: GeoPoint;
  from_city?: string;
  to_city?: string;
  distance?: number;
  duration?: number;
  departure_ts: string;
  /** Sent by the API; the card shows it rather than deriving from duration. */
  arrival_ts?: string | null;
  seats_available: number;
  price?: TripPrice;
  price_per_person?: number;
  max_two_back?: boolean;
  conditioner?: boolean;
  smoking_allowed?: boolean;
  door_pickup?: boolean;
  food_stop?: boolean;
  garage?: GarageStatus;
  parcels_allowed?: boolean;
  parcel_price?: number | null;
  booking_type?: BookingType;
  comment?: string | null;
  status: TripStatus;
  driver?: Partial<AppUser>;
  car?: Partial<AppCar> & { gov_number?: string };
  bookings?: AppBooking[];
  driver_price?: {
    total_bookings_price?: number;
    price_per_person?: number;
    total_seats_booked?: number;
    commission?: { percentage?: number; amount?: number };
    driver_payout?: number;
    currency?: string;
  };
  trip_start_ts?: string | null;
  trip_end_ts?: string | null;
  created_at?: string;
  createdAt?: string;
}

export interface AppBooking {
  id: string;
  tripId?: string;
  passengerId?: string;
  passenger?: Partial<AppUser>;
  trip?: AppTrip;
  seatsBooked: number;
  totalPrice?: number;
  status: BookingStatus;
  pickup_location?: GeoPoint;
  dropoff_location?: GeoPoint;
  from_address?: string;
  to_address?: string;
  cancellationReason?: string | null;
  createdAt?: string;
  created_at?: string;
}

export interface AppParcel {
  id: string;
  trip_id?: string;
  sender_id?: string;
  price?: number;
  status: ParcelStatus;
  pickup_location?: GeoPoint;
  dropoff_location?: GeoPoint;
  cancellation_reason?: string | null;
  created_at?: string;
}

export interface AppWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface AppTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
}

export interface AppCard {
  id: number;
  cardNumber: string;
  contractId?: string;
  createdAt?: string;
}

export interface AppMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  mediaUrl?: string | null;
  isRead?: boolean;
  /** Echoed back for optimistic sends, so a local bubble can be reconciled. */
  clientId?: string | null;
  sender?: Pick<AppUser, "id" | "firstName"> & { avatar?: string | null };
  createdAt: string;
}

export interface AppChat {
  id: string;
  tripId: string;
  participant1Id: string;
  participant2Id: string;
  /** Both sides come back expanded — no extra lookup needed for the list. */
  participant1?: Partial<AppUser> & { registration_source?: string };
  participant2?: Partial<AppUser> & { registration_source?: string };
  unreadCount1?: number;
  unreadCount2?: number;
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead: boolean;
    senderId: string;
  } | null;
  isBlocked?: boolean;
  lastMessageAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  messages?: AppMessage[];
}

/** Trip summary the messages endpoint returns alongside the thread. */
export interface ChatTripSummary {
  tripid: string;
  from_address?: string;
  to_address?: string;
  from_city?: string;
  to_city?: string;
  date?: string;
  passengerCount?: number;
  driver?: Pick<AppUser, "id" | "firstName" | "lastName"> & { avatar?: string | null };
}

export interface AppRating {
  id: string;
  tripId: string;
  ratedUserId: string;
  ratingUserId: string;
  rating: number;
  feedback?: string | null;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppPromocode {
  id: string;
  code: string;
  discount: number;
  expiresAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface TripSearchQuery {
  from_latitude: number;
  from_longitude: number;
  to_latitude: number;
  to_longitude: number;
  departure_date: string;
  requested_seats?: number;
  sort_by_price?: "cheapest" | "expensive";
  sort_by_time?: "earliest" | "latest";
  conditioner?: boolean;
  smoking_allowed?: boolean;
  door_pickup?: boolean;
  food_stop?: boolean;
  garage?: GarageStatus;
  parcels_allowed?: "true" | "false";
  page?: number;
  limit?: number;
}

export interface CreateTripPayload {
  car_id: string;
  from_latitude: number;
  from_longitude: number;
  to_latitude: number;
  to_longitude: number;
  departure_ts: string;
  seats_available: number;
  price_per_person: number;
  distance?: number;
  duration?: number;
  max_two_back?: boolean;
  conditioner?: boolean;
  smoking_allowed?: boolean;
  door_pickup?: boolean;
  food_stop?: boolean;
  garage?: GarageStatus;
  parcels_allowed?: boolean;
  parcel_price?: number | null;
  booking_type?: BookingType;
  comment?: string | null;
}

export interface CreateBookingPayload {
  tripId: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_latitude: number;
  dropoff_longitude: number;
  seatsBooked: number;
}
