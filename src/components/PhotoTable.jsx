import React from 'react';
import cn from 'classnames';
import { Photo } from '../types/Photo';
import { ColumnTitle } from './ColumnTitle';

type Props = {
  photos: Photo[],
  isReversed: boolean,
  sortType: string,
  onReverseChange: (value: boolean) => void,
  onSortTypeChange: (value: string) => void,
};

export const PhotoTable: React.FC<Props> = ({
  photos,
  isReversed,
  sortType,
  onReverseChange,
  onSortTypeChange,
}) => {
  const sortBy = (newSortType: string) => {
    const firstClick = newSortType !== sortType;
    const secondClick = newSortType === sortType && !isReversed;
    const thirdClick = newSortType === sortType && isReversed;

    if (firstClick) {
      onSortTypeChange(newSortType);
      onReverseChange(false);

      return;
    }

    if (secondClick) {
      onSortTypeChange(newSortType);
      onReverseChange(true);

      return;
    }

    if (thirdClick) {
      onSortTypeChange('');
      onReverseChange(false);
    }
  };

  return (
    <table className="table is-striped is-narrow is-fullwidth">
      <thead>
        <tr>
          <ColumnTitle
            name="ID"
            isReversed={false}
            sortType={sortType}
            onSelect={sortBy}
          />
          <ColumnTitle
            name="Photo"
            isReversed={false}
            sortType={sortType}
            onSelect={sortBy}
          />
          <ColumnTitle
            name="Album"
            isReversed={false}
            sortType={sortType}
            onSelect={sortBy}
          />
          <ColumnTitle
            name="User name"
            isReversed={false}
            sortType={sortType}
            onSelect={sortBy}
          />
        </tr>
      </thead>

      <tbody>
        {photos.map(({ album, user, ...photo }) => (
          <tr key={photo.id}>
            <td className="has-text-weight-bold">
              {photo.id}
            </td>

            <td>{photo.title}</td>
            <td>{album?.title}</td>

            <td className={cn({
              'has-text-link': user?.sex === 'm',
              'has-text-danger': user?.sex === 'f',
            })}
            >
              {user?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
