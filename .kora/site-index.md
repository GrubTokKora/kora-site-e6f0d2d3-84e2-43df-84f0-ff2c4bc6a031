# Site index · format 2
Structure and the names of what each page offers. Values that change often — prices, hours, phone,
address — and body copy are deliberately not recorded here; read the page itself for those.

## index.html → /
title: Biryani Grill — Authentic Indian Restaurant | Aldie, Ashburn & Chantilly, VA
purpose: Home page for an authentic Indian restaurant with three locations in Virginia, featuring signature dishes, catering, and franchise inquiries.
sections:
- hero banner
- marquee text
- `#about` — about us story and stats
- `#menu-preview` — featured menu items grouped by categories: Signature Biryanis, Mutton Biryani (Goat), Chicken Dum Biryani, Paneer Biryani, Tandoor Specialties, Paneer Tikka, Fish Tikka, Hariyali Chicken, Curries & Specialties, Lababdar Paneer, Chicken Tikka Masala, Goat Curry
- `#locations` — restaurant locations with details and order buttons: Aldie, Ashburn, Chantilly
- `#catering` — catering service request form: Corporate, Private Event, Wedding, Pickup Trays, Full Service Catering, Birthday, Anniversary, Baby Shower, Corporate Event, Graduation, Holiday Party, Other
- `#contact` — franchise opportunity inquiry form
- `#location-modal` — location selection popup for menus: Aldie, Ashburn, Chantilly
also: The restaurant names (Biryani Grill — Aldie, Biryani Grill — Ashburn, Biryani Grill — Chantilly) and their respective addresses, phone numbers, and operating hours are mirrored in the JSON-LD schema block and the on-screen Locations section.

## aldie.html → /aldie
title: Biryani Grill Aldie | Stone Ridge, VA
purpose: Provide location details, gallery, and reviews for the Aldie restaurant branch.
sections:
- Location details and contact information: Stone Ridge, VA
- `#page-wrapper` "Location Gallery" — Photo gallery of the location
- "Customer Reviews" — Customer reviews and staff names: Tyrone Heitmann, Sandra Grace, Pete, Simmie K, Lakshmi
- Online ordering call to action: Order Now from Aldie Location
also: The restaurant name, telephone, street address, locality, region, postal code, cuisine type, and image appear in the structured-data block and are also shown in the body content.

## ashburn.html → /ashburn
title: Biryani Grill Ashburn | VA 20147
purpose: Provide details, gallery, reviews, and ordering options for the Ashburn location of Biryani Grill.
sections:
- location details and order link: Back to Home, Order Now from Ashburn Location
- `#page-wrapper` "Location Gallery" — photographs of the restaurant interior and ambience
- "Customer Reviews" — customer testimonials and dish mentions: paneer satay, saag chicken, butter naan

## careers.html → /careers
title: Careers at Biryani Grill | Join Our Team in Northern Virginia
purpose: List open career positions at Biryani Grill and provide an online job application form.
sections:
- "Join Our Team" — Company introduction: Aldie, Ashburn, Chantilly
- `#page-wrapper` "Open Positions" — Job listings and requirements: Server, Bartender, Dish Cleaning Helper, Aldie, Ashburn, Chantilly
- `#careers-form` "Apply Now" — Job application form: Server, Bartender, Dish Cleaning Helper

## chantilly.html → /chantilly
title: Biryani Grill Chantilly | VA 20151
purpose: Display location details, gallery, reviews, and ordering link for the Chantilly restaurant branch.
sections:
- `#page-wrapper` "Biryani Grill Chantilly" — location contact details and operating hours: Back to Home, 13635 US-50, Chantilly, VA 20151, Mon-Thu, Fri-Sat, Sunday

## support files
Files that are not pages. A line marked [content] holds words or data a visitor reads, so a
change to the site's content can land there; the rest only make the site work or look right.
- `robots.txt` — 104 bytes — too small to hold content
- `sitemap.xml` — Search engine sitemap listing site URLs and last modification dates
- `styles.css` — CSS stylesheet for the website layout, typography, colors, and styling
- `js/components.js` — Shared site header, footer, mobile drawer navigation, and contact details (phone numbers and locations) injected dynamically across pages: Aldie, Ashburn, Chantilly  [content]
- `js/main.js` — site configuration, brand links, social media links, and generated site header and footer text and links: Home, Menu, Catering, About, Contact Us, Careers, Franchise, Order Now, Quick Links, Hours, Facebook, Instagram, WhatsApp  [content]

## shared (every page)
The header, navigation, mobile menu and footer are propagated from index.html to every other page by
`shell_propagation`. A change to any of them is made on index.html alone and copied automatically.
