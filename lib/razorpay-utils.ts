/**
 * Utility functions for Razorpay integration
 */

// Prepare the page for Razorpay modal
export function prepareForRazorpay() {
  // Set the body attribute
  document.body.setAttribute("data-razorpay-active", "true")

  // Hide any dialogs
  const dialogs = document.querySelectorAll('[role="dialog"]')
  dialogs.forEach((dialog) => {
    dialog.setAttribute("style", "display: none !important; pointer-events: none !important;")
  })

  // Disable pointer events on fixed/absolute elements that might block interaction
  const fixedElements = document.querySelectorAll(".fixed, .absolute")
  fixedElements.forEach((el) => {
    el.setAttribute("data-original-z-index", el.style.zIndex || "")
    el.setAttribute("data-original-pointer-events", el.style.pointerEvents || "")
    el.style.zIndex = "-1"
    el.style.pointerEvents = "none"
  })
}

// Clean up after Razorpay modal closes
export function cleanupAfterRazorpay() {
  // Remove the body attribute
  document.body.removeAttribute("data-razorpay-active")

  // Restore dialogs
  const dialogs = document.querySelectorAll('[role="dialog"]')
  dialogs.forEach((dialog) => {
    dialog.removeAttribute("style")
  })

  // Restore fixed/absolute elements
  const fixedElements = document.querySelectorAll("[data-original-z-index], [data-original-pointer-events]")
  fixedElements.forEach((el) => {
    const originalZIndex = el.getAttribute("data-original-z-index")
    const originalPointerEvents = el.getAttribute("data-original-pointer-events")

    if (originalZIndex) el.style.zIndex = originalZIndex
    if (originalPointerEvents) el.style.pointerEvents = originalPointerEvents

    el.removeAttribute("data-original-z-index")
    el.removeAttribute("data-original-pointer-events")
  })
}
