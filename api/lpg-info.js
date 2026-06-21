export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get mobile number from query parameter or request body
  let mobile_no;
  
  if (req.method === 'GET') {
    mobile_no = req.query.mobile_no;
  } else if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      mobile_no = body?.mobile_no;
    } catch (e) {
      return res.status(400).json({
        error: "Invalid JSON in request body",
        message: "Please provide valid JSON"
      });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!mobile_no) {
    return res.status(400).json({
      error: "Mobile number is required",
      message: "Please provide mobile_no parameter"
    });
  }

  // API endpoint
  const url = 'https://apigw.umangapp.in/ioclApi/ws1/consumervalidate';

  // Headers
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/json',
    'subsid': '0',
    'sec-ch-ua-platform': '"Android"',
    'deptid': '186',
    'tenantid': '',
    'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    'formtrkr': '0',
    'x-api-key': 'VKE9PnbY5k1ZYapR5PyYQ33I26sXTX569Ed7eqyg',
    'sec-ch-ua-mobile': '?1',
    'srvid': '1123',
    'subsid2': '0',
    'origin': 'https://web.umang.gov.in',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://web.umang.gov.in/',
    'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
    'priority': 'u=1, i'
  };

  // Cookies
  const cookieString = 'AWSALB=lE0YK+DgRyMb35tTzJ0MdnqLQ208FzgWeZ9OzeMisqYuOTJxRaFV8PCn0Vgj4mneJV426VaFo1456Kfjp6ysCpS1xihWZCDi3ioPQxHM+qemZYCMoczbIMjL8Cjz; AWSALBCORS=lE0YK+DgRyMb35tTzJ0MdnqLQ208FzgWeZ9OzeMisqYuOTJxRaFV8PCn0Vgj4mneJV426VaFo1456Kfjp6ysCpS1xihWZCDi3ioPQxHM+qemZYCMoczbIMjL8Cjz';

  // Request body
  const payload = {
    "tkn": "iad1cc7d81-1533-44b0-9967-35599386d3df/2",
    "trkr": "213132",
    "lang": "en",
    "lat": "21",
    "lon": "90",
    "lac": "90",
    "usag": "90",
    "apitrkr": "123234",
    "usrid": "09",
    "mode": "web",
    "pltfrm": "android",
    "did": "123234",
    "deptid": "186",
    "formtrkr": "0",
    "srvid": "1123",
    "subsid": "0",
    "subsid2": "0",
    "trackingId": "",
    "source": "UMANG",
    "mobile": mobile_no,
    "consumerId": "",
    "partnerCode": "",
    "consumerNumber": ""
  };

  try {
    // Make the POST request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Cookie': cookieString
      },
      body: JSON.stringify(payload)
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Non-JSON response received",
        raw_response: text
      });
    }

    // Return the response
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: "Request failed",
      message: error.message
    });
  }
}
