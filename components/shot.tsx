import {Chip} from "@nextui-org/chip";

// @ts-ignore
export const ShootPoint = ({made, x, y}) => {
    return(
        <div style={{position:"absolute", left:x + "px", top:y + "px", zIndex:"10", pointerEvents: "none"}}>
            <Chip style={{pointerEvents: "none"}} color={made ? "success" : "danger"}> </Chip>
        </div>
    )
}