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
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-2xl flex items-center gap-2">

                        Guidance
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-black">Copy the command below according to your operating system to check your CPU cores, RAM, and storage </p>

                            <Select value={os} onValueChange={(value) => setOs(value as OS)}>
                                <SelectTrigger className="h-14 w-48">
                                    <SelectValue placeholder="Select OS" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="linux">
                                        
                                         <div className="flex items-center gap-2">
                                            <Image src="/companies/Linux.svg" alt="Linux" width={16} height={16} />
                                            <span className="text-black">Linux</span>
                                        </div>
                                        </SelectItem>

                                    <SelectItem value="mac">
                                        <div className="flex items-center gap-2">
                                            <Image src="/companies/Apple.svg" alt="macOS" width={16} height={16} />
                                            <span className="text-black">macOS</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="windows">
                                        <div className="flex items-center gap-2">
                                            <Image src="/companies/Windows.svg" alt="Windows" width={16} height={16} />
                                            <span className="text-black">Windows</span>
                                        </div>
                                        </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </DialogDescription>
                </DialogHeader>



                {/* OS Selection and Command */}
                <div className="flex flex-col md:flex-row md:items-start md:gap-4 mt-4">


                    <div className="flex-1 grid grid-cols-12 gap-4 items-start mt-4 md:mt-0">
                        <div className="col-span-10 mr-2">
                            <pre className="text-white bg-black p-4 text-sm overflow-x-auto rounded-lg h-full">
                                {command}
                            </pre>
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2  h-full
                                min-w-[140px] rounded-lg px-8 py-3 text-base font-medium text-white transition-all
                                bg-black hover:bg-neutral-800 cursor-pointer shadow-sm hover:shadow
                                "
                            >
                                <Copy size={16} className="mr-2" />
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>




            </DialogContent>
        </Dialog>
    );
}
