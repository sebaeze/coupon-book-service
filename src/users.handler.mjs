const mysql = require('mysql2/promise');

// Replace with your RDS database credentials
const dbConfig = {
  host: 'your-rds-endpoint',
  user: 'your-db-user',
  password: 'your-db-password',
  database: 'your-db-name',
};

exports.handler = async (event) => {
  const path = event.path; // e.g., "/users/{userId}/coupons"
  const method = event.httpMethod; // e.g., "GET"
  const pathParameters = event.pathParameters; // For endpoints with path parameters

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    if (path.startsWith('/users/') && method === 'GET') {
      // Get a user's assigned coupon codes
      const userId = pathParameters.userId;
      const [rows] = await connection.execute(
        `SELECT c.code 
        FROM Coupons c
        JOIN UserCouponAssignments uca ON c.couponId = uca.couponId
        WHERE uca.userId =?`,
        [userId]
      );
      const codes = rows.map((row) => row.code);
      return {
        statusCode: 200,
        body: JSON.stringify(codes),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not found' }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  } finally {
    if (connection) {
      connection.end();
    }
  }
};