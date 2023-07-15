import cn from 'classnames';
import React from 'react';
import { User } from '../types/User';
import { Album } from '../types/Album';

type Props = {
  users: User[];
  userId: number;
  onUserIdChange: (value: number) => void;
  query: string;
  onQueryChange: (value: string) => void;
  albums: Album[],
  albumIds: number[];
  setAlbumIds: (value: number[]) => void;
};

export const PhotoFilter: React.FC<Props> = ({
  users,
  userId,
  onUserIdChange,
  query,
  onQueryChange,
  albums,
  albumIds,
  setAlbumIds,
}) => {
  const isAlbumSelected = (albumId: number) => {
    return albumIds.includes(albumId);
  };

  const toggleAlbum = (albumId: number) => {
    if (isAlbumSelected(albumId)) {
      setAlbumIds(albumIds.filter(id => id !== albumId));
    } else {
      setAlbumIds([...albumIds, albumId]);
    }
  };

  const reset = () => {
    onQueryChange('');
    onUserIdChange(0);
    setAlbumIds([]);
  };

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            onClick={() => onUserIdChange(0)}
            className={cn({
              'is-active': !userId,
            })}
          >
            All
          </a>

          {users.map(user => (
            <a
              key={user.id}
              href="#/"
              onClick={() => onUserIdChange(user.id)}
              className={cn({
                'is-active': userId === user.id,
              })}
            >
              {user.name}
            </a>
          ))}
        </p>

        <div className="panel-block">
          <p className="control has-icons-left has-icons-right">
            <input
              type="text"
              className="input"
              placeholder="Search"
              value={query}
              onChange={event => onQueryChange(event.target.value)}
            />

            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true" />
            </span>

            {query && (
              <span className="icon is-right">
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <button
                  type="button"
                  className="delete"
                  onClick={() => onQueryChange('')}
                />
              </span>
            )}
          </p>
        </div>

        <div className="panel-block is-flex-wrap-wrap">
          {albums.map(album => (
            <a
              key={album.id}
              className={cn('button mr-2 my-1', {
                'is-info': isAlbumSelected(album.id),
              })}
              href="#/"
              onClick={() => toggleAlbum(album.id)}
            >
              {album.title}
            </a>
          ))}
        </div>

        <div className="panel-block">
          <a
            href="#/"
            className="button is-link is-outlined is-fullwidth"
            onClick={reset}
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};
