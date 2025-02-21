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
  const requestBody = JSON.parse(event.body);
  const pathParameters = event.pathParameters;

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    switch (path) {
      case '/coupons':
        if (method === 'POST') {
          // Create a new coupon book
          const { name, description, maxRedemptionsPerUser, maxCodesPerUser, codePattern } = requestBody;
          const [result] = await connection.execute(
            'INSERT INTO CouponBooks (name, description, maxRedemptionsPerUser, maxCodesPerUser, codePattern, createdAt, updatedAt) VALUES (?,?,?,?,?, NOW(), NOW())',
            [name, description, maxRedemptionsPerUser, maxCodesPerUser, codePattern]
          );
          return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Coupon book created successfully', couponBookId: result.insertId }),
          };
        }
        break;

      case '/coupons/codes':
        if (method === 'POST') {
          // Upload a list of codes to a coupon book
          const { couponBookId } = pathParameters;
          const codes = requestBody;
          const values = codes.map((code) => [couponBookId, code]);
          await connection.query('INSERT INTO Coupons (couponBookId, code) VALUES?', [values]);
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Codes uploaded successfully' }),
          };
        }
        break;

      case '/coupons/assign':
        if (method === 'POST') {
          // Assign a random coupon code to a user
          const { userId, couponBookId } = requestBody;
          // Logic to find a random, unassigned coupon from the specified coupon book
          //... (Implementation depends on your specific requirements)
          // Update the `assignedTo` field in the Coupons table
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Coupon assigned successfully', assignedCode: '...' }),
          };
        }
        break;

      case '/coupons/assign/{code}':
        if (method === 'POST') {
          // Assign a specific coupon code to a user
          const { code } = pathParameters;
          const { userId } = requestBody;
          // Update the `assignedTo` field in the Coupons table for the given code
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Coupon assigned successfully' }),
          };
        }
        break;

      case '/coupons/lock/{code}':
        if (method === 'POST') {
          // Lock a coupon for redemption
          const { code } = pathParameters;
          // Update the coupon status to 'locked' (or similar) in the Coupons table
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Coupon locked successfully' }),
          };
        }
        break;

      case '/coupons/redeem/{code}':
        if (method === 'POST') {
          // Redeem a coupon
          const { code } = pathParameters;
          // Update the coupon status to 'redeemed' and set `redeemedAt` in the Coupons table
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Coupon redeemed successfully' }),
          };
        }
        break;

      default:
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