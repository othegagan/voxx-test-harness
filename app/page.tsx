"use client";

import AuthSection from "@/components/sections/auth-section";
import { DeviceLookupSection } from "@/components/sections/device-lookup-section";
import { TripDetailsSection } from "@/components/sections/trip-details-section";
import { VehicleCommandSection } from "@/components/sections/vehicle-command-section";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOutIcon } from "lucide-react";

export default function Home() {
    const { authState, updateAuthState, logout, isLoading } = useAuth();

    return (
        <main className="container mx-auto min-h-screen p-4">
            <div className="flex items-center justify-between">
                <h3>Voxx Test Harness</h3>
                {authState.isAuthenticated && !isLoading && (
                    <Button variant="outline" size="sm" className="w-fit" onClick={logout} prefix={<LogOutIcon className="size-4" />}>
                        Logout
                    </Button>
                )}
            </div>
            {isLoading ? (
                <div className="h-[60dvh] w-full flex-center justify-center"> Loading...</div>
            ) : (
                <div>
                    <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                        <AuthSection authState={authState} setAuthState={updateAuthState} />
                        <DeviceLookupSection authState={authState} />
                        <VehicleCommandSection authState={authState} />
                    </div>
                    <div>
                        <TripDetailsSection authState={authState} />
                    </div>
                </div>
            )}
        </main>
    );
}
