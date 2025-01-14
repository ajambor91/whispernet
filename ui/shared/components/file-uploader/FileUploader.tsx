import styled from "styled-components";
import React, { useState } from "react";

const FileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 40px 5px;
    margin-top: 20px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    background-color: #1c1e2e;
    width: 100%;
    text-align: center;
    color: #ccc;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        border-color: #00bcd4;
        color: #00bcd4;
    }

    &.drag-over {
        border-color: #00bcd4;
        background-color: #1a2634;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const FileLabel = styled.label`
    cursor: pointer;
    color: #ccc;
    font-size: 1rem;
    font-family: 'Arial', sans-serif;
    transition: color 0.3s;

    &:hover {
        color: #00bcd4;
    }
`;

const FileName = styled.p`
    font-size: 0.9rem;
    color: #fff;
    word-break: break-all;
`;
interface IFileUploaderProps {
    onFile: (file: File) => void
}
const FileUploader: React.FC<IFileUploaderProps> = ({onFile}) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFile(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            setFileName(file.name);
            onFile(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    return (
        <FileContainer
            className={isDragOver ? "drag-over" : ""}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <FileInput
                id="file-upload"
                type="file"
                onChange={handleFileChange}
            />
            <FileLabel htmlFor="file-upload">
                {fileName ? "Change File" : "Click to select or drag file here"}
            </FileLabel>
            {fileName && <FileName>Selected File: {fileName}</FileName>}
        </FileContainer>
    );
};

export default FileUploader;
