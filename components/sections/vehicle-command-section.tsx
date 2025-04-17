"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AuthState } from "@/hooks/use-auth";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { Label } from "../ui/label";

interface VehicleCommandSectionProps {
    authState: AuthState;
}

export const VehicleCommandSection = ({ authState }: VehicleCommandSectionProps) => {
    const [deviceId, setDeviceId] = useState("");
    const [command, setCommand] = useState("");
    const [param, setParam] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const [selectedDevice, _setSelectedDevice] = useQueryState("deviceId", { defaultValue: "" });

    const sendCommand = async () => {
        if (!authState.isAuthenticated) {
            setError("Please login first");
            toast.error("Please login first");
            return;
        }

        if (!deviceId) {
            setError("Please enter a device ID");
            toast.error("Please enter a device ID");
            return;
        }

        if (!command) {
            setError("Please select a command");
            toast.error("Please select a command");
            return;
        }

        setIsLoading(true);
        setError("");
        setResponse("");

        try {
            const baseUrl = process.env.NEXT_PUBLIC_VOXX_API_URL;

            const response = await fetch(`${baseUrl}/devices/command`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deviceId,
                    command,
                    param: param || "",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send command");
            }

            const data = await response.json();
            setResponse(JSON.stringify(data, null, 2));
            toast.success(`Command ${command} sent successfully`);
        } catch (err) {
            setError("Failed to send command");
            toast.error("Failed to send command");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Vehicle Command</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Label className="w-28">DeviceId</Label>
                        <Select value={deviceId} onValueChange={setDeviceId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select device" />
                            </SelectTrigger>
                            <SelectContent>{selectedDevice && <SelectItem value={selectedDevice}>{selectedDevice}</SelectItem>}</SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center">
                        <Label className="w-28">Command</Label>
                        <Select value={command} onValueChange={setCommand}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select command" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="locate">locate</SelectItem>
                                <SelectItem value="req_fuel">req_fuel</SelectItem>
                                <SelectItem value="req_speed">req_speed</SelectItem>
                                <SelectItem value="req_odo">req_odo</SelectItem>
                                <SelectItem value="req_dtc">req_dtc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center">
                        <Label className="w-28">Param</Label>
                        <Input type="text" value={param} onChange={(e) => setParam(e.target.value)} />
                    </div>
                </div>
                <div className="mt-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {response && (
                        <div className="max-h-40 overflow-auto border border-gray-300 bg-muted p-2 text-sm">
                            <pre>{response}</pre>
                        </div>
                    )}
                </div>

                <Button
                    onClick={sendCommand}
                    disabled={isLoading || !deviceId || !command || !authState.isAuthenticated}
                    isLoading={isLoading}
                    loadingText="Sending Command..."
                    className="mt-4 w-full"
                >
                    Send Command
                </Button>
            </CardContent>
        </Card>
    );
};
