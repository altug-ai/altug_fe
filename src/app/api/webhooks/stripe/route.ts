import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
type METADATA = {
  profileId: string;
  planId: string;
  customerId: string;
  jwt: string;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const sig = headers().get('stripe-signature') as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  const eventType = event.type;
  if (
    eventType !== 'checkout.session.completed' &&
    eventType !== 'checkout.session.async_payment_succeeded'
  )
    return new Response('Server Error', {
      status: 500,
    });
  const dataa = event.data.object;
  const metadata = dataa.metadata as METADATA;
  const profileId = metadata.profileId;
  const customerId = metadata.customerId;
  const planId = metadata.planId;
  const jwt = metadata.jwt;
  const created = dataa.created;
  const currency = dataa.currency;
  const customerDetails = dataa.customer_details;
  const amount = dataa.amount_total;

  const data = {
    paid: true,
    messagesLeft: 3,
    planId: planId,
    stripeCustomerId: customerId,
  };

  try {
    // database update here
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${profileId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ data }),
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to update user ${profileId}:`,
        response.statusText,
        response
      );
      return new Response(`Failed to update user ${profileId}`, {
        status: response.status,
      });
    }

    // Read the response body as JSON
    const responseData = await response.json();
    console.log(`User ${profileId} updated successfully:`, responseData);

    return new Response('Subscription added', {
      status: 200,
    });
  } catch (error) {
    return new Response('Server error', {
      status: 500,
    });
  }
}

// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { stripe } from '@/config/stripe';
// import { buffer } from 'node:stream/consumers';

// export async function POST(req: NextRequest) {
//   if (req.method !== 'POST') {
//     return new NextResponse('Method Not Allowed', { status: 405 });
//   }

//   const body = req.body;
//   const rawBody = await buffer(body as any);
//   const signature = req.headers.get('stripe-signature');

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       rawBody,
//       signature as string,
//       process.env.STRIPE_WEBHOOK_SECRET as string
//     );
//   } catch (error: any) {
//     console.error('Webhook Error:', error.message);
//     return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
//   }

//   // Handle webhook event based on type
//   switch (event.type) {
//     case 'checkout.session.completed':
//       return handleCheckoutSessionCompleted(event);
//     // Add more cases for other webhook event types as needed
//     default:
//       return new NextResponse('Unhandled event type', { status: 400 });
//   }
// }

// async function handleCheckoutSessionCompleted(event: Stripe.Event) {
//   const session = event.data.object as Stripe.Checkout.Session;

//   if (!session?.metadata?.profileId) {
//     return new NextResponse(null, { status: 200 });
//   }

//   const profileId = parseInt(session.metadata.profileId);
//   const planId = session.metadata.planId;
//   const customerId = session.metadata.customerId;

//   const stripeSubscriptionId = session.subscription as string;

//   try {
//     const subscription = await stripe.subscriptions.retrieve(
//       stripeSubscriptionId
//     );
//     const currentPeriodEndTimestamp = subscription.current_period_end;
//     const currentPeriodEndDate = new Date(currentPeriodEndTimestamp * 1000); // Convert seconds to milliseconds

//     const stripePriceId = subscription.items.data[0].price.id;

//     const jwt = session.metadata.jwt;

//     if (jwt) {
//       const data = {
//         tier: 'premium',
//         messagesLeft: 3,
//         planId: planId,
//         stripeCustomerId: customerId,
//         stripePriceId: stripePriceId,
//         stripeCurrentPeriodEnd: currentPeriodEndDate.toISOString(),
//         stripeSubscriptionId,
//       };
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${jwt}`,
//           },
//           body: JSON.stringify({ data }),
//         }
//       );

//       if (!response.ok) {
//         console.error(
//           `Failed to update user ${profileId}:`,
//           response.statusText,
//           response
//         );
//         return new NextResponse(`Failed to update user ${profileId}`, {
//           status: response.status,
//         });
//       }

//       // Read the response body as JSON
//       const responseData = await response.json();
//       console.log(`User ${profileId} updated successfully:`, responseData);
//     }
//   } catch (error) {
//     console.error('Error handling checkout session completed event:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }

//   return new NextResponse(null, { status: 200 });
// }
