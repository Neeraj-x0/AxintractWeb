import { useState } from 'react';
import { FORMData, Channel } from './types';
import { AxiosError } from 'axios';
import useAxios from '@/lib';

export const useEngagementForm = (engagementId?: string) => {
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(["whatsapp", "email"]);

  const [formData, setFormData] = useState<FORMData>({
    message: "",
    mediaType: "text",
    caption: "",
    file: null,
    emailSubject: "",
    emailTemplate: "",
    emailBodyType: "text",
    type: "mailgun",
    emailData: { title: "", note: "" },
    customHTML: "",
    templateId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = createPayload(formData, channels);
      await axios.post(`/api/engagements/send/${engagementId}`, payload, {
        headers: formData.file ? { "Content-Type": "multipart/form-data" } : {},
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to send message");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send message");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChannel = (channel: Channel) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  return {
    formData,
    setFormData,
    channels,
    toggleChannel,
    isLoading,
    error,
    success,
    handleSubmit,
  };
};

// Helper function to create payload
function createPayload(formData: FORMData, channels: Channel[]) {
  if (formData.file) {
    return createFormDataPayload(formData, channels);
  }
  return createJsonPayload(formData, channels);
}

function createFormDataPayload(formData: FORMData, channels: Channel[]) {
  const data = new FormData();
  data.append("file", formData.file!);
  data.append("fileName", formData.file!.name);
  data.append("mime", formData.file!.type);
  data.append("channels", channels.join(","));
  data.append("mediaType", formData.mediaType);
  data.append("type", formData.type);

  if (formData.mediaType !== "audio") {
    data.append("caption", formData.caption || "");
  }

  if (channels.includes("email")) {
    appendEmailData(data, formData);
  }
  return data;
}

interface JsonPayload {
  channels: Channel[];
  mediaType?: string;
  message?: string;
  emailSubject?: string;
  emailTemplate?: string;
  emailBodyType?: string;
  emailData?: unknown;
  customHTML?: string;
  templateId?: string;
  type?: string;
}

function createJsonPayload(formData: FORMData, channels: Channel[]): JsonPayload {
  const payload: JsonPayload = { channels };

  if (channels.includes("whatsapp") && formData.mediaType === "text") {
    payload.mediaType = formData.mediaType;
    payload.message = formData.message;
  }

  if (channels.includes("email")) {
    appendEmailFields(payload, formData);
  }

  return payload;
}

function appendEmailData(formData: FormData, data: FORMData) {
  formData.append("emailSubject", data.emailSubject);
  formData.append("emailTemplate", data.emailTemplate);
  formData.append("emailBodyType", data.emailBodyType);
  formData.append("emailData", JSON.stringify(data.emailData));
  formData.append("customHTML", data.customHTML);
  formData.append("templateId", data.templateId);
}

function appendEmailFields(payload: JsonPayload, formData: FORMData) {
  payload.emailSubject = formData.emailSubject;
  payload.emailTemplate = formData.emailTemplate;
  payload.emailBodyType = formData.emailBodyType;
  payload.emailData = formData.emailData;
  payload.customHTML = formData.customHTML;
  payload.templateId = formData.templateId;
  payload.type = formData.type;
}