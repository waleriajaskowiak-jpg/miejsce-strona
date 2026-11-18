# Audyt mobile

Checked all 34 built routes at 360, 390, 430, 768 and 1024. Phone type is H1 48px (44px under 380), H2 38px (36px under 380), lead 17px, body 16px. Nothing measured under 13px, and no page scrolls sideways.

| Problem | Fix |
| --- | --- |
| Stacked section heads dropped the gap under the H2, so on `/ceny/` „Obsługa, AV, DJ i dodatki” sat on the lead and the eyebrow disappeared into the dark band. | Phone heads are a column: eyebrow 18px, then the H2, then 22px before the lead. |
| Hero on a phone was a full-viewport crop. Photos in galleries and the home bento became short strips. | Hero photo is a 4:5 frame with a 20px radius. Galleries and the home mosaic are a 2-column 4:3 / square grid. |
| „Co planujesz?” stayed a desktop accordion. The day line and the add-on row scrolled with no hint that more was off-screen. | Those rows are snap carousels at 84% width, with a peek of the next card and dots. |
| The space list was a dense row and the plan caption collided with the photo. The slider thumb was an 8px native control. | Spaces are cards. The photo, caption and plan stack. Range inputs are 44px tall with a 28px thumb. |
| The price estimator showed every control at once, and the total sat away from the step. | On a phone it is three steps (guests, catering, bar) with Dalej / Wstecz and the total stuck to the bottom of the card. |
| The sticky „Zaplanuj event” bar covered cards, the day tabs and the footer. | The bar sits under the scrolling page, so it never covers copy. It hides on `/kontakt/`, while a form or another contact button is on screen, while the menu is open, and once the footer is in view. |
| The full-screen menu drew its links in ink on ink, and the pinned button covered the lower items. | Links are white, the current page is marked, and the two buttons follow the list so the panel can scroll. |
| Footer on a phone was one long column. 404 and the thank-you page painted a black column with white side gaps. | Footer is the address plus a 2-column link grid. Those two pages are full-bleed. |
| At 768 the home headline started underneath the fixed header. Cards collapsed to one stretched column. | Tablet keeps a 2-column hero, cards and editorial splits, and the headline clears the 64px header. |
| Inputs could fall under 16px, which zooms the page on iOS. | Form fields are 16px with visible labels, and the types stay email, tel and numeric. |

Round 11, from the 390 and 768 review:

| Problem | Fix |
| --- | --- |
| The hero pill sat under the fixed header. | The photo starts 16px below the header. The pill is inset 16px. |
| The carousel number overlapped the eyebrow and the title was clipped. | Number, eyebrow and title stack with 14px gaps, inside the card. |
| The menu close mark was two chevrons. | One pair of strokes draws the X. |
| Gallery captions wrapped on the photo edge. | Single-line pills with a 12px inset. |
| Footer columns were uneven, „Scenariusze” was listed twice, and the row gap was about 64px. | Four headed groups, one „Scenariusze”, 14px between rows. |
| Category heroes left a dark void above the pills. | A 16:9 photo sits under the lead, then the pills, on all four categories. |
| The kontakt heading sat about 80px above the first field. | 28px. |
| The add-on lead sat about 90px above the cards, and the estimate looked grey. | 28px gap. The price is white. |
| At 768 the four stats shared one cramped row. | 2×2 up to 900px. Hero buttons share a row when they fit, otherwise both are full width. |
| Partner marks did not match on the dark band. | The same white treatment, in a looping row. |
| The contact bar covered the last line of a section. | It sits under the scroller, with 76px of padding so the last lines clear it. It hides while the menu is open or the contact form is on screen. |
