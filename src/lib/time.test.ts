import { describe, expect, it } from "vitest"
import { formatTime } from "./time"

describe("formatTime", () => {
  it("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("00:00")
  })

  it("formats 65 seconds", () => {
    expect(formatTime(65)).toBe("01:05")
  })

  it("formats 3599 seconds", () => {
    expect(formatTime(3599)).toBe("59:59")
  })
})
