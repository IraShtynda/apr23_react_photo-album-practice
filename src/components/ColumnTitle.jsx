import React from 'react';
import cn from 'classnames';

type Props = {
  name: string,
  isReversed: boolean,
  sortType: string,
  onSelect: (value: string) => void,
};

export const ColumnTitle: React.FC<Props> = ({
  name,
  isReversed,
  sortType,
  onSelect,
}) => (
  <th>
    <span className="is-flex is-flex-wrap-nowrap">
      {name}

      <a
        href="#/"
        onClick={() => onSelect(name)}
      >
        <span className="icon">
          <i
            className={cn('fas', {
              'fa-sort': sortType !== name,
              'fa-sort-down': sortType === name && isReversed,
              'fa-sort-up': sortType === name && !isReversed,
            })}
          />
        </span>
      </a>
    </span>
  </th>
);
