import { describe, expect, test } from "vitest"
import { formatTime } from "./time"

describe("formatTime", () => {
  test("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("00:00")
  })

  test("formats 65 seconds", () => {
    expect(formatTime(65)).toBe("01:05")
  })

  test("formats 3599 seconds", () => {
    expect(formatTime(3599)).toBe("59:59")
  })
})
