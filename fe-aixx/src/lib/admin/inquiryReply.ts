import { api } from "../api";


export const sendInquiryReply = (inquiryId: string | null, replyMessage: string) =>
    api.post(`/api/admin/inquiries/${inquiryId}/reply`, { reply_message: replyMessage });
