import { useState, useCallback } from "react";
import useAxios from "@/lib";

export interface EmailData {
    title: string;
    note: string;
}

export interface ExtendedFormData extends FormData {
    poster: {
        title: string;
        note: string;
        icon?: File
        background?: File;
    };
    channels: { whatsapp: boolean; email: boolean };
    attachmentFile: File | null;
    generatePoster: boolean;
    message: string;
    caption: string;
    emailSubject: string;
    emailBodyType: "html" | "text";
    type: "mailgun" | "gmail";
    customHTML: string;
    templateId?: string;
    emailData: EmailData;
}

export interface EngagementFormResponse {
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
}

interface UseEngagementFormProps {
    engagementId?: string;
    onSuccess?: (response: EngagementFormResponse) => void;
    onError?: (error: { response?: { data?: { message?: string } } }) => void;
    setAttachmentFile?: (file: File | null) => void;
}

export const useEngagementForm = ({
    engagementId,
    onSuccess,
    onError,
    setAttachmentFile,
}: UseEngagementFormProps = {}) => {
    const axios = useAxios();

    const initialFormData = Object.assign(new FormData(), {
        channels: { whatsapp: false, email: false },
        attachmentFile: null,
        generatePoster: false,
        message: "",
        caption: "",
        emailSubject: "",
        emailBodyType: "text" as const,
        type: "mailgun" as const,
        customHTML: "",
        templateId: "",
        emailData: { title: "", note: "" },
        poster: { title: "", note: "" },
    }) as ExtendedFormData;

    const [formData, setFormData] = useState<ExtendedFormData>(initialFormData);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<{ success: boolean; message: string; data: Record<string, unknown> | undefined }>({ success: false, message: "", data: {} });

    // **Fix: Ensure channels persist**
    const toggleChannel = useCallback((channel: "whatsapp" | "email") => {
        setFormData((prev) => ({
            ...prev,
            channels: {
                ...prev.channels,
                [channel]: !prev.channels[channel]
            }
        }));
    }, []);




    // **Fix: Validate form with updated logic**
    const validateForm = useCallback((): boolean => {
        setError(null);
        const channels = Object.entries(formData.channels).filter(([, enabled]) => enabled).map(([channel]) => channel);

        if (channels.length === 0) {
            setError("Please select at least one channel");
            return false;
        }

        if (channels.includes("whatsapp")) {
            console.log(formData.attachmentFile, formData.generatePoster, formData.message);
            if (!formData.attachmentFile && !formData.generatePoster && !formData.message) {
                setError("Please enter a WhatsApp message or upload a file/generate a poster");
                return false;
            }
        }

        if (channels.includes("email")) {
            if (!formData.emailSubject) {
                setError("Please enter an email subject");
                return false;
            }
            if (!formData.customHTML) {
                setError("Please enter email content");
                return false;
            }
        }

        return true;
    }, [formData]);

    // **Fix: Handle file upload**
    const handleFileUpload = useCallback((file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            attachmentFile: file,
            generatePoster: false, // Disable poster generation if file is uploaded
        }));
    }, []);

    // **Fix: Ensure channels persist on submit**
    const appendPosterFields = (payload: ExtendedFormData) => {
        payload.append("generatePoster", "true");
        payload.append("poster", JSON.stringify({ title: formData.poster.title, note: formData.poster.note }));
        if (formData.poster.icon) {
            payload.append("icon", formData.poster.icon);
        }
        if (formData.poster.background) {
            payload.append("background", formData.poster.background);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Assume validateForm() is defined elsewhere
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);
        setSuccess({ success: false, message: "", data: {} });

        try {
            const formPayload = new FormData() as ExtendedFormData;

            const channels = formData.channels;
            formPayload.append("channels", JSON.stringify(Object.entries(channels).filter(([, enabled]) => enabled).map(([channel]) => channel)));

            if (channels.whatsapp) {
                if (formData.attachmentFile) {
                    formPayload.append("file", formData.attachmentFile);
                } else if (formData.generatePoster) {
                    appendPosterFields(formPayload);
                } else {
                    formPayload.append("message", formData.message);
                }
                formPayload.append("caption", formData.caption);
            }

            if (channels.email) {
                if (formData.attachmentFile) {
                    formPayload.append("file", formData.attachmentFile);
                } else if (formData.generatePoster) {
                    appendPosterFields(formPayload);
                }
                formPayload.append("emailSubject", formData.emailSubject);
                formPayload.append("emailBodyType", formData.emailBodyType);
                formPayload.append("emailServiceType", formData.type);
                formPayload.append("customHTML", formData.customHTML);
                if (formData.templateId) {
                    formPayload.append("templateId", formData.templateId);
                }
                if (formData.emailBodyType === "html") {
                    formPayload.append("emailData", JSON.stringify(formData.emailData));
                }
            }

            if (engagementId) {
                formPayload.append("engagementId", engagementId);
            }

            const response = await axios.post<EngagementFormResponse>(
                `/api/engagements/${engagementId}/send`,
                formPayload,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setSuccess({ success: true, message: response.data.message, data: response.data.data });
            onSuccess?.(response.data);
            setTimeout(() => setSuccess({ success: false, message: "", data: {} }), 2000);

            // Preserve channels on reset while clearing other fields.
            setFormData((prev) => ({
                ...prev,
                message: "",
                caption: "",
                attachmentFile: null,
                generatePoster: false,
                customHTML: "",
                emailSubject: "",
            }));
            setAttachmentFile?.(null);
        } catch (err) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setError(errorObj.response?.data?.message || "Failed to send message");
            onError?.(errorObj);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        channels: formData.channels,
        toggleChannel,
        handleFileUpload,
        isLoading,
        error,
        success,
        handleSubmit,
    };
};
