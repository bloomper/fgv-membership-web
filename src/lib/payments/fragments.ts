import { graphql } from "@/gql";

/** A payment request as the payer and the treasurer see it. */
export const PaymentRequestFields = graphql(`
    fragment PaymentRequestFields on PaymentRequest {
        id reference amount paid status createdAt reportedAt paidBy spexareName
        family familyNote familyIncomplete
        memberships { id year lifetime status spexareId }
        payee { swishNumber bankgiro bankAccount name }
    }
`);

export const FeeLevelFields = graphql(`
    fragment FeeLevelFields on FeeLevel {
        id year kind lifetime nameSv nameEn amount retired
    }
`);
