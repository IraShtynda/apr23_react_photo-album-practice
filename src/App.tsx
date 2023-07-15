import React, { useState } from 'react';
import './App.scss';
import { Photo } from './types/Photo';
import { PhotoFilter } from './components/PhotoFilter';
import { PhotoTable } from './components/PhotoTable';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const preparedPhotos: Photo[] = photosFromServer.map((photo) => {
  const album = albumsFromServer.find(({ id }) => id === photo.albumId);
  const user = usersFromServer.find(({ id }) => id === album?.userId)
    || null;

  return { ...photo, album, user };
});

const sortPhotos = (photos: Photo[], sortType: string) => {
  return photos.sort((prA, prB) => {
    switch (sortType) {
      case 'ID':
        return prA.id - prB.id;

      case 'Photo':
        return prA.title.localeCompare(prB.title);

      case 'Album': {
        if (!prA.album || !prB.album) {
          return 0;
        }

        return prA.album.title.localeCompare(prB.album.title);
      }

      case 'User': {
        if (!prA.user || !prB.user) {
          return 0;
        }

        return prA.user.name.localeCompare(prB.user.name);
      }

      default:
        return 0;
    }
  });
};

interface FilterParams {
  userId: number;
  query: string;
  albumIds: number[];
  sortType: string;
  isReversed: boolean;
}

const getVisiblePhotos = (
  photos: Photo[],
  {
    userId,
    query,
    albumIds,
    sortType,
    isReversed,
  }: FilterParams,
) => {
  let visiblePhotos = [...photos];

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

  if (sortType) {
    visiblePhotos = sortPhotos(visiblePhotos, sortType);
  }

  if (isReversed) {
    visiblePhotos.reverse();
  }

  return visiblePhotos;
};

export const App: React.FC = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [albumIds, setAlbumIds] = useState<number[]>([]);
  const [sortType, setSortType] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  const visiblePhotos = getVisiblePhotos(
    preparedPhotos,
    {
      userId,
      query,
      albumIds,
      sortType,
      isReversed,
    },
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <PhotoFilter
          users={usersFromServer}
          albums={albumsFromServer}
          userId={userId}
          onUserIdChange={setUserId}
          query={query}
          onQueryChange={setQuery}
          albumIds={albumIds}
          setAlbumIds={setAlbumIds}
        />

        <div className="box table-container">
          {visiblePhotos.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          ) : (
            <PhotoTable
              photos={visiblePhotos}
              isReversed={isReversed}
              sortType={sortType}
              onReverseChange={setIsReversed}
              onSortTypeChange={setSortType}
            />
          )}
        </div>
      </div>
    </div>
  );
};
