import { format, formatISO } from "date-fns";

import type { FC } from "react";

export interface FormattedDateProps {
  date: Date;
  emoji?: true;
}

const FormattedDate: FC<FormattedDateProps> = ({ date, emoji }) => {
  return (
    <time dateTime={formatISO(date)}>
      <span className="text-gray-400">
        {emoji && <>📅</>} {format(date, "LLLL d, yyyy")}
      </span>
    </time>
  );
};

export default FormattedDate;
