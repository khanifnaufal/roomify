import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useOutletContext } from 'react-router';
import { PROGRESS_INCREMENT, PROGRESS_INTERVAL_MS, REDIRECT_DELAY_MS } from '../lib/constants';

interface UploadProps {
    onComplete?: (data: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);

    const { isSignedIn } = useOutletContext<any>();

    const processFile = (selectedFile: File) => {
        if (!isSignedIn) return;

        setFile(selectedFile);
        setProgress(0);

        const reader = new FileReader();
        reader.onerror = () => {
            setFile(null);
            setProgress(0);
            
        }
        reader.onload = (e) => {
            const base64Data = e.target?.result as string;

            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += PROGRESS_INCREMENT;
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    setProgress(currentProgress);
                    clearInterval(interval);
                    
                    setTimeout(() => {
                        onComplete?.(base64Data);
                    }, REDIRECT_DELAY_MS);
                } else {
                    setProgress(currentProgress);
                }
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className='upload'>
            {!file ? (
                <div 
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input 
                        type="file" 
                        className='drop-input' 
                        accept='.jpg, .jpeg, .png' 
                        disabled={!isSignedIn} 
                        onChange={handleChange}
                    />
                <div className="drop-content">
                    <div className="drop-icon">
                        <UploadIcon size={20}/>
                    </div>
                    <p>
                        {isSignedIn ? (
                            "Click to upload or just drag and drop"
                        ): ("Sign in or sign up with Puter to upload")}
                    </p>
                    <p className='help'> Maximum file size 50 MB</p>
                </div>
                </div>
            ) : (
                <div className='upload-status'>
                    <div className="status-content">
                        <div className="status-icon">
                            {progress===100 ? (
                                <CheckCircle2 className='check'/>
                            ):(
                                <ImageIcon className='image' />
                            )}
                        </div>

                        <h3>{file.name}</h3>

                        <div className="progress">
                            <div className="bar" style={{width: `${progress}%`}}/>

                            <p className="status-text">
                                {progress < 100 ? 'Analyzing Floor Plan...' : 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Upload