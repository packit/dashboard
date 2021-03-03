import React from "react";
import { Label, Tooltip } from "@patternfly/react-core";

const StatusLabel = (props) => {
    if (props.success == true) {
        return <Label color="green">Success</Label>;
    } else {
        return <Label color="red">Failed</Label>;
    }
};

export default StatusLabel;
