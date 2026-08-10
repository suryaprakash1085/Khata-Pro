import express, { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();
router.get("/payment-test", (req, res) => {
  res.json({
    message: "Payment route working"
  });
});
// Initialize Razorpay with validation
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("Missing Razorpay credentials in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
// const razorpay = new Razorpay({
//   key_id: "rzp_test_TLzyiBcmji4cvD",
//   key_secret:  "n4KmYRF0sfL9ZIiIMIU661HN",
// });
// Create Order
router.post("/create-order", async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR" } = req.body;

    // Validate amount
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount. Please provide a valid positive number.",
      });
    }

    // Razorpay expects amount in paise (for INR) or smallest currency unit
    // If your frontend sends in rupees, multiply by 100
    const amountInPaise = Math.round(numericAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      key:  process.env.RAZORPAY_KEY_ID,
    });
    
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log(
  "KEY SECRET:",
  process.env.RAZORPAY_KEY_SECRET
    ? "Loaded"
    : "Missing"
);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
      details: error.error?.description || error.description || undefined,
    });
  }
});

// Verify Payment
router.post("/verify-payment", async (req: Request, res: Response) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: order_id, payment_id, signature",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    // .createHmac("sha256", "n4KmYRF0sfL9ZIiIMIU661HN")
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        order_id,
        payment_id,
      },
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Verification failed",
    });
  }
});

// Get Order Status
router.get(
  "/order-status/:orderId",
  async (req: Request, res: Response) => {
    try {
      // Fix: Type assertion to handle string | string[]
      const orderId = Array.isArray(req.params.orderId) 
        ? req.params.orderId[0] 
        : req.params.orderId;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "Order ID is required",
        });
      }

      const order = await razorpay.orders.fetch(orderId);

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      console.error("Error fetching order:", error);
      
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch order",
      });
    }
  }
);

// Get Orders (with pagination)
router.get("/orders", async (req: Request, res: Response) => {
  try {
    const count = req.query.count ? parseInt(req.query.count as string) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const orders = await razorpay.orders.all({
      count: Math.min(count, 100), // Razorpay limit
      skip,
    });

    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        count,
        skip,
      },
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch orders",
    });
  }
});

// Health check endpoint for payment routes
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    razorpay_configured: !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET,
  });
});

export default router;