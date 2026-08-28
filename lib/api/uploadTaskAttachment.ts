export interface UploadedAttachment {
    url: string;
    name: string;
}

export async function uploadTaskAttachment(file: File): Promise<UploadedAttachment> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/teacher/courses/tasks/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? "Upload failed");

    return { url: data.url, name: data.name ?? file.name };
}