import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function DateRangePicker({ value, onChange, minDate, maxDate }) {
    const [date, setDate] = React.useState(
        value || (minDate && maxDate
            ? { from: minDate, to: maxDate }
            : { from: new Date(), to: new Date() })
    );

    React.useEffect(() => {
        if (onChange) onChange(date);
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className="w-[260px] justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "dd MMM yyyy", { locale: id })} -{" "}
                                {format(date.to, "dd MMM yyyy", { locale: id })}
                            </>
                        ) : (
                            format(date.from, "dd MMM yyyy", { locale: id })
                        )
                    ) : (
                        <span>Pilih tanggal</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={id}
                />
            </PopoverContent>
        </Popover>
    )
}
