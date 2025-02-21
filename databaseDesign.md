| Table                 | Field                  | Description                                                      | Relationship               | Data Type    |
|-----------------------|------------------------|------------------------------------------------------------------|----------------------------|--------------|
| CouponBooks           | couponBookId           | Unique identifier for the coupon book                            | Primary Key                | INT          |
| CouponBooks           | name                   | Name of the coupon book                                          |                            | VARCHAR(255) |
| CouponBooks           | description            | Description of the coupon book                                   |                            | TEXT         |
| CouponBooks           | maxRedemptionsPerUser  | Maximum number of times a user can redeem coupons from this book |                            | INT          |
| CouponBooks           | maxCodesPerUser        | Maximum number of coupons from this book a user can be assigned  |                            | INT          |
| CouponBooks           | codePattern            | Pattern used for generating coupon codes (if applicable)         |                            | VARCHAR(255) |
| CouponBooks           | createdAt              | Timestamp of when the coupon book was created                    |                            | TIMESTAMP    |
| CouponBooks           | updatedAt              | Timestamp of when the coupon book was last updated               |                            | TIMESTAMP    |
| Coupons               | couponId               | Unique identifier for the coupon                                 | Primary Key                | INT          |
| Coupons               | couponBookId           | Coupon book this coupon belongs to                               | Foreign Key to CouponBooks | INT          |
| Coupons               | code                   | Unique code of the coupon within the book                        |                            | VARCHAR(255) |
| Coupons               | status                 | Status of the coupon (e.g. 'active'; 'inactive'; 'redeemed')     |                            | VARCHAR(255) |
| Coupons               | redeemedBy             | User ID who redeemed this coupon                                 | Foreign Key to Users       | INT          |
| Coupons               | assignedTo             | User ID to whom this coupon is assigned                          | Foreign Key to Users       | INT          |
| Coupons               | redeemedAt             | Timestamp of when the coupon was redeemed                        |                            | TIMESTAMP    |
| Users                 | userId                 | Unique identifier of the user                                    | Primary Key                | INT          |
| UserCouponAssignments | userCouponAssignmentId | Unique identifier for the assignment                             | Primary Key                | INT          |
| UserCouponAssignments | userId                 | User who is assigned the coupon                                  | Foreign Key to Users       | INT          |
| UserCouponAssignments | couponId               | Coupon that is assigned                                          | Foreign Key to Coupons     | INT          |