import { useState, useCallback, useMemo } from "react";
import useAxios from "@/lib";

// Separate interfaces for better type organization
interface Channels {
    whatsapp: boolean;
    email: boolean;
}

interface PosterData {
    title: string;
    note: string;
    icon?: File;
    background?: File;
}

interface EmailData {
    title: string;
    note: string;
}

// Consolidated form data interface
export interface FormDataState {
    description?: string;
    poster: PosterData;
    channels: Channels;
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

interface EngagementFormResponse {
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

// Extracted validation logic
const validateFormData = (formData: FormDataState): string | null => {
    if (!formData.title) return "Title is required";
    if (!formData.frequency) return "Frequency is required";
    if (!formData.scheduledAt) return "Scheduled At is required";
    console.log(formData.generatePoster);
    if (formData.generatePoster && !formData.poster.icon) return "Icon is required";
    if (formData.channels.whatsapp &&
        !formData.attachmentFile &&
        !formData.generatePoster &&
        !formData.message) {
        return "Message is required when there's no attachment or poster";
    }

    if (formData.channels.email &&
        formData.emailBodyType === "html" &&
        (!formData.emailData.title || !formData.emailData.note)) {
        return "Title and note are required";
    }

    return null;
};

// Extracted payload creation logic
const createFormPayload = (formData: FormDataState): FormData => {
    const payload = new FormData();

    if (formData.poster) {
        payload.append("poster", JSON.stringify({
            title: formData.poster.title,
            note: formData.poster.note,
        }));
        if (formData.poster.icon) payload.append("icon", formData.poster.icon);
        if (formData.poster.background) payload.append("background", formData.poster.background);
    }

    payload.append("description", formData.description?.toString() ?? "");
    payload.append("title", formData.title);
    payload.append("frequency", formData.frequency);
    payload.append("scheduledAt", formData.scheduledAt);

    if (formData.attachmentFile) {
        payload.append("file", formData.attachmentFile);
    }

    if (formData.channels.whatsapp) {
        if (formData.attachmentFile || formData.generatePoster) {
            if (formData.caption) payload.append("caption", formData.caption);
        } else {
            payload.append("message", formData.message);
        }
    }

    if (formData.channels.email) {
        if (formData.emailBodyType === "html") {
            payload.append("emailTitle", formData.emailData.title);
            payload.append("emailNote", formData.emailData.note);
        }
        payload.append("customHTML", formData.customHTML);
        payload.append("emailBodyType", formData.emailBodyType);
        payload.append("emailSubject", formData.emailSubject);
    }

    payload.append("category",
        formData.channels.whatsapp && formData.channels.email
            ? "both"
            : formData.channels.whatsapp
                ? "whatsapp"
                : "email"
    );

    return payload;
};

export const useEngagementForm = ({
    engagementId,
    onSuccess,
    onError,
    setAttachmentFile,
}: UseEngagementFormProps = {}) => {
    const axios = useAxios();

    const initialFormData: FormDataState = useMemo(() => ({
        channels: { whatsapp: false, email: false },
        attachmentFile: null,
        generatePoster: false,
        message: "",
        caption: "",
        emailSubject: "",
        emailBodyType: "text",
        type: "mailgun",
        customHTML: "",
        templateId: "",
        emailData: { title: "", note: "" },
        poster: { title: "", note: "" },
        title: "",
        frequency: "",
        scheduledAt: "",
    }), []);

    const [formData, setFormData] = useState<FormDataState>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<EngagementFormResponse>({
        success: false,
        message: "",
        data: {}
    });

    const toggleChannel = useCallback((channel: keyof Channels) => {
        setFormData(prev => ({
            ...prev,
            channels: {
                ...prev.channels,
                [channel]: !prev.channels[channel]
            }
        }));
    }, []);

    const handleFileUpload = useCallback((file: File | null) => {
        setFormData(prev => ({
            ...prev,
            attachmentFile: file,
            generatePoster: false,
        }));
        setAttachmentFile?.(file);
    }, [setAttachmentFile]);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        setError(null);
        setIsLoading(true);

        const validationError = validateFormData(formData);
        if (validationError) {
            setError(validationError);
            setIsLoading(false);
            return;
        }

        try {
            const payload = createFormPayload(formData);
            const response = await axios.post(
                `/api/reminder/${engagementId}`,
                payload,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setSuccess(response.data);
            onSuccess?.(response.data);
            // setFormData(initialFormData);
            // setAttachmentFile?.(null);
        } catch (err: Error | unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const errorMessage = error.response?.data?.message || "An error occurred";
            setError(errorMessage);
            setIsLoading(false);
            onError?.(error);
        } finally {
            setIsLoading(false);
        }
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