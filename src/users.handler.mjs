const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.ENDPOINT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

exports.handler = async (event) => {
  const path = event.path;
  const method = event.httpMethod;
  const pathParameters = event.pathParameters;

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