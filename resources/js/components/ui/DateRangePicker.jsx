'use client'

import React, { useEffect, useState } from 'react'
import { CalendarArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import dayjs from 'dayjs'
import "dayjs/locale/id"
dayjs.locale("id")

export const DateRangePicker = ({ onChange }) => {
    const today = new Date();

    const [openStart, setOpenStart] = useState(false);
    const [dateStart, setDateStart] = useState(dayjs().startOf('month').toDate());

    const [openEnd, setOpenEnd] = useState(false);
    const [dateEnd, setDateEnd] = useState(today);

    useEffect(() => {
        if (onChange) {
            onChange({
                from: dateStart,
                to: dateEnd
            })
        }
    }, [dateStart, dateEnd])

    return (
        <div className="flex gap-1 items-center">
            <Popover open={openStart} onOpenChange={setOpenStart}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal bg-white"
                    >
                        {dateStart ? dayjs(dateStart).format('DD MMM YYYY') : "Mulai"}
                        <CalendarArrowDown />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateStart}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            const localDate = dayjs(date).format('YYYY-MM-DD');
                            setDateStart(localDate)
                            if (dateEnd && dateEnd < localDate) {
                                setDateEnd(localDate)
                            }
                            setOpenStart(false)
                        }}
                        disabled={(day) => day > today}
                    />
                </PopoverContent>
            </Popover>

            <div className='hidden md:block'>-</div>

            <Popover open={openEnd} onOpenChange={setOpenEnd}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal bg-white"
                    >
                        {dateEnd ? dayjs(dateEnd).format('DD MMM YYYY') : "Akhir"}
                        <CalendarArrowDown />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateEnd}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            const localDate = dayjs(date).format('YYYY-MM-DD');
                            setDateEnd(localDate)
                            setOpenEnd(false)
                        }}
                        disabled={(day) => day < dateStart || day > today}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
