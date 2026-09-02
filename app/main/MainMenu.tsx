import React from 'react';
import MainMenuCard from './MainMenuCard';

const MainMenu = () => {
    return (
        <>
            <div className="page-header">
                <div>
                    <p className="page-kicker">Workspace</p>
                    <h1 className="page-title">Choose a module</h1>
                </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <MainMenuCard 
                    title='Face Detection'
                    description='Find faces in stills or a live feed. Snap a photo, upload a file, or stream from the browser camera.'
                    icon='/main_menu_images/face_detection_icon.png'
                    redirectPath='/main/face-detection'
                />
                <MainMenuCard 
                    title='Face Recognition'
                    description='Match faces against a group dataset. Build encodings, then identify people from snaps or live video.'
                    icon='/main_menu_images/face_recognition_icon.png'
                    redirectPath='/main/face-recognition'
                />
                <MainMenuCard 
                    title='Profiles'
                    description='People records and reference images used for recognition, groups, and access lists.'
                    icon='/main_menu_images/profiles_icon.png'
                    redirectPath='/main/profiles'
                />
                <MainMenuCard 
                    title='Continuous Vigilance'
                    description='Keep a persistent feed running and retain detections over time.'
                    icon='/main_menu_images/continuous_vigilance_icon.png'
                    redirectPath='/main/continuous-vigilance'
                />
                <MainMenuCard 
                    title='Access Control'
                    description='Build allow lists and run a door or site as a recognition-backed gate.'
                    icon='/main_menu_images/access_control_icon.png'
                    redirectPath='/main/access-control'
                />
                <MainMenuCard 
                    title='Groups'
                    description='Bundle profiles into datasets for recognition, vigilance, and access control.'
                    icon='/main_menu_images/groups_icon.png'
                    redirectPath='/main/groups'
                />
            </div>
        </>
    );
};

export default MainMenu;
