"use client";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AuthState } from "@/hooks/use-auth";
import type { Device } from "@/types";
import { useState } from "react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeviceLookupSectionProps {
    authState: AuthState;
}

export const DeviceLookupSection = ({ authState }: DeviceLookupSectionProps) => {
    const [airId, setAirId] = useState("");
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedDevice, setSelectedDevice] = useQueryState("deviceId", { defaultValue: "" });

    const fetchDevicesByAccount = async () => {
        if (!authState.isAuthenticated) {
            setError("Please login first");
            toast.error("Please login first");
            return;
        }

        setIsLoading(true);
        setError("");
        setDevices([]);
        setSelectedDevice("");
        setAirId("");

        try {
            const baseUrl = process.env.NEXT_PUBLIC_VOXX_API_URL;

            const response = await fetch(`${baseUrl}/devices/byaccount/${authState.accountId}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch devices with status: ${response.status}`);
            }

            const data = await response.json();

            // Transform the API response to match our Device interface
            const deviceList: Device[] =
                data.results.devices.map((device: any) => ({
                    deviceId: device.id,
                    airId: device.airId || "N/A",
                    model: device.model || "N/A",
                    name: device.name || "N/A",
                })) || [];

            setDevices(deviceList);
            toast.success(`Found ${deviceList.length} devices`);
        } catch (err) {
            setError("Failed to fetch devices");
            toast.error("Failed to fetch devices");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Device Lookup</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="account">
                    <TabsList className="w-full">
                        <TabsTrigger value="air">By Air ID</TabsTrigger>
                        <TabsTrigger value="account">By Account ID</TabsTrigger>
                    </TabsList>

                    <TabsContent value="air" className="mt-2">
                        <div className="flex gap-2">
                            <Input type="text" value={airId} onChange={(e) => setAirId(e.target.value)} placeholder="Enter Air ID" />
                            <Button onClick={() => {}} disabled>Search</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="account" className="mt-2">
                        <Button
                            onClick={fetchDevicesByAccount}
                            disabled={isLoading || !authState.isAuthenticated}
                            isLoading={isLoading}
                            loadingText="Fetching Devices..."
                        >
                            Fetch Devices
                        </Button>
                    </TabsContent>
                </Tabs>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="mt-4 rounded-md border">
                    <div className="grid grid-cols-3 ">
                        <div className=" border-r p-2">DeviceId</div>
                        <div className=" border-r p-2">Airid</div>
                        <div className=" border-r p-2">Name</div>
                    </div>

                    <div className="max-h-40 overflow-y-auto">
                        {devices.map((device, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "grid cursor-pointer grid-cols-3 *:truncate *:border-t *:border-r *:p-2 hover:bg-muted",
                                    selectedDevice === device.deviceId && "bg-muted"
                                )}
                                onClick={() => setSelectedDevice(device.deviceId)}
                            >
                                <div>{device.deviceId}</div>
                                <div>{device.airId}</div>
                                <div>{device.name}</div>
                            </div>
                        ))}

                        {devices.length === 0 && <div className=" border-t p-2 text-center text-neutral-500">No devices found</div>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
