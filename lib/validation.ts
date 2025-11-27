import { z } from 'zod';

export const searchTripSchema = z.object({
    from_latitude: z.coerce.number("'From' latitude must be a number."),
    from_longitude: z.coerce.number("'From' longitude must be a number."),

    to_latitude: z.coerce.number("'To' latitude must be a number."),
    to_longitude: z.coerce.number("'To' longitude must be a number."),

    departure_date: z.iso
        .datetime({
            message:
                'Invalid date format. Expected ISO string (yyyy-MM-ddTHH:mm:ssZ).',
        })
        .pipe(z.coerce.date())
        .refine((date) => date > new Date(), {
            message: 'Departure date must be in the future.',
        }),
    requested_seats: z.number().positive().default(1),

    // Сортировка
    sort_by: z.enum(['price', 'departure_date', 'distance']).optional(),
    sort_order: z.enum(['asc', 'desc']).optional().default('asc'),

    // Фильтры по характеристикам водителя
    smoking_allowed: z.boolean().optional(),
    pets_allowed: z.boolean().optional(),
    music_allowed: z.boolean().optional(),
    talkative: z.boolean().optional(),
    conditioner: z.boolean().optional(),
});

export type searchTripDto = z.infer<typeof searchTripSchema>;