import { Tooltip } from "@patternfly/react-core";
import React from "react";

/*
 * Get a pretty string like 'an hour ago', 'yesterday', '3 months ago',
 * 'just now'.
 * https://stackoverflow.com/questions/1551382/user-friendly-time-format-in-python
 */
const prettyTimeDifference = (difference: number) => {
  let secondDiff = difference;
  let dayDiff = Math.floor(difference / (60 * 60 * 24));

  // we set this to null further down the code to indicate estimates like "just now" and "a minute ago"
  let numericPart: number | null = dayDiff / 365;
  let units = " years ago";

  if (dayDiff === 0) {
    [numericPart, units] = [secondDiff / 3600, " hours ago"];

    if (secondDiff < 10) {
      [numericPart, units] = [null, "just now"];
    } else if (secondDiff < 60) {
      [numericPart, units] = [secondDiff, " seconds ago"];
    } else if (secondDiff < 120) {
      [numericPart, units] = [null, "a minute ago"];
    } else if (secondDiff < 3600) {
      [numericPart, units] = [secondDiff / 60, " minutes ago"];
    } else if (secondDiff < 7200) {
      [numericPart, units] = [null, "an hour ago"];
    }
  } else if (dayDiff === 1) {
    [numericPart, units] = [null, "yesterday"];
  } else if (dayDiff < 7) {
    [numericPart, units] = [dayDiff, " days ago"];
  } else if (dayDiff < 31) {
    [numericPart, units] = [dayDiff / 7, " weeks ago"];
  } else if (dayDiff < 365) {
    [numericPart, units] = [dayDiff / 30, " months ago"];
  }

  return `${numericPart ? Math.floor(numericPart) : ""}${units}`;
};

const getPrettyTime = (date: number | Date | null) => {
  if (date === null) {
    return null;
  }

  let now = Date.now();
  let diff = Math.floor(
    (now - (date instanceof Date ? date.getTime() : date)) / 1000,
  );

  return prettyTimeDifference(diff);
};

interface TimestampProps {
  stamp: number | null;
  verbose?: boolean;
}

const Timestamp: React.FC<TimestampProps> = (props) => {
  if (props.stamp === null) {
    return <span>not provided</span>;
  }

  // Convert UNIX timestamp into date object, Date gets passed **milliseconds**
  // since Epoch.
  const time = new Date(1000 * props.stamp);

  let prettyTime = getPrettyTime(time);
  let verboseTime = time.toLocaleString();

  if (props.verbose) {
    [prettyTime, verboseTime] = [verboseTime, prettyTime ?? ""];
  }

  return (
    <Tooltip content={verboseTime}>
      <span>{prettyTime}</span>
    </Tooltip>
  );
};

export { Timestamp };
