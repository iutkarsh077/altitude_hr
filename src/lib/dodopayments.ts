import DodoPayments from "dodopayments";

export const getDodoPaymentsClient = (mode: "test_mode" | "live_mode" = "test_mode") => {
    const apiKey =
        process.env.DODO_PAYMENTS_API_KEY ||
        process.env.DODOPAYMENT_API_KEY ||
        process.env.DODOPAYEMENT_API_KEY ||
        "";

    const environment =
        (process.env.DODOPAYMENT_ENVIRONMENT as "test_mode" | "live_mode") ||
        (process.env.DODO_PAYMENTS_MODE as "test_mode" | "live_mode") ||
        mode;

    return new DodoPayments({
        bearerToken: apiKey,
        environment: environment,
    });
};

export const dodoPayments = getDodoPaymentsClient("test_mode");
