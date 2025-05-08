import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

export default function SignalArrow({ signal }) {
    if (signal === "UP") {
        return <FaArrowTrendUp style={{ color: "green", fontSize: "18px" }} />;
    } else if (signal === "DOWN") {
        return <FaArrowTrendDown style={{ color: "red", fontSize: "18px" }} />;
    } else {
        return <span style={{ color: "gray", fontSize: "18px" }}>–</span>;
    }
}
