import {api} from "./api";
import { InquiryFormData } from "@/types/inquiry";

export const storeInquiry = (data: InquiryFormData) =>
    api.post("api/inquiries", data);