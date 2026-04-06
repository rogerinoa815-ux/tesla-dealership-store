// ============================================================
//  checkout.js  –  Roger Dealership Checkout Page Logic
// ============================================================
 
 
// ── HELPER ──────────────────────────────────────────────────
 
/** Same currency formatter as order.js */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
 
 
// ── PLAN LABELS ──────────────────────────────────────────────
// Maps the raw plan value to a human-readable string for the summary.
const planLabels = {
  "0":    "No plan",
  "1495": "2-Year Plan",
  "2495": "4-Year Plan",
  "3495": "6-Year Plan",
};
 
// Maps the raw model value to a display name.
const modelLabels = {
  "74990":  "Model 3",
  "89990":  "Model S",
  "104990": "Model S Plaid",
};
 
 
// ── LOAD ORDER SUMMARY FROM sessionStorage ───────────────────
//
// When the user clicked "Add to Cart" on the previous page,
// order.js saved all the order details into sessionStorage —
// a temporary browser key-value store that lives for the
// current browser tab session.
//
// Here we read those values back and display them in the
// left-hand Order Summary panel.
 
function loadSummary() {
  const modelValue = sessionStorage.getItem("modelValue") || "89990";
  const qty        = sessionStorage.getItem("qty")        || "1";
  const planValue  = sessionStorage.getItem("planValue")  || "0";
  const modelCost  = parseFloat(sessionStorage.getItem("modelCost")  || 0);
  const planCost   = parseFloat(sessionStorage.getItem("planCost")   || 0);
  const subtotal   = parseFloat(sessionStorage.getItem("subtotal")   || 0);
  const tax        = parseFloat(sessionStorage.getItem("tax")        || 0);
  const total      = parseFloat(sessionStorage.getItem("total")      || 0);
 
  // Write into the summary <span> elements
  document.getElementById("sum-model").textContent     = modelLabels[modelValue] || modelValue;
  document.getElementById("sum-qty").textContent       = qty;
  document.getElementById("sum-modelCost").textContent = formatCurrency(modelCost);
  document.getElementById("sum-plan").textContent      = planLabels[planValue]   || "–";
  document.getElementById("sum-subtotal").textContent  = formatCurrency(subtotal);
  document.getElementById("sum-tax").textContent       = formatCurrency(tax);
  document.getElementById("sum-total").textContent     = formatCurrency(total);
}
 
 
// ── INPUT FORMATTERS ─────────────────────────────────────────
// These functions auto-format the card fields as the user types,
// making data entry easier and reducing mistakes.
 
/**
 * Card number: inserts a space after every 4 digits.
 * "1234567890123456"  →  "1234 5678 9012 3456"
 *
 * How it works:
 *  1. Strip everything that isn't a digit.
 *  2. Slice into groups of 4 and join with spaces.
 *  3. Write the result back into the field.
 */
function formatCardNumber(input) {
  // Remove any non-digit character
  let digits = input.value.replace(/\D/g, "");
 
  // Split into chunks of 4, join with a space
  // match(/.{1,4}/g) returns an array like ["1234","5678","9012","3456"]
  let formatted = digits.match(/.{1,4}/g);
  input.value = formatted ? formatted.join(" ") : "";
}
 
/**
 * Expiry: auto-inserts " / " after the 2-digit month.
 * "1228"  →  "12 / 28"
 */
function formatExpiry(input) {
  let digits = input.value.replace(/\D/g, "");
 
  if (digits.length >= 3) {
    // First 2 = month, rest = year
    input.value = digits.slice(0, 2) + " / " + digits.slice(2, 4);
  } else {
    input.value = digits;
  }
}
 
/**
 * CVV: allow only digits, max 4 characters.
 */
function formatCVV(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 4);
}
 
 
// ── VALIDATION ───────────────────────────────────────────────
// Runs when the user submits the form. Returns true only if
// every required field is filled in correctly.
 
function validate() {
  let valid = true;
 
  // Helper: mark a field red and return false
  function fail(id) {
    document.getElementById(id).classList.add("error");
    valid = false;
  }
 
  // Helper: clear the red border once we've checked a field
  function pass(id) {
    document.getElementById(id).classList.remove("error");
  }
 
  // First & last name – must not be empty
  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  firstName ? pass("firstName") : fail("firstName");
  lastName  ? pass("lastName")  : fail("lastName");
 
  // Card number – must have 16 digits (ignoring spaces)
  const rawCard = document.getElementById("cardNumber").value.replace(/\D/g, "");
  rawCard.length === 16 ? pass("cardNumber") : fail("cardNumber");
 
  // Expiry – must match MM / YY and be a future date
  const expiryVal = document.getElementById("expiry").value;
  const expiryMatch = expiryVal.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (expiryMatch) {
    const month = parseInt(expiryMatch[1], 10);
    const year  = parseInt("20" + expiryMatch[2], 10);
    const now   = new Date();
    const expDate = new Date(year, month - 1);  // month is 0-indexed in JS
 
    // Valid if: month is 1-12 AND the expiry date is in the future
    if (month >= 1 && month <= 12 && expDate >= new Date(now.getFullYear(), now.getMonth())) {
      pass("expiry");
    } else {
      fail("expiry");
    }
  } else {
    fail("expiry");
  }
 
  // CVV – must be 3 or 4 digits
  const cvvVal = document.getElementById("cvv").value.replace(/\D/g, "");
  (cvvVal.length === 3 || cvvVal.length === 4) ? pass("cvv") : fail("cvv");
 
  // Billing address fields – only required if checkbox is unchecked
  const sameAddress = document.getElementById("sameAddress").checked;
  if (!sameAddress) {
    const street = document.getElementById("street").value.trim();
    const city   = document.getElementById("city").value.trim();
    const state  = document.getElementById("state").value.trim();
    const zip    = document.getElementById("zip").value.trim();
 
    street                  ? pass("street") : fail("street");
    city                    ? pass("city")   : fail("city");
    state.length === 2      ? pass("state")  : fail("state");
    /^\d{5}$/.test(zip)     ? pass("zip")    : fail("zip");
  }
 
  return valid;
}
 
 
// ── BILLING ADDRESS TOGGLE ───────────────────────────────────
// Shows or hides the billing address section based on the
// "Same as delivery address" checkbox.
 
function toggleBillingAddress() {
  const sameAddress    = document.getElementById("sameAddress");
  const billingSection = document.getElementById("billingAddress");
 
  // If the checkbox is checked  → hide the address fields
  // If unchecked                → show them
  billingSection.style.display = sameAddress.checked ? "none" : "block";
}
 
 
// ── BOOT ─────────────────────────────────────────────────────
 
document.addEventListener("DOMContentLoaded", function () {
 
  // Populate the order summary from the previous page's data
  loadSummary();
 
  // Attach live formatters to card fields
  // "input" fires on every single keystroke (unlike "change")
  document.getElementById("cardNumber").addEventListener("input", function () {
    formatCardNumber(this);
  });
  document.getElementById("expiry").addEventListener("input", function () {
    formatExpiry(this);
  });
  document.getElementById("cvv").addEventListener("input", function () {
    formatCVV(this);
  });
 
  // Clear red border as soon as the user starts correcting a field
  ["firstName", "lastName", "cardNumber", "expiry", "cvv",
   "street", "city", "state", "zip"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", function () {
        this.classList.remove("error");
      });
    }
  });
 
  // Toggle billing address section
  document.getElementById("sameAddress").addEventListener("change", toggleBillingAddress);
 
  // Form submission
  document.getElementById("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();   // stop the default page-reload behaviour
 
    if (!validate()) {
      // Scroll to the top of the form so the user can see the red fields
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
 
    // All valid – show the success overlay
    document.getElementById("successOverlay").classList.add("visible");
  });
});