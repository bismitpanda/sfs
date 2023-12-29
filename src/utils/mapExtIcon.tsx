import {
    FileText,
    FileArchive,
    FileImage,
    FileVideo,
    FileAudio,
    FileType,
    FileTerminal,
    FileKey,
    FileJson,
    FileDigit,
    FileAxis3D,
    FileSpreadsheet,
    FileQuestion,
    FileWarning,
} from "lucide-react";

export const getIcon = (ext: string) => {
    let icon;
    switch (ext) {
        case "txt":
            icon = <FileText />;
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
            icon = <FileArchive />;
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
            icon = <FileImage />;
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
            icon = <FileVideo />;
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
            icon = <FileAudio />;
            break;

        case "otf":
        case "ttf":
        case "woff2":
        case "woff":
            icon = <FileType />;
            break;

        case "ps1":
        case "cmd":
        case "bat":
        case "vbs":
        case "sh":
            icon = <FileTerminal />;
            break;

        case "key":
        case "pem":
            icon = <FileKey />;
            break;

        case "json":
            icon = <FileJson />;
            break;

        case "dat":
        case "bin":
            icon = <FileDigit />;
            break;

        case "stl":
        case "obj":
        case "fbx":
        case "gltf":
        case "glb":
        case "stp":
        case "blend":
            icon = <FileAxis3D />;
            break;

        case "csv":
        case "tsv":
        case "xls":
        case "xlsx":
            icon = <FileSpreadsheet />;
            break;

        case "log":
            icon = <FileWarning />;
            break;

        default:
            icon = <FileQuestion />;
            break;
    }

    return icon;
};
