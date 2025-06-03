"use client"

import * as React from "react"
import {
  Slider as AriaSlider,
  type SliderProps as AriaSliderProps,
  SliderStateContext as AriaSliderStateContext,
  SliderThumb as AriaSliderThumb,
  type SliderThumbProps as AriaSliderThumbProps,
  SliderTrack as AriaSliderTrack,
  type SliderTrackProps as AriaSliderTrackProps,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

const useSliderState = () => {
  const state = React.useContext(AriaSliderStateContext)
  if (!state) {
    throw new Error("Slider components must be used within a Slider context")
  }
  return state
}

const SliderRoot = <T extends number | number[]>({
  className,
  orientation = "horizontal",
  ...props
}: AriaSliderProps<T>) => (
  <AriaSlider
    className={composeRenderProps(className, (className) =>
      cn(
        "relative flex touch-none select-none items-center",
        {
          "h-full": orientation === "vertical",
          "w-full": orientation === "horizontal",
        },
        className,
      ),
    )}
    orientation={orientation}
    {...props}
  />
)

const SliderTrack = ({ className, ...props }: AriaSliderTrackProps) => (
  <AriaSliderTrack
    className={composeRenderProps(className, (className, renderProps) =>
      cn(
        {
          "h-2 w-full": renderProps.orientation === "horizontal",
          "h-full w-2": renderProps.orientation === "vertical",
        },
        "relative grow rounded-full bg-secondary",
        /* Disabled */
        "data-[disabled]:opacity-50",
        className,
      ),
    )}
    {...props}
  />
)

const SliderFillTrack = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const state = useSliderState()
  const orientation = state.orientation === "vertical" ? "height" : "width"
  return (
    <div
      style={{ [orientation]: `${state.getThumbPercent(0) * 100}%` }}
      className={cn(
        "absolute rounded-full bg-primary",
        {
          "h-full": state.orientation === "horizontal",
          "w-full bottom-0": state.orientation === "vertical",
        },
        className,
      )}
      {...props}
    />
  )
}

const SliderThumb = ({ className }: AriaSliderThumbProps) => (
  <AriaSliderThumb
    className={composeRenderProps(className, (className) =>
      cn(
        "left-1/2 top-1/2 block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
        /* Disabled */
        "data-[disabled]:pointer-events-none",
        /* Focus Visible */
        "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
        className,
      ),
    )}
  />
)

const Slider = <T extends number | number[]>(props: AriaSliderProps<T>) => {
  return (
    <SliderRoot {...props}>
      <SliderTrack>
        <SliderFillTrack />
        <SliderThumb />
      </SliderTrack>
    </SliderRoot>
  )
}

export { SliderRoot, SliderTrack, SliderFillTrack, SliderThumb, Slider }
