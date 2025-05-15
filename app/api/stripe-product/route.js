// app\api\stripe-product\route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id');

  if (!session_id) {
    return new Response(JSON.stringify({ error: 'Missing session_id' }), { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session.payment_intent) {
      return new Response(JSON.stringify({ error: 'No payment intent found for session' }), { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    const cryptoSymbol = session.metadata?.cryptoSymbol || 'N/A';
    const cryptoAmount = session.metadata?.cryptoAmount || '0';

    return new Response(JSON.stringify({
      transactionId: paymentIntent.id,
      fiatAmount: (session.amount_total / 100).toFixed(2),
      fiatCurrency: session.currency.toUpperCase(),
      cryptoSymbol,
      cryptoAmount,
      paymentMethod: paymentIntent.payment_method_types?.[0] || 'Unknown',
      created: paymentIntent.created,
    }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
