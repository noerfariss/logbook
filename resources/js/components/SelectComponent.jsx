"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"
import { useVirtualizer } from "@tanstack/react-virtual"

export function SelectComponent({ placeholder = 'Cari data...', value, onChange, route, parent = null, parentRequired = false }) {
    const parentRef = React.useRef(null)
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const [search, setSearch] = React.useState("")

    const filteredData = data.filter((item) => {
        const matchLabel = item.label.toLowerCase().includes(search.toLowerCase());

        if (parent) {
            // filter tambahan berdasarkan parent
            return item.parent === parent && matchLabel;
        }

        return matchLabel;
    });

    const rowVirtualizer = useVirtualizer({
        count: filteredData.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 45, // tinggi row
    })

    const getData = async () => {
        try {
            const req = await axios.get(route, {
                params: {
                    parent
                }
            });
            const res = req.data;
            setData(res.data);

        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);

        }
    }

    React.useEffect(() => {
        getData();
    }, [])

    React.useEffect(() => {
        if (open) {
            rowVirtualizer.measure() // paksa hitung ulang ukuran
        }
    }, [open, rowVirtualizer]);

    React.useEffect(() => {
        if (parent) {
            onChange('');
        }
    }, [parent])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={parentRequired}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? data.find((item) => item.id.toString() === value.toString())?.label
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                    <CommandInput placeholder={placeholder} className="h-9" onValueChange={(text) => setSearch(text)} />
                    <CommandList
                        ref={open ? parentRef : null}
                        style={{ maxHeight: "300px", overflow: "auto" }}
                    >
                        <div
                            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                            className="w-full relative"
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const item = filteredData[virtualRow.index]
                                if (!item) return null;

                                return (
                                    <CommandItem
                                        key={item.id}
                                        value={item.label}
                                        onSelect={() => { onChange(item.id); setOpen(false); setSearch('') }}
                                        className={
                                            cn(
                                                'absolute top-0 left-0 py-3 w-full justify-between',
                                                'focus:bg-green-600',
                                            )
                                        }
                                        style={{ transform: `translateY(${virtualRow.start}px)` }}
                                    >
                                        {item.label}
                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                )
                            })}
                        </div>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
