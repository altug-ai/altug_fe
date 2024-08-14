

import React, { useState, useRef, useEffect } from "react";
import {
    BsRecordCircleFill,
    BsPauseCircleFill,
    BsStopCircleFill,
    BsPlayCircleFill,
} from "react-icons/bs";
import { FaCameraRotate } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

const VideoRecorder = ({
    setShowVideo,
}: any) => {
    const [mediaStream, setMediaStream] = useState<any>(null);
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showSwitchButton, setShowSwitchButton] = useState(false);

    const videoRef = useRef<any>(null);
    const previewVideoRef = useRef<any>(null);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
        };
    }, []);


    console.log("the show switch button", showSwitchButton, recording)

    useEffect(() => {
        async function getAvailableCameras() {
            if (mediaStream) {
                const videoTracks = mediaStream.getVideoTracks();
                const hasMultipleCameras = videoTracks.length > 1;
                const devices = await navigator.mediaDevices.enumerateDevices();
                console.log("devices ", devices);
                const videoDevices = devices.filter(
                    (device) => device.kind === "videoinput"
                );
                console.log("videoDevices is ", videoDevices.length);
                if (videoDevices.length > 0) {
                    setShowSwitchButton(true);
                }
            }
        }
        getAvailableCameras();
    }, [mediaStream]);

    const startRecording = async (facingMode: any) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        exact: facingMode,
                    },
                },
                audio: true,
            });
            setMediaStream(stream);
            previewVideoRef.current.srcObject = stream;
            const recorder: any = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            let chunks: any = [];
            recorder.ondataavailable = (event: any) => {
                chunks.push(event.data);
            };
            recorder.start();
            recorder.onstop = () => {
                clearInterval(timerRef.current);
                setRecordedChunks(chunks);
                setRecording(false);
                setPaused(false);
            };
            setRecording(true);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const switchCamera = () => {
        if (!mediaStream) return;
        const videoTracks = mediaStream.getVideoTracks();

        const currentFacingMode = videoTracks[0].getSettings().facingMode;

        console.log("currentFacingMode is ", currentFacingMode);
        const newFacingMode = currentFacingMode === "user" ? "environment" : "user";
        stopRecording();
        startRecording(newFacingMode);
    };

    const pauseRecording = () => {
        if (mediaRecorder && !paused) {
            clearInterval(timerRef.current);
            mediaRecorder.pause();
            setPaused(true);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorder && paused) {
            setPaused(false);
            timerRef.current = setInterval(() => {
                // Timer logic if needed
            }, 1000);
            mediaRecorder.resume();
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaStream.getTracks().forEach((track: any) => track.stop());
        }
    };


    const discardRecording = () => {
        setRecordedChunks([]);
        setMediaStream(null);
        setMediaRecorder(null);
    };

    const videoStyle = {
        maxWidth: recording ? "80vw" : "300px",
        maxHeight: recording ? "80vh" : "300px",
    };

    return (
        <div>
            <div className="flex">
                {!recording && !recordedChunks.length && (
                    <BsRecordCircleFill
                        onClick={() => startRecording("user")}
                        style={iconStyle}
                    />
                )}
                {!paused && recording && (
                    <BsPauseCircleFill onClick={pauseRecording} style={iconStyle} />
                )}
                {paused && recording && (
                    <BsPlayCircleFill onClick={resumeRecording} style={iconStyle} />
                )}
                {recording && (
                    <BsStopCircleFill onClick={stopRecording} style={iconStyle} />
                )}
                {showSwitchButton && recording && (
                    <FaCameraRotate
                        onClick={switchCamera}
                        // disabled={!mediaStream}
                        style={iconStyle}
                    />
                )}

                <MdCancel
                    onClick={() => {
                        stopRecording();
                        setShowVideo(false);
                    }}
                    style={{
                        ...iconStyle,
                        color: "red",
                        top: "4px",
                        right: "5px",
                        position: "absolute",
                    }}
                />
            </div>
            <video
                ref={previewVideoRef}
                style={{ display: recording ? "block" : "none", ...videoStyle }}
                autoPlay
                muted
                controls={false}
            //duration
            ></video>

            {recordedChunks.length > 0 && (
                <div>
                    {/* <video ref={videoRef} controls style={videoStyle}>
            {recordedChunks.map((chunk, index) => (
              <source
                key={index}
                src={URL.createObjectURL(chunk)}
                type="video/webm"
              />
            ))}
          </video> */}

                </div>
            )}
        </div>
    );
};

const iconStyle = {
    cursor: "pointer",
    color: "#bbf246",
    marginBottom: "10px",
    marginRight: "10px",
};

const buttonStyle = {
    cursor: "pointer",
    backgroundColor: "#bbf246",
    marginBlock: "10px",
    marginRight: "10px",
    paddingBlock: "4px",
    paddingInline: "6px",
    borderRadius: "10px",
    border: "none",
};

export default VideoRecorder;