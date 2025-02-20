import { useState, useCallback } from "react";
import useAxios from "@/lib";

export interface EmailData {
    title: string;
    note: string;
}

export interface ExtendedFormData extends FormData {
    description: string | number | readonly string[] | undefined;
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
    title: string;
    frequency: string;
    scheduledAt: string;
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





    // **Fix: Handle file upload**
    const handleFileUpload = useCallback((file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            attachmentFile: file,
            generatePoster: false, // Disable poster generation if file is uploaded
        }));
        if (setAttachmentFile) {
            setAttachmentFile(file);
        }
    }, [setAttachmentFile]);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;
        setError(null);

        const payload = new FormData();
        console.log(formData);

        if (formData.poster) {
            payload.append("poster", JSON.stringify({
                title: formData.poster.title,
                note: formData.poster.note,
            }));
            if (!formData.poster.icon) return setError("Icon is required");
            payload.append("icon", formData.poster.icon);
            if (formData.poster.background) {
                payload.append("background", formData.poster.background);
            }

        }
        if (!formData.description) return setError("Description is required");
        payload.append("description", formData.description.toString());
        if (!formData.title) return setError("Title is required");
        payload.append("title", formData.title);
        if (!formData.frequency) return setError("Frequency is required");
        payload.append("frequency", formData.frequency);
        if (!formData.scheduledAt) return setError("Scheduled At is required");
        payload.append("scheduledAt", formData.scheduledAt);

        if (formData.attachmentFile) {
            payload.append("file", formData.attachmentFile);
        }

        if (formData.channels.whatsapp) {
            if (!formData.attachmentFile && !formData.generatePoster && !formData.message) return setError("Message is required when there's no attachment or poster");
            payload.append("message", formData.message);
            if ((formData.attachmentFile || formData.generatePoster) && formData.caption) {
                payload.append("caption", formData.caption);
                payload.delete("message");
            }
        }
        if (formData.channels.email) {
            if (formData.emailBodyType === "html") {
                if (!formData.emailData.title || !formData.emailData.note) return setError("Title and note are required");
                payload.append("emailTitle", formData.emailData.title);
                payload.append("emailNote", formData.emailData.note);
            }
            payload.append("customHTML", formData.customHTML);
            payload.append("emailBodyType", formData.emailBodyType);
            payload.append("emailSubject", formData.emailSubject);
        }

        payload.append("category", formData.channels.whatsapp && formData.channels.email ? "both" : formData.channels.whatsapp ? "whatsapp" : "email");
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(`/api/reminder/${engagementId}`, payload, config).then((response) => {
            setSuccess(response.data);
            if (onSuccess) onSuccess(response.data);
        }).catch((err) => {
            setError(err.response?.data?.message || "An error occurred");
            setIsLoading(false);
            if (onError) onError(err);
        }).finally(() => {
            setIsLoading(false);
        });
        return payload;
    }, [axios, engagementId, formData, isLoading, onError, onSuccess]);


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
