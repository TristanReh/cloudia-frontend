import axios from "axios"
import FileObject from "../models/FileObjects"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type FileViewProps = {
    files: FileObject[]
}

export default function FileView({ files }: FileViewProps) {

    const [fileProgress, setFileProgress] = useState<number>(0);

    async function handleDownload(fileId: string, fileName : string) {
        axios.get(`http://localhost:8000/file?fileid=${fileId}`, {
            onDownloadProgress: (progressEvent) => {
                setFileProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
            },
            withCredentials: true
        }).then(res => {
            setFileProgress(100)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })


    }

    return (
        <div className="flex flex-col w-screen">
        <span>{fileProgress}</span>
        {
            files.map((file: FileObject) => {
                return (
                    <div className="m-2 flex justify-between items-center">
                        <span className="w-full">{file.filename}</span>
                        <span className="w-full">{file.filesize}</span>
                        <span className="w-full">{new Date(file.uploaddate).toDateString()}</span>
                        <div className="flex">
                            <button onClick={() => handleDownload(file.id, file.filename)} className="border rounded p-1">Download</button>
                        </div>
                    </div>
                )
            })
        }</div>
    )

}