# MyLibri

-- Description --

MyLibri is a web application for adding manga to your own online librari. You have an opportunity to collect all mangas which you`ve already read and keep track of it. It allows users to upload images, enter manga information, and receive confirmation of successful submission. Also you can filter your list by categories.

-- Features --

Upload manga images

Enter text data (title, description, etc.)

Send data to the server via fetch

Display a confirmation modal window

-- Requirements --

Node.js (version 16+)

npm or yarn

A backend server running on localhost:4000 that handles POST requests to /add-manga

-- Getting Started --

- Clone the repository:

git clone https://github.com/olenkagrn/MyLibri.git
cd MyLibri

- Install dependencies:

npm install

- Start the local server:

npm start

Ensure the backend is running on localhost:4000. If the backend is not set up yet, follow its setup instructions.

- Open your browser and navigate to:

http://localhost:3000

-- Usage --

Fill out the form with the manga title and description.

Upload an image (by dragging and dropping or clicking the upload area).

Click the "Add Manga" button.

A confirmation modal will appear upon successful submission.

If an error occurs, an alert message will display the issue.
