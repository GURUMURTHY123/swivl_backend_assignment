# Recipe Sharing Platform API

## Setup

1. Install dependencies: `npm install`

## API Documentation

### User Endpoints

- **POST /user**

  - Register a new user.
  - Request Body: `{ "firstName" : "Raghu Ram", "lastName" : "Kasula", "phoneNumber" : "+919945643281", "emailAddress" : "raghuram@gmail.com" }`
  - Response: `{ "message": "Data saved successfully" }`

### Validate User

    - First Name and Last Name consists of alphabets only
    - phone Number consists of digits and starts with "+" and the length should be in between 12 and 14
    - Email address should be valid. For example "abcd@gmail.com"
