# coupon-book-service
This repository contains the architecture and API definition for a coupon management service. Features include:

* Coupon book creation and management.
* User assignment and tracking of coupon usage.
* Atomic redemption operations with temporary locking to prevent double redemption.
* API-driven coupon redemption.
* Flexible coupon code generation based on patterns.
* Bulk upload of pre-generated coupon code lists.
* High-level architecture diagrams and API specifications.

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