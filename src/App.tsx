import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { Photo } from './types/Photo';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const preparedPhotos: Photo[] = photosFromServer.map((photo) => {
  const album = albumsFromServer.find(({ id }) => id === photo.albumId);
  const user = usersFromServer.find(({ id }) => id === album?.userId)
    || null;

  return { ...photo, album, user };
});

interface FilterParams {
  userId: number;
  query: string;
  albumIds: number[];
}

const getVisiblePhotos = (
  products: Photo[],
  {
    userId,
    query,
    albumIds,
  }: FilterParams,
) => {
  let visiblePhotos = [...products];

  if (userId) {
    visiblePhotos = visiblePhotos.filter(
      photo => photo.user?.id === userId,
    );
  }

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();

    visiblePhotos = visiblePhotos.filter(
      photo => photo.title.toLowerCase().includes(normalizedQuery),
    );
  }

  if (albumIds.length > 0) {
    visiblePhotos = visiblePhotos.filter(
      photo => albumIds.some(id => id === photo.albumId),
    );
  }

  return visiblePhotos;
};

export const App: React.FC = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [albumIds, setAlbumIds] = useState<number[]>([]);

  const visiblePhotos = getVisiblePhotos(
    preparedPhotos,
    {
      userId,
      query,
      albumIds,
    },
  );

  const reset = () => {
    setQuery('');
    setUserId(0);
    setAlbumIds([]);
  };

  function isAlbumSelected(albumId: number) {
    return albumIds.includes(albumId);
  }

  const toggleAlbum = (categoryId: number) => {
    if (isAlbumSelected(categoryId)) {
      setAlbumIds(albumIds.filter(id => id !== categoryId));
    } else {
      setAlbumIds([...albumIds, categoryId]);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                onClick={() => setUserId(0)}
                className={cn({
                  'is-active': !userId,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  onClick={() => setUserId(user.id)}
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
                  onChange={event => setQuery(event.target.value)}
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
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              {albumsFromServer.map(album => (
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

        <div className="box table-container">
          {visiblePhotos.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          ) : (
            <table
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Photo name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Album name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visiblePhotos.map(({ album, user, ...photo }) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
