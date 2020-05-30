import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private static readonly BASE_URL = 'https://udang-http-requests.firebaseio.com';
  public static readonly POSTS_URL = PostsService.BASE_URL + '/posts.json';

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    this.http
      .post<{name: string}>(
        PostsService.POSTS_URL,
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>(PostsService.POSTS_URL)
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }

        return postsArray;
      }
    ));
  }

  clearPosts() {
    return this.http.delete(PostsService.POSTS_URL);
  }
}
