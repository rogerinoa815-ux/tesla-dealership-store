 Tesla Dealership Store
A multi-page Tesla dealership web app built with vanilla HTML, CSS, and JavaScript. No frameworks, no libraries — just clean front-end fundamentals.

 Pages
Order Page (homeword.html)

Select a Tesla model (Model 3, Model S, Model S Plaid)
Choose quantity and a protection plan
Live price calculator updates subtotal, tax, and total instantly
Click Add to Cart to proceed to checkout

Checkout Page (checkout.html)

Displays a full order summary carried over from the order page
Payment form with auto-formatting (card number spacing, expiry slash)
Client-side validation with visual error feedback
Success confirmation overlay on completed purchase


Built With

HTML5
CSS3 (Grid, Flexbox)
Vanilla JavaScript (no frameworks)
sessionStorage for passing order data between pages


 File Structure
tesla-dealership-store/
├── home.html       # Order / product page
├── home.js            # Order form logic & calculations
├── checkout.html       # Payment / checkout page
├── checkout.js         # Checkout logic & validation
└── tesla_car.png       # Car image used on checkout page

How to Run
No installation needed. Just download all the files into the same folder and open home.html in your browser.

 All files must be in the same folder for the image and page navigation to work correctly.


 Features

✅ Live price calculation
✅ Multi-page navigation with sessionStorage
✅ Auto-formatting card number, expiry date, and CVV
✅ Form validation with red error highlights
✅ Responsive two-column layout
✅ Success overlay on purchase confirmation


👤 Author
rogerinoa815-ux — built as a front-end learning project
