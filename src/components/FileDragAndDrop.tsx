import axios from "axios";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

export default function FileDragAndDrop()
{
    const [file, setFile] = useState<File | null>(null);

    const handleChange = async (file : File) => {
        setFile(file);
    };

    async function handleUpload() {
        const fileData = new FormData();
        fileData.append('file', file ? file : "");
        
        await axios.post("http://localhost:8000/upload", fileData, {
            withCredentials: true
        })
    }

    return (
        <>
            <FileUploader handleChange={handleChange} name="file"/>
            <button className="border-black rounded-xl p-2 border-[2px]" onClick={handleUpload}>Upload</button>
        </>
    );
}