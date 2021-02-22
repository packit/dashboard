import React from "react";
import { Label, Tooltip } from "@patternfly/react-core";

const ChrootStatus = (props) => {
    let chroot = props.chroot;
    let status = props.status;
    switch (status) {
        case "success":
            return (
                <Tooltip content="Success">
                    <span style={{ padding: "2px" }}>
                        <Label color="green">{chroot}</Label>
                    </span>
                </Tooltip>
            );
        // No "break;" here cause return means that the break will be unreachable
        case "failure":
            return (
                <Tooltip content="Failure">
                    <span style={{ padding: "2px" }}>
                        <Label color="red">{chroot}</Label>
                    </span>
                </Tooltip>
            );
        // No "break;" here cause return means that the break will be unreachable
        default:
            return (
                <Tooltip content="Pending">
                    <span style={{ padding: "2px" }}>
                        <Label color="purple">{chroot}</Label>
                    </span>
                </Tooltip>
            );
    }
};

export default ChrootStatus;
