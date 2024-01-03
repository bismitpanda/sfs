import {
    File,
    FileArchive,
    FileAudio2,
    FileBox,
    FileCog,
    FileDigit,
    FileImage,
    FileJson2,
    FileKey2,
    FileSpreadsheet,
    FileTerminal,
    FileText,
    FileType2,
    FileVideo2,
    FileWarning,
} from "lucide-react";

export const getIcon = (name: string) => {
    const ext = name.split(".").at(-1);
    let icon;
    switch (ext) {
        case "txt":
            icon = FileText;
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
            icon = FileArchive;
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
            icon = FileImage;
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
            icon = FileVideo2;
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
            icon = FileAudio2;
            break;

        case "otf":
        case "ttf":
        case "woff2":
        case "woff":
            icon = FileType2;
            break;

        case "ps1":
        case "cmd":
        case "bat":
        case "vbs":
        case "sh":
            icon = FileTerminal;
            break;

        case "key":
        case "pem":
            icon = FileKey2;
            break;

        case "json":
            icon = FileJson2;
            break;

        case "dat":
        case "bin":
            icon = FileDigit;
            break;

        case "stl":
        case "obj":
        case "fbx":
        case "gltf":
        case "glb":
        case "stp":
        case "blend":
            icon = FileBox;
            break;

        case "csv":
        case "tsv":
        case "xls":
        case "xlsx":
            icon = FileSpreadsheet;
            break;

        case "log":
            icon = FileWarning;
            break;

        case "yml":
        case "yaml":
        case "toml":
            icon = FileCog;
            break;

        default:
            icon = File;
            break;
    }

    return icon;
};
