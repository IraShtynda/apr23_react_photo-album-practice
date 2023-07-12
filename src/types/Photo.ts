import { User } from "./User";
import { Album } from "./Album";

export interface Photo {
  albumId: number,
  id: number,
  title: string,
  url: string,

  album?: Album;
  user: User | null;
}
