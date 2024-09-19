import axios from "axios"
import FileObject from "../models/FileObjects"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type FileViewProps = {
    files: FileObject[]
}

enum LoadingState {
    DOWNLOADING,
    COMPLETED
}

interface FileProgress {
    downloadProgress: number;
    loadingState: LoadingState;
}

interface FileProgressHash { 
    [key: string]: FileProgress
}



export default function FileView({ files }: FileViewProps) {

    const [fileProgresses, setFileProgresses] = useState<FileProgressHash>({});


    useEffect(() => {
        
    }, [fileProgresses])

    async function handleDownload(fileId: string, fileName: string) {
        if (!fileProgresses[fileId]) {
            setFileProgresses(prevState => ({
                ...prevState,
                [fileId]: {
                    downloadProgress: 0,  
                    loadingState: LoadingState.DOWNLOADING  
                }
            }));
        }

        axios.get(`http://localhost:8000/file?fileid=${fileId}`, {
            responseType: 'blob',  // Ensure the file is treated as a blob
            onDownloadProgress: (progressEvent) => {
                const progress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                setFileProgresses(prevState => ({
                    ...prevState, 
                    [fileId]: {
                        ...prevState[fileId], 
                        downloadProgress: progress
                    }
                }));
            },
            withCredentials: true
        }).then((res) => {

            setFileProgresses(prevState => ({
                ...prevState, 
                [fileId]: {
                    ...prevState[fileId],
                    loadingState: LoadingState.COMPLETED
                }
            }));

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();

            const deleteProgressTimeout = setTimeout(() => {
                setFileProgresses(prevState => {
                    const newState = { ...prevState };
                    delete newState[fileId];  
                    return newState;  
                });
            }, 2501);
    
            return () => clearTimeout(deleteProgressTimeout);
        }).catch((error) => {
            console.error("Download error:", error);
        });
    }

    return (
        <div className="flex flex-col w-screen">
        <span>{}</span>
        {
            files.map((file: FileObject) => {
                return (
                    <div className="m-2 flex justify-between items-center">
                        <span className="w-full">{file.filename}</span>
                        <span className="w-full">{(file.filesize / 1000000).toFixed(2)} MB</span>
                        <span className="w-full">{new Date(file.uploaddate).toDateString()}</span>
                        <div className="flex">
                            <button 
                                disabled={!!fileProgresses[file.id]} 
                                onClick={() => handleDownload(file.id, file.filename)} 
                                className="border rounded p-1 w-[130px] relative"
                                style={fileProgresses[file.id] && fileProgresses[file.id].loadingState == LoadingState.COMPLETED ? {background: "#4fe064"} : {}}
                            >
                                <div style={fileProgresses[file.id] ? {width: `${fileProgresses[file.id].downloadProgress}%`} : {}} className="transition-all ease-in absolute top-0 left-0 bg-[#4fe064] h-full z-0"></div>
                                <span className="relative z-10">
                                {
                                    !fileProgresses[file.id] ? "Download" : 
                                        fileProgresses[file.id].loadingState == LoadingState.DOWNLOADING ? fileProgresses[file.id].downloadProgress + " %"
                                            : "100 %"
                                     
                                }
                                </span>
                            </button>
                        </div>
                    </div>
                )
            })
        }</div>
    )

}