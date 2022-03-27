- [] Fix colliding context menu dropdowns with the rest of collab elements

- [x] Add image file upload on sign up
  - [x] Include image URL to database schema
  - [x] Save files to the backend
  - [x] Load and display image for a user on the Dashboard page
  - [x] Send request for the user's image when connecting to the VHV client


- [x] Scroll up on paste

- [x] Fix: sometimes `Show Comments` layout shift fails because Ace editor is given a fixed width in pixels
  - Was caused by setting up the splitter element
- [X] Sanitize comment post and reply form
  - Was escaping the input with express-validator, had to call unescape() afterwards to replace escaped characters with normal values