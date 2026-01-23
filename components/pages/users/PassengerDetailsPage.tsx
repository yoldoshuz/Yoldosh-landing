"use client"

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePassengerDetails } from '@/hooks/useUser';
import { ArrowLeft, Loader2, Star, ChevronRight, User } from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { BASE_URL } from '@/lib/api';

export const PassengerDetailsPage = ({ passengerId }: { passengerId: string }) => {
    const router = useRouter();
    const { data, isLoading, error } = usePassengerDetails(passengerId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-emerald-500">
                <Loader2 className="size-8 animate-spin text-white" />
            </div>
        );
    }

    if (error || !data?.data?.user) {
        return (
            <div className="min-h-screen bg-emerald-500">
                <div className="p-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-white hover:bg-emerald-600"
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Назад
                    </Button>
                </div>
                <div className="text-center text-white mt-8">Пассажир не найден</div>
            </div>
        );
    }

    const user = data.data.user;
    const age = user.date_of__birthday
        ? Math.floor((new Date().getTime() - new Date(user.date_of__birthday).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : null;

    return (
        <div className="min-h-screen bg-neutral-100">
            {/* Header */}
            <div className="py-4 px-2 flex items-center justify-between bg-emerald-500">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-white hover:bg-emerald-600 p-2"
                >
                    <ArrowLeft className="size-6" />
                </Button>
                <h1 className="text-white text-lg font-semibold">Профиль</h1>
                <div className="w-10"></div>
            </div>

            {/* Profile Content */}
            <div className="relative">
                {/* Wave Background */}
                <div className="absolute top-0 left-0 right-0 h-32 w-full bg-emerald-500">
                    <svg
                        viewBox="0 0 1440 120"
                        className="absolute bottom-0 w-full h-24"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,64 C240,100 480,100 720,64 C960,28 1200,28 1440,64 L1440,120 L0,120 Z"
                            fill="#f5f5f5"
                        />
                    </svg>
                </div>

                {/* Avatar */}
                <div className="relative pt-4 flex flex-col justify-center items-center gap-2">
                    <Avatar className="size-32 rounded-full bg-emerald-100 flex items-center justify-center border-emerald-500 border">
                        <AvatarImage src={`${BASE_URL}${user.avatar}`} />
                        <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">
                            {user.firstName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-emerald-500 text-xl font-bold text-center">
                        {user.firstName} {user.lastName}
                        <p className="text-sm text-center">
                            {user.role === 'Passenger' ? 'Пассажир' : user.role}
                        </p>
                    </h2>
                </div>

                {/* Name and Role */}
                <div className="relative flex items-center justify-center w-full">
                    <div className="w-full max-w-3xl px-4">
                        {/* Info Sections */}
                        <div className="mt-6 space-y-4">
                            {/* Age */}
                            <div className="px-6 py-4 bg-white rounded-3xl">
                                <h3 className="text-neutral-900 font-bold text-base mb-1">
                                    Возраст:
                                </h3>
                                <p className="text-neutral-600 text-sm">
                                    {age ? `${age} лет` : '-'}
                                </p>
                            </div>

                            {/* Bio */}
                            <div className="px-6 py-4 bg-white rounded-3xl">
                                <h3 className="text-neutral-900 font-bold text-base mb-1">

                                    Биография
                                </h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">
                                    {user.bio || '-'}
                                </p>
                            </div>

                            {/* Rating */}
                            <div
                                className="flex items-center justify-between px-6 py-4 bg-white hover:bg-neutral-50 rounded-3xl smooth cursor-pointer"
                                onClick={() => {/* Handle rating click */ }}
                            >
                                <div>
                                    <h3 className="text-neutral-900 font-bold text-base mb-1">
                                        Оценка Пассажира
                                    </h3>
                                    <div className="flex items-center gap-2">

                                        <span className="text-neutral-400 text-xs">
                                            {user.ratingCount} отзыва
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Star className="size-4 fill-amber-400 text-amber-400" />
                                    <span className="text-neutral-900 font-semibold">
                                        {user.rating.toFixed(1)}
                                    </span>
                                    <ChevronRight className="size-6" strokeWidth={1.25} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};