// ============================================================
//  order.js  –  Roger Dealership Tesla Order Form Logic
// ============================================================
 
 
// ── HELPER ──────────────────────────────────────────────────
 
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
 
 
// ── CORE CALCULATION FUNCTION ────────────────────────────────
 
function updateOrder() {
 
  const modelPrice = Number(document.getElementById("model").value);
  const qty        = Number(document.getElementById("qty").value);
  const modelCost  = modelPrice * qty;
 
  const selectedPlan = document.querySelector('input[name="plan"]:checked');
  const planCost = selectedPlan ? Number(selectedPlan.value) : 0;
 
  const subtotal = modelCost + planCost;
  const tax      = subtotal * 0.05;
  const total    = subtotal + tax;
 
  document.getElementById("modelCost").value = formatCurrency(modelCost);
  document.getElementById("planCost").value  = formatCurrency(planCost);
  document.getElementById("subtotal").value  = formatCurrency(subtotal);
  document.getElementById("salesTax").value  = formatCurrency(tax);
  document.getElementById("totalCost").value = formatCurrency(total);
}
 
 
// ── ATTACH EVENT LISTENERS ───────────────────────────────────
 
document.addEventListener("DOMContentLoaded", function () {
 
  const modelSelect = document.getElementById("model");
  const qtySelect   = document.getElementById("qty");
  const planRadios  = document.querySelectorAll('input[name="plan"]');
 
  modelSelect.addEventListener("change", updateOrder);
  qtySelect.addEventListener("change", updateOrder);
 
  planRadios.forEach(function (radio) {
    radio.addEventListener("change", updateOrder);
  });
 
  // ── FORM SUBMIT: save order data, then redirect ──────────
  //
  // sessionStorage is a simple key-value store built into every
  // browser. Data saved here is only available in the current
  // tab and is automatically deleted when the tab is closed.
  //
  // We use it to pass the order details over to checkout.html
  // so it can display the Order Summary without the user having
  // to re-enter anything.
 
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
 
    const modelValue   = document.getElementById("model").value;
    const qty          = document.getElementById("qty").value;
    const selectedPlan = document.querySelector('input[name="plan"]:checked');
    const planValue    = selectedPlan ? selectedPlan.value : "0";
 
    const modelCost = Number(modelValue) * Number(qty);
    const planCost  = Number(planValue);
    const subtotal  = modelCost + planCost;
    const tax       = subtotal * 0.05;
    const total     = subtotal + tax;
 
    // Save everything to sessionStorage so checkout.html can read it
    sessionStorage.setItem("modelValue", modelValue);
    sessionStorage.setItem("qty",        qty);
    sessionStorage.setItem("planValue",  planValue);
    sessionStorage.setItem("modelCost",  modelCost);
    sessionStorage.setItem("planCost",   planCost);
    sessionStorage.setItem("subtotal",   subtotal);
    sessionStorage.setItem("tax",        tax);
    sessionStorage.setItem("total",      total);
 
    // Navigate to the checkout page
    window.location.href = "checkout.html";
  });
 
  updateOrder();
});
 