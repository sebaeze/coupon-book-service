# Coupon Book Service
This repository contains the architecture and API definition for a coupon management service. Features include:

* Coupon book creation and management.
* User assignment and tracking of coupon usage.
* Atomic redemption operations with temporary locking to prevent double redemption.
* API-driven coupon redemption.
* Flexible coupon code generation based on patterns.
* Bulk upload of pre-generated coupon code lists.
* High-level architecture diagrams and API specifications.

## Functional Requirements

| Functional Requirements                 | Description                                                                                                                                                                                            |
|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Create Coupon Book                      | The system shall allow businesses to create new coupon books.                                                                                                                                          |
| Upload Coupon Codes                     | The system shall allow uploading a list of codes to a given coupon book.                                                                                                                               |
| Generate Coupon Codes                   | The system shall allow generating coupon codes following a pattern up to a specified total amount.                                                                                                     |
| Assign Coupon to User                   | The system shall allow assigning a coupon code to a user.                                                                                                                                              |
| Redeem Coupon                           | The system shall allow users to redeem coupons.                                                                                                                                                        |
| Lock Coupon                             | The system shall allow temporarily locking a coupon during redemption attempts.                                                                                                                        |
| Set Coupon Book Parameters              | The system shall allow setting parameters at the coupon book level, such as whether codes can be redeemed more than once per user and the maximum number of codes per coupon book assigned per member. |
| Get User's Assigned Coupons             | The system shall allow retrieving a list of coupon codes assigned to a user.                                                                                                                           |
| Redeem Coupon Multiple Times (Optional) | The system shall allow redeeming a coupon code multiple times per user based on a coupon book parameter.                                                                                               |
| Limit Codes per User (Optional)         | The system shall allow limiting the number of codes per coupon book assigned to a user based on a coupon book parameter.                                                                               |

## Non Functional Requirements

| Non-Functional Requirements | Description                                                                                                                        |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| Security                    | The system shall ensure secure access to coupon data and prevent unauthorized access.                                              |
| Performance                 | The system shall handle a high volume of requests efficiently.                                                                     |
| Concurrency                 | The system shall manage concurrent operations, especially coupon redemption, to prevent race conditions and data integrity issues. |
| Scalability                 | The system shall be able to scale to accommodate increasing numbers of users and coupons.                                          |
| Availability                | The system shall be highly available to ensure uninterrupted service.                                                              |
| Usability                   | The API shall be easy to use and understand for developers.                                                                        |
| Maintainability             | The system shall be easy to maintain and update.                                                                                   |
| Reliability                 | The system shall be reliable and consistently perform its functions correctly.                                                     |
| Deployability               | The system shall be easily deployable to a cloud platform like AWS or GCP.                                                         |
| Data Integrity              | The system shall ensure data integrity and consistency.                                                                            |


## Architectural Decisions

1. API Gateway
- Handles API requests and routes them to appropriate Lambda functions.
- Provides authentication and authorization using API keys or JWT tokens.
- Manages API documentation using Swagger/OpenAPI.

2. Lambda
- Serverless compute for implementing API logic.
- Separate Lambda functions for different API endpoints (e.g., create coupon, assign coupon, redeem coupon).
- Lambda functions written in Node.js using Express.js framework.

3. DynamoDB
- NoSQL database for storing coupon books, coupons, and user assignments.
- Tables for coupon books, coupons, and user-coupon assignments.
- DynamoDB Streams to trigger Lambda functions on data changes (e.g., coupon redemption).

4. Node.js and Express.js
- Node.js runtime for Lambda functions.
- Express.js framework for building RESTful APIs within Lambda functions.
- Middleware for request validation, error handling, and logging.

5. Swagger/OpenAPI
- Generate API documentation for developers.
- Swagger UI for testing API endpoints.

6. Additional Considerations
- Concurrency: Use optimistic locking in DynamoDB to handle concurrent requests for coupon redemption.
- Security: Implement input validation, output encoding, and rate limiting to prevent abuse.
- Performance: Optimize DynamoDB queries and Lambda function execution time.
- Scalability: Leverage AWS auto-scaling for Lambda functions and DynamoDB tables.
- Example Endpoint Implementation
POST /coupons/redeem/{code}

* Lambda function triggered by API Gateway.
* Retrieve coupon and user assignment from DynamoDB.
* Check if coupon is valid and not already redeemed.
* Use optimistic locking to update coupon status to 'redeemed'.
* Return success or error response.