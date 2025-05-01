import { stripe } from "@/stripe-server";

export async function POST(req: Request, res: Response) {
  const { amount, currency } = await req.json();
  console.log("Calling payment intent", amount);

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id,},
    { apiVersion: "2025-03-31.basil" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount ? Math.floor(amount * 100) : 10000,
    currency: currency ? currency : "usd",
    customer: customer.id,
    // automatic_payment_methods: {
    //   enabled: true,
    // },
    payment_method_types: ["card"],
  });

  console.log("Payment intent created", paymentIntent);

  return Response.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
}