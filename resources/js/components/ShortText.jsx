import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ShortText({ text }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="block max-w-[200px] truncate cursor-pointer">
                        {text}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs break-words">{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
