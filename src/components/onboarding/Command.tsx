import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, MonitorCog } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Image from "next/image";

type OS = "linux" | "mac" | "windows";

const commands: Record<OS, string> = {
    linux:
        'echo "CPU: $(nproc) cores | RAM: $(awk \'/MemTotal/ {printf \\"%.0f\\", $2/1024/1024}\') GB | Storage: $(df -B1 --total | awk \'/total/ {printf \\"%.2f\\", $2/1024/1024/1024/1024}\') TB"',
    mac:
        'echo "CPU: $(sysctl -n hw.logicalcpu) cores | RAM: $(($(sysctl -n hw.memsize)/1024/1024/1024)) GB | Storage: $(df -k / | awk \'NR==2 {printf \\"%.2f\\", $2/1000/1000}\') TB"',
    windows:
        `Write-Output ("CPU: {0} cores | RAM: {1} GB | Storage: {2} TB" -f ` +
        `(Get-CimInstance Win32_Processor | Measure-Object NumberOfLogicalProcessors -Sum).Sum, ` +
        `[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB), ` +
        `[math]::Round((Get-CimInstance Win32_LogicalDisk | Where-Object DriveType -eq 3 | Measure-Object Size -Sum).Sum / 1TB, 2))`,
};

export function CommandHelper() {
    const [os, setOs] = useState<OS>("linux");
    const [copied, setCopied] = useState(false);
    const command = commands[os];

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary"><MonitorCog size={24} />Guidance</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl w-full p-6">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <MonitorCog size={22} />
                        Guidance
                    </DialogTitle>
                    <DialogDescription className="text-black text-base">
                        Follow the steps below to check your system specifications.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 mt-6">

                    {/* Step 1 */}
                    <div className="rounded border p-4 space-y-3">
                        <h3 className="text-lg font-semibold">Step 1 — Select your operating system</h3>

                        <Select value={os} onValueChange={(value) => setOs(value as OS)}>
                            <SelectTrigger className="h-12 w-56">
                                <SelectValue placeholder="Select OS" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="linux">
                                    <div className="flex items-center gap-2">
                                        <Image src="/companies/Linux.svg" alt="Linux" width={16} height={16} />
                                        Linux
                                    </div>
                                </SelectItem>

                                <SelectItem value="mac">
                                    <div className="flex items-center gap-2">
                                        <Image src="/companies/Apple.svg" alt="macOS" width={16} height={16} />
                                        macOS
                                    </div>
                                </SelectItem>

                                <SelectItem value="windows">
                                    <div className="flex items-center gap-2">
                                        <Image src="/companies/Windows.svg" alt="Windows" width={16} height={16} />
                                        Windows
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2 */}
                    <div className="rounded border p-4 space-y-3">
                        <h3 className="text-lg font-semibold">Step 2 — Copy the command</h3>

                        <div className="grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-10">
                                <pre className="text-white bg-black p-4 text-sm overflow-x-auto rounded-lg">
                                    {command}
                                </pre>
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 min-w-[120px] h-12 rounded-lg px-4
              text-white bg-black hover:bg-neutral-800 transition"
                                >
                                    <Copy size={16} />
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="rounded border p-4 space-y-3">
                        <h3 className="text-lg font-semibold">Step 3 — Open your terminal</h3>
                        <p className="text-black mt-1">
                            Search for <strong>Terminal</strong> on your device and open it.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="rounded border p-4 space-y-3">
                        <h3 className="text-lg font-semibold">Step 4 — Paste & run</h3>
                        <p className="text-black mt-1">
                            Paste the command into the terminal and press <strong>Enter</strong>.
                            You’ll see your <strong>CPU cores</strong>, <strong>RAM</strong>, and <strong>storage</strong>.
                        </p>
                    </div>

                </div>
            </DialogContent>

        </Dialog>
    );
}
