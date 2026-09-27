import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";

export async function POST(req: NextRequest) {
    try {
        const webhookSecret = process.env.DODOPAYMENT_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error("[DodoPayment Webhook Error] DODOPAYMENT_WEBHOOK_SECRET is missing in environment variables.");
            return NextResponse.json(
                { error: "Webhook secret is not configured" },
                { status: 500 }
            );
        }

        const rawBody = await req.text();

        const webhookHeaders = {
            "webhook-id": req.headers.get("webhook-id") || "",
            "webhook-signature": req.headers.get("webhook-signature") || "",
            "webhook-timestamp": req.headers.get("webhook-timestamp") || "",
        };

        const wh = new Webhook(webhookSecret);

        let eventPayload: any;
        try {
            eventPayload = wh.verify(rawBody, webhookHeaders);
        } catch (err: any) {
            console.error("[DodoPayment Webhook Error] Signature verification failed:", err?.message || err);
            return NextResponse.json(
                { error: "Invalid webhook signature", details: err?.message },
                { status: 400 }
            );
        }

        const eventType = eventPayload?.type || eventPayload?.event || "unknown";
        // console.log(`[DodoPayment Webhook] Successfully verified event type: ${eventType}`);

        switch (eventType) {
            case "payment.succeeded":
            case "payment_succeeded":
                // console.log("[DodoPayment Webhook] Payment succeeded:", {
                //     paymentId: eventPayload.data?.payment_id,
                //     customer: eventPayload.data?.customer,
                //     amount: eventPayload.data?.amount,
                // });
                break;

            case "subscription.active":
            case "subscription_active":
            case "subscription.created":
                // console.log("[DodoPayment Webhook] Subscription active/created:", {
                //     subscriptionId: eventPayload.data?.subscription_id,
                //     customer: eventPayload.data?.customer,
                // });
                break;

            case "payment.failed":
            case "payment_failed":
                // console.warn("[DodoPayment Webhook] Payment failed:", eventPayload.data);
                break;

            default:
            // console.log(`[DodoPayment Webhook] Event ${eventType} received:`, eventPayload);
        }

        return NextResponse.json({
            received: true,
            type: eventType,
            message: "Webhook processed successfully",
        });
    } catch (error: any) {
        console.error("[DodoPayment Webhook Error] Internal error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
