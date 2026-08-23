import { FaFileUpload } from 'react-icons/fa';

const FaceDetectionSnap = () => {
    return (
    <>
        <div className='flex flex-col'>
            <video className='video-stage'></video>
            <div className='toolbar'>
                <button type="button" className="icon-btn-lg" aria-label="Upload">
                    <FaFileUpload/>
                </button>
            </div>
        </div>
    </>
    )
};

export default FaceDetectionSnap;
