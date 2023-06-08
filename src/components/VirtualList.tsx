import { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./VirtualList.scss"
interface VirtualListProps<T> {
    delegate: (item: T) => JSX.Element
    items: T[]
    scrollPosition: number

    itemHeight: number

    onScroll: (offset: number) => void
}
export default function VirtualList<T>(props: VirtualListProps<T>) {

    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    useLayoutEffect(() => {
        if (eleRef.current) {
            setHeight(eleRef.current.clientHeight)
            setWidth(eleRef.current.clientWidth)
        }
    })

    const scrollBarRef = useRef(null)

    // measure first displayed item offset
    const firstItemOffset = props.scrollPosition % props.itemHeight

    // measure which item is the first to display
    const jumpItemNumber = (props.scrollPosition - firstItemOffset) / props.itemHeight

    const displayItemNumber = Math.ceil(height / props.itemHeight)

    const displayItems = props.items.slice(jumpItemNumber, jumpItemNumber + displayItemNumber + 1).map(props.delegate)

    const eleRef = useRef(null)

    return <div className="virtual-list-container" ref={eleRef}>
        <div className="virtual-list-items" onWheel={(e) => {
            if (scrollBarRef) {
                // let ev = scrollBarRef.current.dispatchEvent(new WheelEvent(e.nativeEvent.type), e.)
                scrollBarRef.current.scroll({
                    top: scrollBarRef.current.scrollTop + e.deltaY,
                    left: scrollBarRef.current.scrollLeft + e.deltaY,
                    behavior: "smooth",
                })
            }
        }} style={{ marginTop: `-${firstItemOffset}px` }}>
            {displayItems}
        </div>
        {
            height < props.itemHeight * props.items.length ?
                <div ref={scrollBarRef} style={{ height: "100%", width: "auto", overflowY: "scroll" }} onScroll={
                    () => {
                        if (scrollBarRef) {
                            props.onScroll(scrollBarRef.current.scrollTop)
                        }
                    }
                }> <div style={{ height: props.itemHeight * props.items.length, width: "1px" }}></div></div>
                :
                <></>
        }

    </div>
}

