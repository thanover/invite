# Event Management CRUD Application

This is a simple CRUD application for managing events built with Express.js and TypeScript.

## Project Structure

```
backend
├── src
│   ├── app.ts                # Entry point of the application
│   ├── routes
│   │   └── event.routes.ts   # Routes for event management
│   ├── controllers
│   │   └── event.controller.ts# Controller for handling event logic
│   ├── models
│   │   └── event.model.ts     # Event model definition
│   └── types
│       └── index.ts          # Type definitions for events
├── package.json               # NPM package configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the application:
   ```
   npm start
   ```

## Usage

The application provides a RESTful API for managing events. The following endpoints are available:

- **GET /events**: Retrieve a list of all events.
- **GET /events/:id**: Retrieve a specific event by ID.
- **POST /events**: Create a new event.
- **PUT /events/:id**: Update an existing event by ID.
- **DELETE /events/:id**: Delete an event by ID.

## API Endpoints

- **GET /events**
  - Description: Fetch all events.
  
- **GET /events/:id**
  - Description: Fetch a single event by its ID.
  
- **POST /events**
  - Description: Create a new event.
  - Request Body: Event details (title, date, description).
  
- **PUT /events/:id**
  - Description: Update an existing event.
  - Request Body: Updated event details.
  
- **DELETE /events/:id**
  - Description: Remove an event by its ID.

## License

This project is licensed under the MIT License.