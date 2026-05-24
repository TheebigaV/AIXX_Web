import {api} from "./api";
import { ContactFormData } from "@/types/contact";

export const storeContact = (data: ContactFormData) =>
    api.post("api/submit-contact-form", data);
