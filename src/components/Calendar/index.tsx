import { useEffect, useRef, useState } from "react"
import "./index.scss"
interface NullableOpenProperty {
    open?: boolean
    onOpenStateChanged?: (open: boolean) => void
}
function useNullableOpenPropertyOrState(props: NullableOpenProperty): [boolean, (state: boolean) => void] {
    const [state, setState] = useState(props.open ?? false)
    const setStateFunc = (state: boolean) => {
        props.onOpenStateChanged?.call(state)
        setState(state)
    }
    if (props.open === undefined) {
        return [state, setStateFunc]
    } else {
        return [props.open, setStateFunc]
    }
}
interface CalendarProps extends NullableOpenProperty {
    date: Date | null

    onSelectDate: (date: Date) => void

    startDate?: Date
    endDate?: Date
    dateFormat?: (date: Date | null) => string
}
export default function Calendar(props: CalendarProps) {

    const now = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const containerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useNullableOpenPropertyOrState(props)

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            let target = e.target as HTMLElement | null
            while (target) {
                if (target === containerRef.current) {
                    return
                }
                target = target.parentElement
            }
            document.body.removeEventListener("click", listener)
            setOpen(false)
        }
        if (open) {
            document.body.addEventListener("click", listener)
        } else {
            document.body.removeEventListener("click", listener)
        }
    }, [open, setOpen])

    const [selectingYear, setSelectingYear] = useState(props.date?.getFullYear() ?? now.getFullYear())
    const [selectingMonth, setSelectingMonth] = useState(props.date?.getMonth() ?? now.getMonth())

    const mousePanel = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1).getDay()
        const mouseDayCount = new Date(year, month + 1, 0).getDate()
        const labels = ["su", "mo", "tu", "we", "th", "fr", "st"]
        const spaces = firstDay === 7 ? 0 : firstDay
        const elementWidth = 100 / 7
        for (let i = 0; i < spaces; i++) {
            labels.push("")
        }
        const days: number[] = []
        for (let i = 0; i < mouseDayCount; i++) {
            days.push(i + 1)
        }
        const isSelected = (date: number) => year === props.date?.getFullYear()
            && month === props.date?.getMonth()
            && date === props.date?.getDate()
        return <>
            {
                labels.map((str, i) =>
                    <span key={i} style={{ display: "inline-block", width: elementWidth + "%" }}>{str}</span>)
            }
            {
                days.map((date, i) =>
                    <button
                        key={i}
                        style={{ display: "inline-block", width: elementWidth + "%" }}
                        onClick={() => {
                            props.onSelectDate(new Date(year, month, date))
                            setOpen(false)
                        }}
                    ><span style={{ textDecoration: isSelected(date) ? "underline" : "" }}>{date}</span></button>
                )
            }
        </>
    }
    const drop = <div className="calendar-drop">
        <div>
            <button onClick={() => {
                if (selectingMonth === 0) {
                    setSelectingYear(selectingYear - 1)
                    setSelectingMonth(11)
                } else {
                    setSelectingMonth(selectingMonth - 1)
                }
            }}>{"<="}</button>
            <button onClick={() => {
                if (selectingMonth === 11) {
                    setSelectingYear(selectingYear + 1)
                    setSelectingMonth(0)
                } else {
                    setSelectingMonth(selectingMonth + 1)
                }
            }}>{"=>"}</button>
            <span> {`${monthNames[selectingMonth]}, ${selectingYear}`}</span>
        </div>
        {mousePanel(selectingYear, selectingMonth)}
    </div>


    return <div ref={containerRef} className="calendar-container">
        <button onClick={() => {
            setOpen(!open)
        }}>{props.dateFormat ? props.dateFormat(props.date) : props.date?.toString()}</button>
        {open ? drop : <></>}
    </div>
}