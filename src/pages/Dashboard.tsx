import axios from "axios";
import FileDragAndDrop from "../components/FileDragAndDrop";
import FileView from "../components/FileView";
import FileObject from "../models/FileObjects";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const [files, setFiles] = useState<FileObject[]>([])


  useEffect(()=> {
    getFiles()
  }, [])

  function getFiles() {
    axios.get("http://localhost:8000/files", {
      withCredentials: true
    }).then(res => {
      setFiles(res.data)
    })
  

  }
    return (
      <div>
        <FileDragAndDrop/>
        <FileView files={files}/>
      </div>
    )
}