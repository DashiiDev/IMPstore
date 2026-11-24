import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { amount, boostingDetails } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: boostingDetails.serviceName,
              description: boostingDetails.description,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/boosting/${boostingDetails.gameId}`,
      metadata: {
        gameId: boostingDetails.gameId,
        currentRank: boostingDetails.currentRank,
        desiredRank: boostingDetails.desiredRank,
        mode: boostingDetails.mode,
        extraService: boostingDetails.extraService || "none",
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
