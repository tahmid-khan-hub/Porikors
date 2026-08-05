import { AllowedFileType } from "@/types/task";

export const fileTypeMap: Record<
    Exclude<AllowedFileType, "any">,
    { extensions: string[]; mimetypes: string[] }
> = {
    pdf: {
        extensions: [".pdf"],
        mimetypes: ["application/pdf"],
    },
    doc: {
        extensions: [".doc"],
        mimetypes: ["application/msword"],
    },
    docx: {
        extensions: [".docx"],
        mimetypes: [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
    },
    zip: {
        extensions: [".zip"],
        mimetypes: [
        "application/zip",
        "application/x-zip-compressed",
        "multipart/x-zip",
        ],
    },
    image: {
        extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        mimetypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        ],
    },
    code: {
        extensions: [
        ".js",
        ".ts",
        ".tsx",
        ".jsx",
        ".py",
        ".java",
        ".cpp",
        ".c",
        ".html",
        ".css",
        ".json",
        ".go",
        ".rs",
        ],
        mimetypes: [
        "text/plain",
        "application/json",
        "text/javascript",
        "text/x-python",
        "text/html",
        "text/css",
        ],
    },
    text: {
        extensions: [".txt"],
        mimetypes: ["text/plain"],
    },
};

export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; 

export function buildAcceptAttr(allowed: AllowedFileType[] | null): string {
    if (!allowed || allowed.length === 0) return "";
    if (allowed.includes("any")) return "";
    return allowed.flatMap((t) => fileTypeMap[t as Exclude<AllowedFileType, "any">]?.extensions ?? []).join(",");
}

export function isFileTypeAllowed(fileName: string, mimetype: string, allowed: AllowedFileType[] | null): boolean {
    if (!allowed || allowed.length === 0) return true; // no restriction set
    if (allowed.includes("any")) return true;

    const ext = "." + fileName.split(".").pop()?.toLowerCase();

    return allowed.some((t) => {
        const rule = fileTypeMap[t as Exclude<AllowedFileType, "any">];
        if (!rule) return false;
        return rule.extensions.includes(ext) || rule.mimetypes.includes(mimetype);
    });
}

export function resolveCloudinaryResourceType(mimetype: string): "image" | "raw" {
    return mimetype.startsWith("image/") ? "image" : "raw";
}
