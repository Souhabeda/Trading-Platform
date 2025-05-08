// app\api\create-checkout-session\route.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    
    const { amount, pay, receive, selectedPair, price } = body;

    if (!amount || isNaN(amount)) {
      return new Response(JSON.stringify({ error: "Montant invalide" }), { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_DOMAIN;

    // Construction de l'URL de cancel avec les paramètres
    const cancelUrl = `${origin}/buy-crypto-confirm?pay=${encodeURIComponent(pay)}&receive=${encodeURIComponent(receive)}&selectedPair=${encodeURIComponent(selectedPair)}&price=${encodeURIComponent(price)}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Paiement',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/buy-crypto-details?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        cryptoSymbol: selectedPair,       
        cryptoAmount: receive.toString(), 
      },
    });

    return new Response(JSON.stringify({ id: session.id }), { status: 200 });

  } catch (err) {
    console.error("Erreur Stripe (API):", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
