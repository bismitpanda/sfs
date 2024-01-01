import {
    File,
    FileArchive,
    FileAudio,
    FileAxis3D,
    FileDigit,
    FileImage,
    FileJson,
    FileKey,
    FileSpreadsheet,
    FileTerminal,
    FileText,
    FileType,
    FileVideo,
    FileWarning,
} from "lucide-react";

export const getIcon = (path: string) => {
    const ext = path.split(".").at(-1);
    let icon;
    switch (ext) {
        case "txt":
            icon = <FileText size={18} strokeWidth={1} />;
            break;

        case "zip":
        case "a":
        case "xz":
        case "7z":
        case "rar":
        case "zipx":
        case "bz2":
        case "lz4":
        case "lzo":
        case "iso":
        case "lbr":
        case "cab":
        case "tar":
        case "shar":
        case "gz":
        case "pak":
        case "jar":
        case "apk":
        case "dmg":
        case "lz":
        case "ar":
        case "lzma":
        case "cpio":
        case "arc":
            icon = <FileArchive size={18} strokeWidth={1} />;
            break;

        case "apng":
        case "png":
        case "gif":
        case "bmp":
        case "webp":
        case "avif":
        case "jpeg":
        case "tiff":
        case "svg":
        case "heic":
        case "ico":
        case "jpg":
            icon = <FileImage size={18} strokeWidth={1} />;
            break;

        case "mov":
        case "drc":
        case "mkv":
        case "avi":
        case "mpg":
        case "flv":
        case "vob":
        case "wmv":
        case "webm":
        case "mpeg":
        case "mp4":
            icon = <FileVideo size={18} strokeWidth={1} />;
            break;

        case "au":
        case "flac":
        case "m4a":
        case "aac":
        case "mpc":
        case "wav":
        case "ogv":
        case "aiff":
        case "aa":
        case "opus":
        case "mp3":
        case "ogg":
            icon = <FileAudio size={18} strokeWidth={1} />;
            break;

        case "otf":
        case "ttf":
        case "woff2":
        case "woff":
            icon = <FileType size={18} strokeWidth={1} />;
            break;

        case "ps1":
        case "cmd":
        case "bat":
        case "vbs":
        case "sh":
            icon = <FileTerminal size={18} strokeWidth={1} />;
            break;

        case "key":
        case "pem":
            icon = <FileKey size={18} strokeWidth={1} />;
            break;

        case "json":
            icon = <FileJson size={18} strokeWidth={1} />;
            break;

        case "dat":
        case "bin":
            icon = <FileDigit size={18} strokeWidth={1} />;
            break;

        case "stl":
        case "obj":
        case "fbx":
        case "gltf":
        case "glb":
        case "stp":
        case "blend":
            icon = <FileAxis3D size={18} strokeWidth={1} />;
            break;

        case "csv":
        case "tsv":
        case "xls":
        case "xlsx":
            icon = <FileSpreadsheet size={18} strokeWidth={1} />;
            break;

        case "log":
            icon = <FileWarning size={18} strokeWidth={1} />;
            break;

        default:
            icon = <File size={18} strokeWidth={1} />;
            break;
    }

    return icon;
};
