import { superballs } from 'ldrs'


export const SuperBallLoader = () => {
    superballs.register();
    return (
        <l-superballs
            size="40"
            speed="1.4" 
            color="black" 
        ></l-superballs>
    )
}