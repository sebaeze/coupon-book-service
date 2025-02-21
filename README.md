# Coupon Book Service
This repository contains the architecture and API definition for a coupon management service. 

## High Level Architectural Solution

![alt text](./image/coupon-book-service-high-level-architecture.drawio.png)


## High Level Database Design

![alt text](./image/database-design.drawio.png)

[Extra information about the database design](databaseDesign.md)

## Pseudocode

The basic code using node.js can be seen in the folder 'src'
- [coupons](./src/coupons.handler.mjs)
- [users](./src/users.handler.mjs)

## Deployment Strategy

The deployment strategy for this solution leverages AWS Lambda and API Gateway to create a serverless architecture, maximizing scalability and cost-efficiency. Here's a high-level overview:

### Core Components:

- Lambda Functions: Each endpoint will be handled by a separate Lambda function, promoting modularity and independent scaling.
- API Gateway: API Gateway acts as the entry point, routing requests to the appropriate Lambda function based on the HTTP method and path.
- ElastiCache (Redis): A Redis cluster will be used to cache frequently accessed data, improving performance and reducing database load.

### Deployment Process:

- Infrastructure as Code: The entire infrastructure, including Lambda functions, API Gateway, and ElastiCache, will be defined using a SAM (Serverless Application Model) template. This template uses CloudFormation for provisioning and managing resources in a declarative manner.
- Automated Deployment: The SAM template will be deployed using the AWS CLI or AWS Management Console, automating the creation and configuration of all resources.
- Endpoint Configuration: API Gateway will be configured to handle routing, authorization, and request/response transformations.
- Caching: The /users/{userId}/coupons endpoint will utilize Redis for caching, with appropriate cache invalidation strategies to ensure data consistency.

### Benefits:

- Serverless Simplicity: No server management is needed, reducing operational overhead.
- Scalability and Availability: Lambda automatically scales to handle varying traffic, ensuring high availability.
- Cost-Effectiveness: Pay only for actual usage, optimizing resource costs.
- Increased Agility: Faster deployments and easier updates due to the modular nature of the architecture.
- Improved Performance: Caching enhances response times and reduces database load. 

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

| Component       | Decision                                                                                                    |
|-----------------|-------------------------------------------------------------------------------------------------------------|
| API Gateway     | Handles API requests and routes them to appropriate Lambda functions.                                       |
| API Gateway     | Provides authentication and authorization using API keys or JWT tokens.                                     |
| API Gateway     | Manages API documentation using Swagger/OpenAPI.                                                            |
| Lambda          | Serverless compute for implementing API logic.                                                              |
| Lambda          | Separate Lambda functions for different API endpoints (e.g. create coupon; assign coupon; redeem coupon).   |
| Lambda          | Lambda functions written in Node.js.                                                                        |
| RDS             | Relational database for storing coupon books; coupons; and user assignments.                                |
| RDS             | Tables for coupon books; coupons; users; and user-coupon assignments.                                       |
| Node.js         | Node.js runtime for Lambda functions.                                                                       |
| Swagger/OpenAPI | Define API endpoints; request/response models; and authentication schemes.                                  |
| Swagger/OpenAPI | Generate API documentation for developers.                                                                  |
| Swagger/OpenAPI | Swagger UI for testing API endpoints.                                                                       |
| Concurrency     | Use database transactions and row-level locking in RDS to handle concurrent requests for coupon redemption. |
| Security        | Implement input validation; output encoding; and rate limiting to prevent abuse.                            |
| Performance     | Optimize database queries and Lambda function execution time.                                               |
| Scalability     | Leverage AWS RDS features like read replicas and Aurora Serverless for scalability.                         |

## Additional Considerations
- Security: Implement input validation, output encoding, and rate limiting to prevent abuse.
- Performance: Optimize RDS by including read replicas in queries queries and Lambda function execution time.
- Scalability: Leverage AWS auto-scaling for Lambda functions.

## API Endpoints

The system exposes the following RESTful API endpoints:

| HTTP Method | Endpoint                | Description                                                                                                                                                                                 |
|-------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST        | /coupons                | Creates a new coupon book. The request body should include parameters like the coupon book name, validity period, maximum redemptions per user, and code generation pattern.                |
| POST        | /coupons/codes          | Uploads a list of codes to an existing coupon book. This is optional, as codes can also be generated automatically. The request body should include the coupon book ID and a list of codes. |
| POST        | /coupons/assign         | Assigns a new random coupon code to a user from the specified coupon book. The request body should include the user ID and the coupon book ID.                                              |
| POST        | /coupons/assign/{code}  | Assigns a specific coupon code to a user. The request body should include the user ID and the coupon code.                                                                                  |
| POST        | /coupons/lock/{code}    | Locks a coupon for redemption (temporary). This is typically used when a user initiates the redemption process to prevent other users from redeeming the same coupon.                       |
| POST        | /coupons/redeem/{code}  | Redeems a coupon (permanent). The request body may include information about the redemption context, such as the order ID or transaction details.                                           |
| GET         | /users/{userId}/coupons | Retrieves the user's assigned coupon codes, including their status (e.g., active, redeemed, expired).                                                                                       |

Note: The Swagger/OpenAPI specification can be seen in the following path --> [swagger-coupon-book-service.yaml](swagger-coupon-book-service.yaml)

## Detailed information about the endpoints

### /coupons

#### POST
##### Summary:

Create a new coupon book

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Coupon book created successfully |
| 400 | Invalid request body |
| 500 | Internal server error |

### /coupons/{couponBookId}/codes

#### POST
##### Summary:

Upload a list of codes to a coupon book

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| couponBookId | path | ID of the coupon book | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Codes uploaded successfully |
| 400 | Invalid request body or coupon book not found |
| 500 | Internal server error |

### /coupons/assign

#### POST
##### Summary:

Assign a random coupon code to a user

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Coupon assigned successfully |
| 400 | Invalid request body or no available coupons |
| 500 | Internal server error |

### /coupons/assign/{code}

#### POST
##### Summary:

Assign a specific coupon code to a user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| code | path | Coupon code to assign | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Coupon assigned successfully |
| 400 | Invalid request body or coupon not found |
| 500 | Internal server error |

### /coupons/lock/{code}

#### POST
##### Summary:

Lock a coupon for redemption

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| code | path | Coupon code to lock | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Coupon locked successfully |
| 400 | Invalid coupon code or coupon already locked |
| 500 | Internal server error |

### /coupons/redeem/{code}

#### POST
##### Summary:

Redeem a coupon

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| code | path | Coupon code to redeem | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Coupon redeemed successfully |
| 400 | Invalid coupon code or coupon already redeemed |
| 500 | Internal server error |

### /users/{userId}/coupons

#### GET
##### Summary:

Get a user's assigned coupon codes

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | path | ID of the user | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | List of assigned coupon codes |
| 400 | Invalid user ID |
| 500 | Internal server error |

## Reference architecture
- https://www.geeksforgeeks.org/design-coupon-and-voucher-management-system/