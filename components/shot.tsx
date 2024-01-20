import {Chip} from "@nextui-org/chip";

export const ShootPoint = ({made, x, y}) => {
    return(
        <div style={{position:"absolute", left:x + "px", top:y + "px", zIndex:"10"}}>
            <Chip color={made ? "success" : "danger"}> </Chip>
        </div>
    )
}