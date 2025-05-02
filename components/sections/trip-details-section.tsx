'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AuthState } from '@/hooks/use-auth';
import { formatDistanceInMiles } from '@/lib/utils';
import { Tooltip } from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { Label } from '../ui/label';
import { TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TripDetailsSectionProps {
    authState: AuthState;
}

interface Trip {
    tripId: string;
    start: string;
    end: string;
    alerts: number;
    distance: number;
    startAddress?: Address;
    endAddress?: Address;
}

interface Address {
    fullAddress: string;
    street: string;
}

export const TripDetailsSection = ({ authState }: TripDetailsSectionProps) => {
    const [selectedDevice, setSelectedDevice] = useQueryState('deviceId', { defaultValue: '' });

    const [fromDate, setFromDate] = useState('2024-04-01');
    const [toDate, setToDate] = useState('2024-04-10');
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTrips = async () => {
        if (!authState.isAuthenticated) {
            setError('Please login first');
            return;
        }

        if (!selectedDevice) {
            setError('Please enter device IDs');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const baseUrl = process.env.NEXT_PUBLIC_VOXX_API_URL;

            const response = await fetch(`${baseUrl}/devices/trips?deviceIds=${selectedDevice}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trips');
            }

            const data = await response.json();

            // Transform the API response to match our Trip interface
            const tripList: Trip[] = data.results?.tripList.map((trip: any) => ({
                tripId: trip.tripId,
                start: new Date(trip.startDate).toLocaleString(),
                end: new Date(trip.endDate).toLocaleString(),
                alerts: trip.alerts || 0,
                distance: trip.distance || 0,
                startAddress: trip.startAddress,
                endAddress: trip.endAddress
            }));

            setTrips(tripList);
        } catch (err) {
            setError('Failed to fetch trips');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-lg'>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='flex items-center gap-2'>
                        <Label className='w-28'>DeviceId</Label>
                        <Input
                            type='text'
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                            placeholder='Device Id'
                        />
                    </div>

                    <div className='flex items-center gap-2'>
                        <Label className='w-28 text-nowrap'>From - To</Label>
                        <Input type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        <span>—</span>
                        <Input type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>

                    <Button
                        onClick={fetchTrips}
                        disabled={isLoading || !selectedDevice || !authState.isAuthenticated}
                        isLoading={isLoading}
                        loadingText='Fetching...'
                        className='w-fit'>
                        Fetch Trips
                    </Button>
                </div>

                {error && <p className='text-red-500 text-sm'>{error}</p>}

                <div className='border'>
                    <table className='w-full table-auto border-collapse border'>
                        <thead>
                            <tr className='bg-muted'>
                                <th>TripId</th>
                                <th>Start - End</th>
                                <th>Started From</th>
                                <th>Ended At</th>
                                <th>Miles</th>
                            </tr>
                        </thead>
                        <tbody className='max-h-40 overflow-y-auto'>
                            {trips.map((trip, index) => (
                                <tr key={index} >
                                    <td className='border p-2'>
                                        <Link href={`/details/${trip.tripId}`} target='_blank'>
                                            {trip.tripId.slice(0, 8)}...
                                        </Link>
                                    </td>
                                    <td className='border p-2'>
                                        {format(new Date(trip.start), 'PPpp')} - {format(new Date(trip.end), 'PPpp')}
                                    </td>
                                    <td className='border p-2'>
                                        <Tooltip>
                                            <TooltipTrigger>{trip.startAddress?.street}</TooltipTrigger>
                                            <TooltipContent>
                                                <p>{trip.startAddress?.fullAddress}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </td>
                                    <td className='border p-2'>
                                        <Tooltip>
                                            <TooltipTrigger>{trip.endAddress?.street}</TooltipTrigger>
                                            <TooltipContent>
                                                <p>{trip.endAddress?.fullAddress}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </td>
                                    <td className='border p-2'>{formatDistanceInMiles(trip.distance)}</td>
                                </tr>
                            ))}

                            {trips.length === 0 && (
                                <tr>
                                    <td colSpan={4} className='border-t p-2 text-center'>
                                        No trips found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};
