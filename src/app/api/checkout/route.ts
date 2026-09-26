import { NextRequest, NextResponse } from "next/server";
import { getDodoPaymentsClient } from "@/lib/dodopayments";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const productId = body.productId || process.env.DODOPAYMENT_PRODUCT_ID;

        if (!productId) {
            return NextResponse.json(
                { error: "DODOPAYMENT_PRODUCT_ID is missing in environment variables" },
                { status: 400 }
            );
        }

        const envMode: "test_mode" | "live_mode" =
            (process.env.DODOPAYMENT_ENVIRONMENT as any) || "test_mode";

        console.log(`[DodoPayments Checkout] Creating test checkout session in "${envMode}" for product "${productId}"...`);

        const client = getDodoPaymentsClient(envMode);

        const session = await client.checkoutSessions.create({
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                },
            ],
            return_url: `${req.nextUrl.origin}/chat?payment=success`,
        });

        const checkoutUrl = session.checkout_url || (session as any).url;

        if (!checkoutUrl) {
            return NextResponse.json(
                { error: "Failed to generate checkout URL from DodoPayments" },
                { status: 500 }
            );
        }

        console.log("[DodoPayments Checkout] Generated checkout URL:", checkoutUrl);

        return NextResponse.json({
            url: checkoutUrl,
            sessionId: session.session_id || (session as any).id,
        });
    } catch (error: any) {
        console.error("[DodoPayments Checkout Error]:", error);

        return NextResponse.json(
            {
                error: error?.message || "Failed to create checkout session",
                details: error?.error || error?.body,
            },
            { status: error?.status || 500 }
        );
    }
}
