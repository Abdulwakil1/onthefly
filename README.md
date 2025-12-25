# WEB103 Lab 9 – On The Fly ✈️

# web103_unit6_lab

Submitted by: **Abdul Wakil Najibi**

About this web app: **On The Fly is a full-stack travel planning web application that allows authenticated users to create trips, manage destinations and activities, and invite other users to collaborate on trips. The app connects a React frontend with an Express and PostgreSQL backend, demonstrating full CRUD functionality, relational database design, and protected user-based interactions through a clean and responsive interface.**

Time spent: **Approximately 35–45 hours**

---

## Required Features

The following **required** functionality is completed:

- [x] **The app uses a React frontend with an Express backend**
- [x] **The app is connected to a PostgreSQL database with properly structured relational tables**
- [x] **Users can create, read, update, and delete trips**
- [x] **Users can add destinations to trips**
- [x] **Users can add activities associated with trips**
- [x] **Users can add other users (travelers) to trips**
- [x] **Trip deletion correctly removes related records to maintain database integrity**
- [x] **RESTful API routes are implemented and consumed by the frontend**
- [x] **Authenticated user access with protected routes**
- [x] **The app runs successfully in a local development environment**

---

The following **optional** features are implemented:

- [x] **User avatar display** in the header
- [x] **Dropdown menu** for edit and delete trip actions
- [x] **Confirmation modal** before deleting a trip
- [x] **Conditional rendering** based on authentication state
- [x] **Responsive layout** for desktop and mobile screens

---

The following **additional** features are implemented:

- [x] **Modular backend architecture** with separated routes and controllers
- [x] **Environment variable configuration** for backend setup
- [x] **Foreign key constraints** to enforce relational integrity
- [x] **Join tables** for many-to-many relationships (users ↔ trips, trips ↔ destinations)
- [x] **Automatic cleanup of related records** when deleting trips
- [x] **Centralized API usage** passed through component props
- [x] **Protected frontend routes** to prevent unauthorized access
- [x] **Clear separation** between pages and reusable components
- [x] **Simple, clean UI** focused on usability and clarity
- [x] **GitHub OAuth authentication** implemented for user login and session-based access control

---

## Video Walkthrough

Here’s a walkthrough of implemented required features:

## Demo

![App Demo](./docs/demo.gif)

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with … Add GIF tool here  
(Examples: [Kap](https://getkap.co/) for macOS, [ScreenToGif](https://www.screentogif.com/) for Windows, [peek](https://github.com/phw/peek) for Linux)

---

## Notes

Some challenges included:

- Debugging **foreign key constraint errors** when deleting trips.

- Ensuring **related records** (destinations, activities, users) were removed correctly.

- Coordinating **frontend API calls** with backend route structure.

- Managing **authentication state** across protected routes.

- Avoiding breaking changes while refactoring API paths.

- Maintaining a **stable working version** before preparing for deployment.

- Structuring the backend for **clarity, scalability, and maintainability**.

---

## License

Copyright 2025 **Abdul Wakil Najibi**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
