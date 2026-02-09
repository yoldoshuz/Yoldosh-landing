'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { Check, LoaderCircle, X } from 'lucide-react';

type DeleteStatus = 'idle' | 'loading' | 'success' | 'error';

type ApiResponse = {
    success: boolean;
    status_code: number;
    message: string;
    errors?: string[];
};

export const DeleteAccount = () => {
    const t = useTranslations('Pages.DeleteAccount');
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<DeleteStatus>('idle');
    const [apiMessage, setApiMessage] = useState<string>('');
    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [countdown, setCountdown] = useState(10);
    
    const hasRun = useRef(false);
    const storageKey = `deleteAccount_${searchParams.get('phone')?.trim() || 'unknown'}`;

    let phone = searchParams.get('phone')?.trim();
    const token = searchParams.get('token')?.trim();

    if (phone && !phone.startsWith('+') && phone.startsWith('998')) {
        phone = '+' + phone;
    }

    useEffect(() => {
        const isDeleted = localStorage.getItem(storageKey);
        if (isDeleted) {
            setStatus('success');
            setApiMessage(t('successDefault'));
            startRedirectTimer();
            return;
        }

        if (hasRun.current) return;
        hasRun.current = true;

        if (!phone || !token) {
            setStatus('error');
            setApiMessage(t('missingParams'));
            return;
        }

        if (!/^\+998[0-9]{9}$/.test(phone)) {
            setStatus('error');
            setApiMessage(t('invalidPhone'));
            return;
        }

        if (token.length < 50) {
            setStatus('error');
            setApiMessage(t('invalidToken'));
            return;
        }

        const deleteAccount = async () => {
            setStatus('loading');
            setApiMessage('');
            setApiErrors([]);

            try {
                const response = await api.request<ApiResponse>({
                    method: 'DELETE',
                    url: '/user/delete-by-phone',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    data: { phoneNumber: phone },
                });

                setStatus('success');
                setApiMessage(response.data.message || t('successDefault'));

                localStorage.setItem(storageKey, 'deleted');

                startRedirectTimer();
            } catch (err) {
                const error = err as AxiosError<ApiResponse>;
                console.error('[DeleteAccount Error]', error);

                const backendMessage = error.response?.data?.message;
                const backendErrors = error.response?.data?.errors || [];

                setStatus('error');
                setApiMessage(
                    backendMessage ||
                    error.message ||
                    t('somethingWentWrong')
                );
                setApiErrors(backendErrors);
            }
        };

        deleteAccount();
    }, [phone, token, t, router, storageKey]);

    const startRedirectTimer = () => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.replace(`/${t('locale') || 'ru'}`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup
        return () => clearInterval(timer);
    };

    return (
        <div className="max-w-lg mx-auto py-12 px-6 text-center">
            <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

            {status === 'loading' && (
                <div className="flex flex-col items-center">
                    <LoaderCircle className='animate-spin rounded-full size-14 text-emerald-500 mb-6' />
                    <p className="text-lg">{t('deleting')}</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center justify-center text-emerald-700 bg-green-50 p-8 rounded-xl border border-emerald-200">
                    <Check className='text-6xl mb-4' />
                    <h2 className="text-2xl font-semibold mb-4">{t('success')}</h2>
                    <p className="text-lg mb-6">{apiMessage}</p>
                    <p className="text-gray-700">
                        {t('redirectIn')} {countdown} {t('seconds')}...
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center justify-center text-red-700 bg-red-50 p-8 rounded-xl border border-red-200">
                    <X className='text-6xl mb-4' />
                    <h2 className="text-2xl font-semibold mb-4">{t('error')}</h2>
                    <p className="text-lg mb-4">{apiMessage}</p>

                    {apiErrors.length > 0 && (
                        <ul className="list-disc list-inside text-left mt-4 text-sm text-red-800">
                            {apiErrors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    )}

                    <p className="mt-8 text-gray-700">{t('contactSupport')}</p>
                </div>
            )}
        </div>
    );
};